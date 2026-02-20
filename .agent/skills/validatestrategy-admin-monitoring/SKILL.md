# ValidateStrategy Admin Monitoring Skill

> **Domain:** Admin Panel, Error Monitoring, Operations Tracking
> **Project:** ValidateStrategyLive

---

## Overview

ValidateStrategyLive has a comprehensive admin panel accessible only via admin wallet authentication (SIWE). It provides monitoring for:
- Analysis operations and progress
- Payment processing
- Error tracking and retry queues
- Circuit breaker status
- User statistics

---

## Admin Access

### Authentication

```typescript
// ONLY admin wallets can access
adminProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({ ctx });
});
```

### Admin Wallets

```sql
-- adminWallets table
CREATE TABLE adminWallets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  walletAddress VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Environment Variable

```env
ADMIN_WALLET_ADDRESS=0x...  # Primary admin
VITE_ADMIN_WALLET_ADDRESS=0x...  # For frontend check
```

---

## Key Files

| Purpose | File |
|---------|------|
| Admin router | `server/routers/adminRouter.ts` |
| Admin page | `client/src/pages/Admin.tsx` |
| Operation tracker | `server/services/safeOperationTracker.ts` |
| Error monitoring | `server/services/errorMonitoring.ts` |
| Retry queue | `server/services/retryQueueProcessor.ts` |

---

## Operations Center (Event Sourcing)

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  OPERATIONS CENTER (Event Sourcing)                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Every analysis action creates an EVENT:                    │
│                                                             │
│  analysisOperations table                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ operationId | sessionId | tier | status | startedAt   │ │
│  │ op_123      | sess_abc  | full | in_progress | ...    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  analysisOperationEvents table                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ eventId | operationId | eventType | data | createdAt  │ │
│  │ evt_1   | op_123      | STARTED   | {...} | ...       │ │
│  │ evt_2   | op_123      | PART_1_COMPLETE | {...} | ... │ │
│  │ evt_3   | op_123      | PART_2_COMPLETE | {...} | ... │ │
│  │ evt_4   | op_123      | FAILED    | {error} | ...     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Event Types

```typescript
type OperationEventType =
  | "STARTED"
  | "PART_1_COMPLETE"
  | "PART_2_COMPLETE"
  | "PART_3_COMPLETE"
  | "PART_4_COMPLETE"
  | "PART_5_COMPLETE"
  | "PART_6_COMPLETE"
  | "COMPLETED"
  | "FAILED"
  | "RETRYING"
  | "PARTIAL_SUCCESS";
```

### Safe Tracker Pattern

```typescript
// server/services/safeOperationTracker.ts
// ALL tracking is fire-and-forget - NEVER blocks main flow

export function trackAnalysisStart(sessionId: string, tier: string, actorType: string) {
  // Fire-and-forget - don't await, don't block
  safeTrack(async () => {
    await createOperation({ sessionId, tier, status: "in_progress" });
    await createEvent({ operationId, type: "STARTED", data: { actorType } });
  });
}

export function trackPartComplete(sessionId: string, partNum: number, content: string, duration: number) {
  safeTrack(async () => {
    await createEvent({
      operationId: getOperationId(sessionId),
      type: `PART_${partNum}_COMPLETE`,
      data: { contentLength: content.length, duration },
    });
  });
}

export function trackAnalysisFailure(sessionId: string, error: Error, failedPart: number) {
  safeTrack(async () => {
    await createEvent({
      operationId: getOperationId(sessionId),
      type: "FAILED",
      data: { error: error.message, failedPart },
    });
    await updateOperation(sessionId, { status: "failed" });
  });
}
```

---

## Circuit Breaker Monitoring

### State Machine

```
CLOSED → (failures >= threshold) → OPEN
OPEN → (timeout elapsed) → HALF_OPEN
HALF_OPEN → (success) → CLOSED
HALF_OPEN → (failure) → OPEN
```

### Admin View

```typescript
// adminRouter.ts
getCircuitBreakerStatus: adminProcedure.query(async () => {
  return {
    state: perplexityCircuitBreaker.getState(), // CLOSED | OPEN | HALF_OPEN
    failureCount: perplexityCircuitBreaker.getFailureCount(),
    lastFailure: perplexityCircuitBreaker.getLastFailureTime(),
    threshold: 5,
    resetTimeout: 60000, // 1 minute
  };
});

// Admin can manually reset
resetCircuitBreaker: adminProcedure.mutation(async () => {
  perplexityCircuitBreaker.reset();
  return { success: true };
});
```

---

## Retry Queue Dashboard

### Queue Stats

```typescript
// adminRouter.ts
getRetryQueueStats: adminProcedure.query(async () => {
  const queue = await getRetryQueue();

  return {
    total: queue.length,
    byTier: {
      standard: queue.filter(j => j.tier === "standard").length,
      medium: queue.filter(j => j.tier === "medium").length,
      full: queue.filter(j => j.tier === "full").length,
    },
    byRetryCount: {
      0: queue.filter(j => j.retryCount === 0).length,
      1: queue.filter(j => j.retryCount === 1).length,
      2: queue.filter(j => j.retryCount === 2).length,
      '3+': queue.filter(j => j.retryCount >= 3).length,
    },
    oldestJob: queue[0]?.createdAt,
  };
});

// Admin can manually retry a job
retryJob: adminProcedure
  .input(z.object({ jobId: z.string() }))
  .mutation(async ({ input }) => {
    await processRetryJob(input.jobId);
    return { success: true };
  });
```

---

## Error Dashboard

### Error Categories

```typescript
enum ErrorCategory {
  API_ERROR = "api_error",           // Perplexity/external API
  NETWORK_ERROR = "network_error",   // Timeouts, connection
  VALIDATION_ERROR = "validation",   // Input validation
  AUTH_ERROR = "auth",               // Authentication
  PAYMENT_ERROR = "payment",         // Payment processing
  DATABASE_ERROR = "database",       // DB queries
  FATAL = "fatal",                   // Unrecoverable
}
```

### Error Aggregation

```typescript
// adminRouter.ts
getErrorStats: adminProcedure.query(async () => {
  const errors = await getRecentErrors(24 * 60 * 60 * 1000); // Last 24h

  return {
    total: errors.length,
    byCategory: groupBy(errors, 'category'),
    byHour: groupByHour(errors),
    topErrors: getTopErrors(errors, 10),
    retryable: errors.filter(e => e.isRetryable).length,
    fatal: errors.filter(e => e.category === 'fatal').length,
  };
});
```

---

## Admin Panel Components

### Stats Overview

```typescript
// client/src/pages/Admin.tsx
const { data: stats } = trpc.admin.getStats.useQuery();

<StatsOverview
  totalSessions={stats.totalSessions}
  completedAnalyses={stats.completedAnalyses}
  pendingAnalyses={stats.pendingAnalyses}
  failedAnalyses={stats.failedAnalyses}
  totalRevenue={stats.totalRevenue}
  conversionRate={stats.conversionRate}
/>
```

### Operations Table

```typescript
<OperationsTable
  operations={operations}
  onRetry={(sessionId) => retryMutation.mutate({ sessionId })}
  onViewEvents={(operationId) => setSelectedOperation(operationId)}
/>
```

### Event Timeline

```typescript
// View all events for an operation
<EventTimeline
  events={events}
  // Shows: STARTED → PART_1 → PART_2 → ... → COMPLETED/FAILED
/>
```

---

## Notifications to Admin

### Critical Alerts

```typescript
// server/_core/notification.ts
export async function notifyOwner(params: {
  title: string;
  content: string;
  priority?: "low" | "medium" | "high";
}) {
  // Send email to admin
  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `[${params.priority?.toUpperCase() || 'INFO'}] ${params.title}`,
    text: params.content,
  });

  // Could also: Slack webhook, Discord, SMS, etc.
}

// Usage in error handler
if (tier === 'full' && error.category === 'fatal') {
  await notifyOwner({
    title: 'Syndicate Analysis Failed - Manual Intervention Required',
    content: `Session: ${sessionId}\nError: ${error.message}`,
    priority: 'high',
  });
}
```

---

## Admin Audit Log

```sql
-- adminLogs table
CREATE TABLE adminLogs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  adminWalletAddress VARCHAR(255) NOT NULL,
  action VARCHAR(255) NOT NULL,
  targetType VARCHAR(50),  -- 'session', 'user', 'operation'
  targetId VARCHAR(255),
  metadata JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

```typescript
// Log all admin actions
async function logAdminAction(ctx: Context, action: string, target?: { type: string; id: string }) {
  await db.insert(adminLogs).values({
    adminWalletAddress: ctx.user.walletAddress,
    action,
    targetType: target?.type,
    targetId: target?.id,
    metadata: {},
  });
}

// Usage
retryAnalysis: adminProcedure.mutation(async ({ input, ctx }) => {
  await logAdminAction(ctx, 'RETRY_ANALYSIS', { type: 'session', id: input.sessionId });
  // ... actual retry logic
});
```

---

## Dashboard Metrics

### Key Performance Indicators

| Metric | Calculation |
|--------|-------------|
| Success Rate | completed / (completed + failed) |
| Avg Completion Time | avg(completedAt - startedAt) |
| Retry Rate | retried / total |
| Partial Success Rate | partial / (partial + failed) |
| Revenue | sum(purchases where status='completed') |

### Real-time Updates

```typescript
// Poll for updates
const { data: liveStats } = trpc.admin.getLiveStats.useQuery(undefined, {
  refetchInterval: 5000, // Every 5 seconds
});
```

---

## Security Checklist

- [ ] Admin router uses `adminProcedure` (not `publicProcedure`)
- [ ] Wallet address verified against adminWallets table
- [ ] All admin actions logged to audit trail
- [ ] Sensitive data redacted in error messages
- [ ] Rate limiting on admin endpoints
- [ ] Admin page not indexed by search engines (noindex)

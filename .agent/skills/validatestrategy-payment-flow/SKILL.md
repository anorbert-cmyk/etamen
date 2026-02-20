# ValidateStrategy Payment Flow Skill

> **Domain:** Payment Processing, Webhooks, Analysis Triggering
> **Project:** ValidateStrategyLive

---

## Overview

This skill contains project-specific knowledge about the ValidateStrategyLive payment → analysis pipeline.

---

## Payment Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  PAYMENT FLOW                                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User → Session creation (problemStatement + tier)       │
│           ↓                                                 │
│  2. User → Email megadás + Payment provider redirect        │
│           ↓                                                 │
│  3. Payment provider → Webhook to /api/webhooks/{provider}  │
│           ↓                                                 │
│  4. Webhook handler:                                        │
│      a. Verify signature (HMAC/Stripe signature)            │
│      b. Idempotency check (tryMarkWebhookProcessed)         │
│      c. Update purchase status → "completed"                │
│      d. Send payment confirmation email (IMMEDIATELY)       │
│      e. Call startAnalysisAfterPayment(sessionId)           │
│           ↓                                                 │
│  5. Analysis runs in background                             │
│           ↓                                                 │
│  6. Completion → Send analysis ready email with magic link  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Files

| Purpose | File |
|---------|------|
| Payment router | `server/routers/paymentRouter.ts` |
| Webhook handlers | `server/webhooks.ts` |
| NOWPayments service | `server/services/nowPaymentsService.ts` |
| Stripe service | `server/services/stripeService.ts` |
| Analysis orchestrator | `server/services/analysisOrchestrator.ts` |
| Email service | `server/services/emailService.ts` |

---

## Critical Patterns

### 1. Webhook Idempotency (REQUIRED)

```typescript
// ALWAYS use atomic idempotency check before processing
const shouldProcess = await tryMarkWebhookProcessed(
  webhookId,      // Unique webhook event ID
  "nowpayments",  // Provider name
  sessionId,      // Session being processed
  paymentId,      // Provider's payment ID
  "completed"     // New status
);

if (!shouldProcess) {
  return res.json({ received: true, duplicate: true });
}
```

### 2. Webhook Signature Verification (REQUIRED)

```typescript
// NOWPayments - HMAC-SHA512
const expectedSignature = crypto
  .createHmac('sha512', process.env.NOWPAYMENTS_IPN_SECRET)
  .update(JSON.stringify(sortedPayload))
  .digest('hex');

// Stripe - Use SDK
const event = stripe.webhooks.constructEvent(
  req.body,
  req.headers['stripe-signature'],
  process.env.STRIPE_WEBHOOK_SECRET
);
```

### 3. Analysis Trigger (AFTER payment confirmed)

```typescript
// server/webhooks.ts - startAnalysisAfterPayment helper
export async function startAnalysisAfterPayment(sessionId: string) {
  const session = await getAnalysisSessionById(sessionId);
  if (!session) return;

  // Update status to processing
  await updateAnalysisSessionStatus(sessionId, "processing");

  // Fire-and-forget background job
  const { startAnalysisInBackground } = await import("./services/analysisOrchestrator");
  startAnalysisInBackground(
    sessionId,
    session.problemStatement,
    session.tier,
    session.email
  );
}
```

---

## Gotchas & Learnings

### 1. Raw Body for Stripe Webhooks
Stripe signature verification needs raw body, not parsed JSON:
```typescript
// MUST be BEFORE express.json() middleware
app.use("/api/webhooks/stripe", express.raw({ type: 'application/json' }));
```

### 2. Email Before Analysis
Send payment confirmation email IMMEDIATELY after webhook, BEFORE starting analysis:
```typescript
// Order matters!
await sendPaymentConfirmationEmail(session);  // 1. Email first
await startAnalysisAfterPayment(sessionId);   // 2. Then analysis
```

### 3. Fire-and-Forget Monitoring
Background jobs can fail silently. Always:
- Log the start of analysis
- Use circuit breaker for API calls
- Add to retry queue on failure
- Admin panel shows failed jobs

---

## Database Schema

```sql
-- purchases table
stripePaymentIntentId VARCHAR(255)
coinbaseChargeId VARCHAR(255)
paypalOrderId VARCHAR(255)
nowPaymentsInvoiceId VARCHAR(255)

-- paymentStatus enum
'pending' | 'completed' | 'failed' | 'refunded'

-- processedWebhooks table (idempotency)
webhookId VARCHAR(255) UNIQUE
provider VARCHAR(50)
sessionId VARCHAR(255)
processedAt TIMESTAMP
```

---

## Testing Webhooks Locally

```bash
# NOWPayments - use their sandbox
# Stripe - use CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test event
stripe trigger payment_intent.succeeded
```

---

## Security Checklist

- [ ] Webhook signature verified before any processing
- [ ] Idempotency key checked (tryMarkWebhookProcessed)
- [ ] Payment amount validated against tier price
- [ ] Session exists before updating
- [ ] Email validated before sending
- [ ] Rate limiting on payment endpoints

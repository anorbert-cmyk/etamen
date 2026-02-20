# ValidateStrategy Email System Skill

> **Domain:** Email Notifications, Resend API, User Communication
> **Project:** ValidateStrategyLive

---

## Overview

ValidateStrategyLive uses **Resend** for transactional email delivery. This skill documents all email types, templates, and integration patterns.

---

## Email Types

| Email | Trigger | Purpose |
|-------|---------|---------|
| Magic Link | User requests login | Authentication |
| Email Verification | Demo enrollment | Validate email before demo |
| Payment Confirmation | Webhook success | Confirm payment received |
| Analysis Ready | Analysis complete | Deliver results link |
| Analysis Failed | Analysis error | Inform user of issue |

---

## Key Files

| Purpose | File |
|---------|------|
| Email service | `server/services/emailService.ts` |
| Payment confirmation | `server/services/paymentConfirmationEmail.ts` |
| Auth router (magic link) | `server/routers/authRouter.ts` |
| Analysis orchestrator | `server/services/analysisOrchestrator.ts` |

---

## Resend Integration

### Configuration

```typescript
// Environment variables
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=hello@validatestrategy.com

// Check if configured
export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}
```

### Send Email Pattern

```typescript
// server/services/emailService.ts
export async function sendEmail(params: EmailParams): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[Email] RESEND_API_KEY not configured');
    return false;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: `ValidateStrategy <${process.env.RESEND_FROM_EMAIL}>`,
      to: [params.to],
      subject: params.subject,
      html: params.html,
      text: params.text, // Plain text fallback
    })
  });

  if (!response.ok) {
    console.error('[Email] Send failed:', await response.text());
    return false;
  }

  return true;
}
```

---

## Email Templates

### 1. Magic Link Email

```typescript
// Trigger: authRouter.requestMagicLink
await sendMagicLinkEmail({
  to: email,
  magicLinkUrl: `${APP_URL}/verify-email?token=${token}`,
});
```

**Template Structure:**
- Header with logo
- "Click to sign in" CTA button
- Token expiry warning (24 hours)
- Security note about not sharing link

### 2. Payment Confirmation Email

```typescript
// Trigger: Webhook handler after payment success
// IMPORTANT: Send BEFORE starting analysis!

await sendPaymentConfirmationEmail({
  to: session.email,
  tierDisplayName: "Syndicate APEX",
  amount: "199",
  sessionId: session.sessionId,
  problemStatementPreview: session.problemStatement.substring(0, 100),
});
```

**Template Structure:**
- Success header with checkmark
- Order summary (tier, amount)
- Problem statement preview
- "What happens next" steps:
  1. AI agents analyzing your problem
  2. You'll receive another email when ready
  3. Click magic link to view analysis
- Support contact

### 3. Analysis Ready Email

```typescript
// Trigger: analysisOrchestrator.onComplete callback
await sendValidateStrategyEmail({
  to: email,
  userName: email.split('@')[0],
  magicLinkUrl: `${APP_URL}/analysis/${sessionId}`,
  transactionId: sessionId,
  amount: tierPrice,
  tier: tier,
});
```

**Template Structure:**
- "Your analysis is ready!" header
- Tier badge
- Preview of findings (optional)
- "View Full Analysis" CTA button
- Magic link explanation
- Support contact

### 4. Email Verification (Demo)

```typescript
// Trigger: Demo enrollment form submission
await sendEmailVerificationEmail({
  to: email,
  verificationUrl: `${APP_URL}/verify-demo?token=${token}&sessionId=${sessionId}`,
});
```

**Template Structure:**
- "Verify your email" header
- Explanation of demo access
- "Verify Email" CTA button
- Expiry warning

---

## Email Styling (Dark Theme)

```html
<body style="
  margin: 0;
  padding: 0;
  background-color: #0f0f1a;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
">
  <!-- Container -->
  <div style="
    background: linear-gradient(145deg, #1a1a2e 0%, #16162a 100%);
    border-radius: 16px;
    border: 1px solid rgba(139, 92, 246, 0.3);
  ">
    <!-- Header -->
    <div style="
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%);
      padding: 30px;
      text-align: center;
    ">
      <div style="font-size: 24px; font-weight: 800; color: #ffffff;">
        ⚡ ValidateStrategy
      </div>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      <!-- CTA Button -->
      <a href="{{url}}" style="
        display: inline-block;
        background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
        color: #ffffff;
        padding: 16px 32px;
        border-radius: 12px;
        text-decoration: none;
        font-weight: 600;
      ">
        View Your Analysis
      </a>
    </div>
  </div>
</body>
```

---

## Email Flow Timing

```
┌─────────────────────────────────────────────────────────────┐
│  EMAIL TIMELINE                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  T+0    Payment webhook received                            │
│         ↓                                                   │
│  T+1s   PAYMENT CONFIRMATION EMAIL ← Send immediately!      │
│         ↓                                                   │
│  T+2s   Analysis starts in background                       │
│         ↓                                                   │
│  T+5min Analysis completes                                  │
│         ↓                                                   │
│  T+5min ANALYSIS READY EMAIL with magic link                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Error Handling

### Email Failure Recovery

```typescript
// Current: No retry (BAD)
if (email && isEmailConfigured()) {
  await sendValidateStrategyEmail({...}); // If fail, silent
}

// Better: With retry
try {
  await sendValidateStrategyEmail({...});
} catch (error) {
  console.error('[Email] Failed, queuing retry:', error);

  await addEmailToRetryQueue({
    to: email,
    template: 'analysis_ready',
    data: { sessionId, tier },
    attempts: 0,
    maxAttempts: 3,
  });
}
```

### Email Logging

```typescript
// Log all email sends for audit trail
await logEmailSend({
  to: email,
  template: 'payment_confirmation',
  sessionId: sessionId,
  sentAt: new Date(),
  success: true,
});
```

---

## Testing Emails

### Local Development

```bash
# Use Resend test API key (emails go to inbox.resend.com)
RESEND_API_KEY=re_test_xxxx

# Or use email preview service
RESEND_FROM_EMAIL=onboarding@resend.dev
```

### Unit Tests

```typescript
// Mock Resend API
vi.mock('node-fetch', () => ({
  default: vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ id: 'email_123' }),
  }),
}));

it('should send payment confirmation email', async () => {
  const result = await sendPaymentConfirmationEmail({
    to: 'test@example.com',
    tierDisplayName: 'Syndicate',
    amount: '199',
    sessionId: 'test-session',
    problemStatementPreview: 'Test problem...',
  });

  expect(result).toBe(true);
  expect(fetch).toHaveBeenCalledWith(
    'https://api.resend.com/emails',
    expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        'Authorization': expect.stringContaining('Bearer'),
      }),
    })
  );
});
```

---

## Security Considerations

1. **No PII in Logs**: Redact email addresses in logs
   ```typescript
   console.log(`Sent email to ${redactEmail(email)}`);
   // Output: Sent email to t***@example.com
   ```

2. **Rate Limiting**: Limit magic link requests
   ```typescript
   // Max 3 requests per email per 15 minutes
   const magicLinkRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 3 });
   ```

3. **Token Expiry**: Magic link tokens expire
   - Magic link: 24 hours
   - Email verification: 24 hours

4. **One-Time Use**: Delete tokens after use
   ```typescript
   await deleteMagicLinkToken(token); // REQUIRED
   ```

---

## Environment Variables

```env
# Resend
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=hello@validatestrategy.com

# App URL (for links in emails)
VITE_APP_URL=https://validatestrategy.com
```

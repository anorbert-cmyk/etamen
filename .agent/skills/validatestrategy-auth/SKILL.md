# ValidateStrategy Authentication Skill

> **Domain:** Authentication, Authorization, Session Management
> **Project:** ValidateStrategyLive

---

## Overview

ValidateStrategyLive uses a dual authentication system:
1. **SIWE (Sign-In With Ethereum)** - For admin wallet access
2. **Magic Link** - For user email-based access

---

## Authentication Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  AUTHENTICATION METHODS                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SIWE (Admin Only)                                          │
│  ─────────────────                                          │
│  1. Frontend requests nonce from backend                    │
│  2. User signs message with wallet (MetaMask)               │
│  3. Backend verifies signature + checks admin wallet list   │
│  4. JWT issued (30 day expiry)                              │
│                                                             │
│  Magic Link (Users)                                         │
│  ─────────────────                                          │
│  1. User enters email                                       │
│  2. Backend generates token (24h expiry)                    │
│  3. Email sent with /verify-email?token=xxx link            │
│  4. User clicks link → JWT issued (30 day expiry)           │
│  5. User auto-created if first login                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Files

| Purpose | File |
|---------|------|
| SIWE handler | `server/auth/siwe.ts` |
| Magic Link handler | `server/auth/magicLink.ts` |
| Auth router | `server/routers/authRouter.ts` |
| tRPC procedures | `server/_core/trpc.ts` |
| useAuth hook | `client/src/_core/hooks/useAuth.ts` |

---

## JWT Token Structure

```typescript
// Payload
{
  sub: string,          // User ID or wallet address
  email?: string,       // User email (if magic link)
  walletAddress?: string, // Wallet (if SIWE)
  role: "user" | "admin",
  iat: number,          // Issued at
  exp: number,          // Expiry (30 days)
}

// Signing
const token = await new SignJWT(payload)
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setExpirationTime('30d')
  .sign(secret);
```

---

## tRPC Procedure Types

```typescript
// server/_core/trpc.ts

// 1. Public - No auth required
export const publicProcedure = t.procedure;

// 2. Protected - User must be logged in
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

// 3. Admin - Must be admin wallet
export const adminProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({ ctx });
});
```

---

## Magic Link Flow (Detailed)

### 1. Request Magic Link

```typescript
// authRouter.ts
requestMagicLink: publicProcedure
  .input(z.object({ email: z.string().email() }))
  .mutation(async ({ input }) => {
    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');

    // Store with 24h expiry
    await storeMagicLinkToken(input.email, token, 24 * 60 * 60 * 1000);

    // Send email
    await sendMagicLinkEmail(input.email, token);

    return { success: true };
  });
```

### 2. Verify Magic Link

```typescript
// authRouter.ts
verifyMagicLink: publicProcedure
  .input(z.object({ token: z.string() }))
  .mutation(async ({ input }) => {
    // Find and validate token
    const record = await getMagicLinkToken(input.token);
    if (!record || record.expiresAt < new Date()) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid or expired token" });
    }

    // Create or get user
    let user = await getUserByEmail(record.email);
    if (!user) {
      user = await createUser({ email: record.email, loginMethod: "magic_link" });
    }

    // Delete used token (one-time use)
    await deleteMagicLinkToken(input.token);

    // Generate JWT
    const jwt = await generateJWT(user);

    return { jwt, user };
  });
```

---

## SIWE Flow (Admin)

### 1. Get Nonce

```typescript
// authRouter.ts
getSiweNonce: publicProcedure
  .input(z.object({ walletAddress: z.string() }))
  .mutation(async ({ input }) => {
    const nonce = crypto.randomBytes(16).toString('hex');

    // Store nonce with 15 min expiry
    await storeSiweNonce(input.walletAddress, nonce, 15 * 60 * 1000);

    // Build SIWE message
    const message = buildSiweMessage(input.walletAddress, nonce);

    return { nonce, message };
  });
```

### 2. Verify Signature

```typescript
// authRouter.ts
verifySiwe: publicProcedure
  .input(z.object({
    walletAddress: z.string(),
    signature: z.string(),
    message: z.string(),
    nonce: z.string(),
  }))
  .mutation(async ({ input }) => {
    // Verify nonce exists and not expired
    const storedNonce = await getSiweNonce(input.walletAddress);
    if (storedNonce !== input.nonce) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid nonce" });
    }

    // Verify signature using ethers.js
    const recoveredAddress = ethers.verifyMessage(input.message, input.signature);
    if (recoveredAddress.toLowerCase() !== input.walletAddress.toLowerCase()) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid signature" });
    }

    // Check admin wallet list
    const isAdmin = await isAdminWallet(input.walletAddress);
    if (!isAdmin) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Not an admin wallet" });
    }

    // Delete used nonce (replay protection)
    await deleteSiweNonce(input.walletAddress);

    // Generate JWT
    const jwt = await generateJWT({ walletAddress: input.walletAddress, role: "admin" });

    return { jwt };
  });
```

---

## Session Access Control Pattern

```typescript
// OWNERSHIP VERIFICATION - Add to session/analysis routers
const session = await getAnalysisSessionById(input.sessionId);

// If session has email, verify ownership
if (session.email) {
  const userOwns = ctx.user?.email?.toLowerCase() === session.email.toLowerCase();

  if (!userOwns) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Not your analysis" });
  }
}
```

---

## Security Gotchas

### 1. Nonce Replay Protection
Always delete nonce after use:
```typescript
await deleteSiweNonce(walletAddress); // MUST do this
```

### 2. Magic Link One-Time Use
Delete token after verification:
```typescript
await deleteMagicLinkToken(token); // MUST do this
```

### 3. JWT in HTTP-Only Cookie
```typescript
res.cookie('auth_token', jwt, {
  httpOnly: true,     // No JS access
  secure: true,       // HTTPS only
  sameSite: 'strict', // CSRF protection
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
});
```

### 4. Admin Wallet Verification
```typescript
// NEVER trust frontend claim of admin status
// Always verify wallet address against adminWallets table
const isAdmin = await isAdminWallet(walletAddress);
```

---

## Environment Variables

```env
# JWT
SESSION_SECRET=your-256-bit-secret-key

# Admin
ADMIN_WALLET_ADDRESS=0x...
VITE_ADMIN_WALLET_ADDRESS=0x...
```

---

## Testing Auth

```typescript
// Mock authenticated context for tests
const mockAuthContext = {
  user: {
    id: "test-user-id",
    email: "test@example.com",
    role: "user",
  },
};

// Mock admin context
const mockAdminContext = {
  user: {
    walletAddress: "0x123...",
    role: "admin",
  },
};
```

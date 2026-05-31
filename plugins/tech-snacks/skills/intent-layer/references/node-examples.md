# Intent Node Examples

## Root Node (Monorepo)

```markdown
# Platform

Monorepo containing payment, billing, and user services.

## Architecture

platform/
├── services/          # Microservices (each has own DB)
├── packages/          # Shared libraries
├── platform-config/   # Runtime configuration
└── scripts/           # Build and deploy tooling

## Key Invariants

- Services communicate via message queue, never direct HTTP
- All config lives in `platform-config/`, never hardcoded
- Shared types in `packages/types/` - all services import from there

## Anti-patterns

- Never import between services directly
- Don't put business logic in packages/ (utilities only)

## Related Context

- Payment service: `services/payment/AGENTS.md`
- Billing service: `services/billing/AGENTS.md`
```

## Child Node (Service)

```markdown
# Payment Service

Owns payment lifecycle: initiation → validation → processing → settlement.
Does NOT own: invoicing (see billing-service), user accounts.

## Entry Points

- `src/api/` - REST endpoints (internal only, via API gateway)
- `src/workers/` - Background job processors

## Contracts

- All processor calls go through `src/clients/processor-client.ts`
- Idempotency keys required for all payment mutations

## Patterns

Adding a new payment method:
1. Add type to `src/types/payment-method.ts`
2. Implement adapter in `src/adapters/`
3. Register in `src/adapters/index.ts`

## Anti-patterns

- Never bypass `processor-client.ts` for external calls
- Don't store card numbers - use tokenization only

## Pitfalls

- `src/legacy/` looks deprecated but handles edge cases for pre-2023 accounts
```

## Compression Example

### Before (~800 tokens)

```markdown
# User Service

## Overview

The User Service is a microservice that is responsible for managing user accounts
in our platform. It handles user registration, authentication, profile management,
and user preferences. This service is built using TypeScript and Express.js, and
it uses PostgreSQL as its database through Prisma ORM.

## Technologies Used

- TypeScript 5.0
- Express.js 4.x
- PostgreSQL 15
...
```

### After (~250 tokens)

```markdown
# User Service

Manages user accounts, auth, and preferences. Express + Prisma + PostgreSQL.

## Entry Points

- `src/routes/` - REST API
- `src/jobs/` - Background sync tasks

## Contracts

- Auth tokens from `packages/auth/`
- User events published to `events.users.*`

## Anti-patterns

- Never store passwords - use `packages/auth/hash.ts`
- Don't query users table directly from other services - use events
```

## Key Principles

1. **Purpose before structure** - What it owns, what it doesn't
2. **Contracts are explicit** - Where things must go through
3. **Anti-patterns from experience** - Real mistakes to avoid
4. **Compression over explanation** - Assume Claude is smart
5. **Downlinks for depth** - Point to related context, don't duplicate

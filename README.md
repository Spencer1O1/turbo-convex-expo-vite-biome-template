# Asset Intelligence OS (Expo + Next + Convex)

Hackathon-ready monorepo for building an **AI-assisted CMMS** with **NFC-based asset flows**.

## What this now includes
- **Convex backend schema** for organizations, users, assets, reports, AI inspections, and work orders.
- **Inspection/risk engine** that transforms report notes + photo count into structured findings and recommended actions.
- **Convex functions** for:
  - registering assets,
  - submitting reports,
  - generating AI inspections,
  - auto-updating asset risk/status,
  - creating work orders,
  - loading dashboard summaries.
- **Next.js dashboard page** showing startup-track pitch framing, risk-ranked assets, and AI payload format.
- **Expo mobile screen** reflecting the NFC scan workflow and field-friendly quick actions.
- **Automated tests** for the inspection/risk logic using Node's built-in test runner + tsx.

## Stack
- pnpm + Turborepo
- Expo (Expo Router)
- Next.js App Router
- Convex backend
- Biome
- TypeScript end-to-end

## Run locally
```bash
corepack enable
pnpm install
pnpm dev
```

Useful filtered commands:
```bash
pnpm --filter @template/web dev
pnpm --filter @template/expo dev
pnpm --filter @template/backend dev
pnpm --filter @template/backend test
```

## Product concept
- Tap NFC sticker on asset.
- Choose action: report issue, inspect, or view history.
- AI evaluates notes/photo evidence and emits structured risk/action payload.
- Risk score rolls up on the asset over time as more reports arrive.
- Dashboard surfaces urgent tasks for maintainers and managers.

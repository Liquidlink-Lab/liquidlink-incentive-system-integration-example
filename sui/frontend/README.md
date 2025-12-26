# LiquidLink Sui Frontend

A minimal Next.js app that demonstrates how to call the LiquidLink Incentive `periphery` module on Sui. Once a wallet is connected it fetches the live Scoreboard totals for the caller and exposes example actions that hit the demo package.

## Layout

```
sui/frontend
├── app
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components
│   ├── ActionPanel.tsx
│   ├── ScoreboardScores.tsx
│   ├── WalletControls.tsx
│   └── providers.tsx
├── hooks
│   └── useScoreboardScore.ts
├── lib
│   ├── env.ts
│   ├── scoreboards.ts
│   └── transactions.ts
├── package.json
├── tsconfig.json
├── next.config.mjs
├── .eslintrc.json
└── README.md
```

## Environment variables

Create `.env.local` (or export the same vars) with the IDs that belong to your deployment:

```
NEXT_PUBLIC_SUI_RPC=https://fullnode.testnet.sui.io
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_PERIPHERY_PACKAGE_ID=0x1da5...
NEXT_PUBLIC_CAP_STORE_ID=0xfef9...
NEXT_PUBLIC_SCOREBOARD_ID=0x059d...
NEXT_PUBLIC_LINEAR_SCOREBOARD_ID=0x426e...
NEXT_PUBLIC_CLOCK_ID=0x6
```

`lib/env.ts` provides the Sui testnet defaults shared by the Move deployment, so the file can be omitted for local testing. Any RPC endpoint that implements `sui_executeTransactionBlock` works, including a self-hosted fullnode, but the `NEXT_PUBLIC_SUI_NETWORK` must stay aligned with one of the official identifiers (`mainnet`, `testnet`, `devnet`, or `localnet`) so wallets accept the chain ID.

## Getting started

1. Install dependencies
   ```sh
   cd sui/frontend
   bun install    # or npm install / pnpm install
   ```
2. Start the dev server
   ```sh
   bun run dev
   ```
3. Visit `http://localhost:3000`, connect a Sui wallet (or the unsafe burner wallet provided by the dapp kit), and run the sample actions.

## Functionality

- `lib/transactions.ts` builds Sui transactions that call the periphery entry functions. `ActionPanel` pipes them through `useSignAndExecuteTransaction`.
  - `award_points`: add points for the connected signer.
  - `claw_back_points`: subtract points.
  - `start_linear_reward` / `update_linear_reward`: manage the linear scoreboard rewards.
- `hooks/useScoreboardScore.ts` looks up the `scores` table via dynamic fields and recomputes live totals on the client. You can seed `lib/scoreboards.ts` with known table IDs to skip the initial lookup.

Add more demos by extending `lib/transactions.ts` and exposing additional forms inside `ActionPanel`.

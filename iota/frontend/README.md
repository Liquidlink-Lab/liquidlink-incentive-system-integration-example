# LiquidLink Integrate Frontend

A Next.js single-page app that showcases how to interact with the LiquidLink Incentive contracts via the `periphery` module. It connects to the on-chain Scoreboard objects, lets you trigger demo transactions, and renders the latest scores for the connected wallet.

## Layout

```
iota/integrate_example/frontend
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

Create `.env.local` with the following values (replace IDs with your own objects):

```
NEXT_PUBLIC_IOTA_RPC=https://json-rpc.testnet.iota.cafe
NEXT_PUBLIC_IOTA_CHAIN_ID=iota:testnet
NEXT_PUBLIC_PERIPHERY_PACKAGE_ID=0xab56...
NEXT_PUBLIC_CAP_STORE_ID=0xc4f0...
NEXT_PUBLIC_SCOREBOARD_ID=0x0e35...
NEXT_PUBLIC_LINEAR_SCOREBOARD_ID=0xb67b...
NEXT_PUBLIC_CLOCK_ID=0x6
```

If any field is omitted, `lib/env.ts` falls back to the hard-coded defaults. Make sure the RPC endpoint supports `iota_executeTransactionBlock` (e.g., `https://json-rpc.testnet.iota.cafe` or your own node); otherwise the wallet will fail to execute transactions.

## Getting started

1. Install dependencies
   ```sh
   cd iota/integrate_example/frontend
   npm install
   ```
2. Start the dev server
   ```sh
   npm run dev
   ```
3. Open `http://localhost:3000`, connect an IOTA wallet (or the unsafe burner), and run the demo actions.

## Functionality

- `lib/transactions.ts` builds Move calls with the IOTA SDK. `ActionPanel` signs and executes them using `useSignAndExecuteTransaction`.
  - `award_points`: add arbitrary points for the caller.
  - `claw_back_points`: subtract points.
  - `start_linear_reward` / `update_linear_reward`: configure the linear time-weighted scoreboard.
- `hooks/useScoreboardScore.ts` queries the Scoreboard tables through JSON-RPC dynamic fields and computes the real-time totals shown in the UI. If you deploy new Scoreboards, update `lib/scoreboards.ts` with their table IDs to avoid an extra lookup.

To add more contract calls, extend `transactions.ts` and surface the new actions in `ActionPanel`.

import { WalletControls } from "../components/WalletControls";
import { ActionPanel } from "../components/ActionPanel";
import { ScoreboardScores } from "../components/ScoreboardScores";

export default function Page() {
  return (
    <main className="container">
      <header>
        <p className="tag">LiquidLink Incentive Demo</p>
        <h1>Periphery Frontend</h1>
        <p>This demo showcases how the LiquidLink Incentive contracts can be integrated end to end.</p>
        <p>
          The UI is built with Next.js, the Sui dapp kit, and the Sui TypeScript SDK. Once connected, you can
          read live scores and trigger the `periphery` entry functions against the configured CapStore and
          Scoreboard objects.
        </p>
      </header>
      <WalletControls />
      <ScoreboardScores />
      <ActionPanel />
    </main>
  );
}

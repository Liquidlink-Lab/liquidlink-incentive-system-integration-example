import { Transaction } from "@mysten/sui/transactions";
import { peripheryModule } from "./env";

export function buildAwardPointsTx(params: {
  capStoreId: string;
  scoreboardId: string;
  amount: bigint;
}): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${peripheryModule}::award_points`,
    arguments: [
      tx.object(params.capStoreId),
      tx.object(params.scoreboardId),
      tx.pure.u64(params.amount),
    ],
  });
  return tx;
}

export function buildRewardPurchaseTx(params: {
  capStoreId: string;
  scoreboardId: string;
  purchaseValue: bigint;
}): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${peripheryModule}::reward_purchase`,
    arguments: [
      tx.object(params.capStoreId),
      tx.object(params.scoreboardId),
      tx.pure.u64(params.purchaseValue),
    ],
  });
  return tx;
}

export function buildClawbackTx(params: {
  capStoreId: string;
  scoreboardId: string;
  amount: bigint;
}): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${peripheryModule}::claw_back_points`,
    arguments: [
      tx.object(params.capStoreId),
      tx.object(params.scoreboardId),
      tx.pure.u64(params.amount),
    ],
  });
  return tx;
}

export function buildStartLinearRewardTx(params: {
  capStoreId: string;
  scoreboardId: string;
  scorePerDuration: bigint;
  durationMs: bigint;
  clockObjectId: string;
}): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${peripheryModule}::start_linear_reward`,
    arguments: [
      tx.object(params.capStoreId),
      tx.object(params.scoreboardId),
      tx.pure.u64(params.scorePerDuration),
      tx.pure.u64(params.durationMs),
      tx.object(params.clockObjectId),
    ],
  });
  return tx;
}

export function buildUpdateLinearRewardTx(params: {
  capStoreId: string;
  scoreboardId: string;
  scorePerDuration: bigint;
  durationMs: bigint;
  clockObjectId: string;
}): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${peripheryModule}::update_linear_reward`,
    arguments: [
      tx.object(params.capStoreId),
      tx.object(params.scoreboardId),
      tx.pure.u64(params.scorePerDuration),
      tx.pure.u64(params.durationMs),
      tx.object(params.clockObjectId),
    ],
  });
  return tx;
}

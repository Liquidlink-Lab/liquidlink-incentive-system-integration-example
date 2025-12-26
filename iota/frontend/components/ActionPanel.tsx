"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@iota/dapp-kit";
import {
  buildAwardPointsTx,
  buildClawbackTx,
  buildStartLinearRewardTx,
  buildUpdateLinearRewardTx,
} from "../lib/transactions";
import { appEnv } from "../lib/env";

function parseBigInt(input: string, fallback = 0n): bigint {
  try {
    const value = BigInt(input);
    return value >= 0 ? value : fallback;
  } catch {
    return fallback;
  }
}

export function ActionPanel() {
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const [capStoreId, setCapStoreId] = useState(appEnv.capStoreId);
  const [scoreboardId, setScoreboardId] = useState(appEnv.scoreboardId);
  const [linearScoreboardId, setLinearScoreboardId] = useState(appEnv.linearScoreboardId);
  const [amount, setAmount] = useState("50");
  const [linearRate, setLinearRate] = useState("100");
  const [linearDuration, setLinearDuration] = useState("60000");
  const [status, setStatus] = useState<string | null>(null);

  const disabled = useMemo(() => !account, [account]);

  const runTransaction = useCallback(
    async (label: string, build: () => any) => {
      if (!account) {
        setStatus("Please connect your wallet first.");
        return;
      }
      try {
        setStatus(`${label} – submitting transaction...`);
        const tx = build();
        const result = await signAndExecute({
          transaction: tx,
        });
        const digest = (result as any)?.digest ?? "";
        setStatus(`${label} succeeded: ${digest}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        setStatus(`${label} failed: ${message}`);
      }
    },
    [account, signAndExecute]
  );

  const handleAdd = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await runTransaction("Add score", () =>
        buildAwardPointsTx({
          capStoreId,
          scoreboardId,
          amount: parseBigInt(amount),
        })
      );
    },
    [amount, capStoreId, runTransaction, scoreboardId]
  );

  const handleMinus = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await runTransaction("Minus points", () =>
        buildClawbackTx({
          capStoreId,
          scoreboardId,
          amount: parseBigInt(amount),
        })
      );
    },
    [amount, capStoreId, runTransaction, scoreboardId]
  );

  const handleStartLinear = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await runTransaction("Start linear reward", () =>
        buildStartLinearRewardTx({
          capStoreId,
          scoreboardId: linearScoreboardId,
          scorePerDuration: parseBigInt(linearRate),
          durationMs: parseBigInt(linearDuration),
          clockObjectId: appEnv.clockObjectId,
        })
      );
    },
    [capStoreId, linearDuration, linearRate, linearScoreboardId, runTransaction]
  );

  const handleUpdateLinear = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await runTransaction("Update linear reward", () =>
        buildUpdateLinearRewardTx({
          capStoreId,
          scoreboardId: linearScoreboardId,
          scorePerDuration: parseBigInt(linearRate),
          durationMs: parseBigInt(linearDuration),
          clockObjectId: appEnv.clockObjectId,
        })
      );
    },
    [capStoreId, linearDuration, linearRate, linearScoreboardId, runTransaction]
  );

  return (
    <section className="panel">
      <h2>Periphery Demo</h2>

      <div className="actions">
        <form onSubmit={handleAdd} className="card">
          <h3>Add score</h3>
          <label>
            Amount
            <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min="0" />
          </label>
          <button disabled={disabled}>Add</button>
        </form>

        <form onSubmit={handleMinus} className="card">
          <h3>Minus score</h3>
          <label>
            Amount
            <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min="0" />
          </label>
          <button disabled={disabled}>Minus</button>
        </form>
      </div>

      <div className="actions">
        <form onSubmit={handleStartLinear} className="card">
          <h3>Start linear reward</h3>
          <label>
            Points per interval
            <input value={linearRate} onChange={(e) => setLinearRate(e.target.value)} type="number" min="0" />
          </label>
          <label>
            Interval (ms)
            <input
              value={linearDuration}
              onChange={(e) => setLinearDuration(e.target.value)}
              type="number"
              min="1"
            />
          </label>
          <button disabled={disabled}>Start</button>
        </form>

        <form onSubmit={handleUpdateLinear} className="card">
          <h3>Update linear reward</h3>
          <label>
            Points per interval
            <input value={linearRate} onChange={(e) => setLinearRate(e.target.value)} type="number" min="0" />
          </label>
          <label>
            Interval (ms)
            <input
              value={linearDuration}
              onChange={(e) => setLinearDuration(e.target.value)}
              type="number"
              min="1"
            />
          </label>
          <button disabled={disabled}>Update</button>
        </form>
      </div>

      {status && <div className="status">{status}</div>}
    </section>
  );
}

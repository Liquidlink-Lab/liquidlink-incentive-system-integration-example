"use client";

import { useMemo, useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { appEnv } from "../lib/env";
import { useScoreboardScore } from "../hooks/useScoreboardScore";

function formatScore(value: bigint) {
  return value.toString();
}

function useDisplayScore(scoreboardId: string, owner: string | undefined, linear?: boolean) {
  const notConfigured = !scoreboardId || scoreboardId === "0x0";
  const query = useScoreboardScore(scoreboardId, owner, { linear });
  const display = !owner
    ? "Connect wallet"
    : notConfigured
    ? "Not configured"
    : query.isLoading
    ? "Loading..."
    : query.isError
    ? "Failed to read"
    : formatScore(query.data?.computedScore ?? 0n);
  return { query, display };
}

function trimId(id: string) {
  if (!id || id === "0x0") {
    return "Not configured";
  }
  if (id.length <= 12) {
    return id;
  }
  return `${id.slice(0, 10)}…${id.slice(-6)}`;
}

function useCopyId(id: string) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };
  return { copied, copy };
}

export function ScoreboardScores() {
  const account = useCurrentAccount();
  const owner = account?.address;

  const generalScore = useDisplayScore(appEnv.scoreboardId, owner, false);
  const linearScore = useDisplayScore(appEnv.linearScoreboardId, owner, true);
  const generalCopy = useCopyId(appEnv.scoreboardId);
  const linearCopy = useCopyId(appEnv.linearScoreboardId);

  const helperText = useMemo(() => {
    if (!owner) {
      return "Connect your wallet to fetch scores.";
    }
    return "Values refresh every 20 seconds (linear totals are recomputed on the fly).";
  }, [owner]);

  return (
    <section className="panel score-panel">
      <div className="score-header">
        <h2>Live scores</h2>
        <p>{helperText}</p>
      </div>
      <div className="scores-grid">
        <div className="score-card">
          <div className="score-label">Regular Scoreboard</div>
          <div className="score-value">{generalScore.display}</div>
          <div className="score-id">
            <span>ID: {trimId(appEnv.scoreboardId)}</span>
            <button type="button" className="copy-btn" onClick={generalCopy.copy}>
              {generalCopy.copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
        <div className="score-card">
          <div className="score-label">Linear Scoreboard</div>
          <div className="score-value">{linearScore.display}</div>
          <div className="score-id">
            <span>ID: {trimId(appEnv.linearScoreboardId)}</span>
            <button type="button" className="copy-btn" onClick={linearCopy.copy}>
              {linearCopy.copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

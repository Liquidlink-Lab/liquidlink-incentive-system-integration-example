"use client";

import { useQuery } from "@tanstack/react-query";
import { useIotaClient } from "@iota/dapp-kit";
import type { IotaClient } from "@iota/iota-sdk/client";
import { SCOREBOARD_TABLES } from "../lib/scoreboards";

export type ScoreComputation = {
  baseScore: bigint;
  computedScore: bigint;
  updatedAtMs: bigint;
  scorePerDuration: bigint;
  durationMs: bigint;
};

const ZERO_SCORE: ScoreComputation = {
  baseScore: 0n,
  computedScore: 0n,
  updatedAtMs: 0n,
  scorePerDuration: 0n,
  durationMs: 0n,
};

async function fetchScoreboardScore(
  client: IotaClient,
  scoreboardId: string,
  owner: string,
  opts?: { linear?: boolean }
): Promise<ScoreComputation> {
  const tableId =
    SCOREBOARD_TABLES[scoreboardId] ??
    (await fetchScoresTableId(client, scoreboardId).catch(() => undefined));
  if (!tableId) {
    return ZERO_SCORE;
  }
  const valueFields = await readScoreInfo(client, tableId, owner);
  if (!valueFields) {
    return ZERO_SCORE;
  }
  const score = BigInt(valueFields.score ?? 0);
  const updatedAt = BigInt(valueFields.updated_at ?? 0);
  const scorePerDuration = BigInt(valueFields.score_per_duration ?? 0);
  const duration = BigInt(valueFields.duration ?? 0);
  let computed = score;
  if (opts?.linear && duration > 0n && scorePerDuration > 0n) {
    const nowMs = BigInt(Date.now());
    const elapsed = nowMs > updatedAt ? nowMs - updatedAt : 0n;
    computed = score + (scorePerDuration * elapsed) / duration;
  }
  return {
    baseScore: score,
    computedScore: computed,
    updatedAtMs: updatedAt,
    scorePerDuration,
    durationMs: duration,
  };
}

export function useScoreboardScore(
  scoreboardId: string,
  owner: string | undefined,
  opts?: { linear?: boolean }
) {
  const client = useIotaClient();
  const enabled = Boolean(scoreboardId && scoreboardId !== "0x0" && owner);
  return useQuery({
    queryKey: ["scoreboard", scoreboardId, owner, opts?.linear],
    enabled,
    queryFn: () => fetchScoreboardScore(client, scoreboardId, owner!, opts),
    staleTime: 10000,
    refetchInterval: 20000,
  });
}

async function fetchScoresTableId(client: IotaClient, scoreboardId: string): Promise<string> {
  const scoreboard = await client.getObject({
    id: scoreboardId,
    options: { showContent: true },
  });
  return (scoreboard.data as any)?.content?.fields?.scores?.fields?.id?.id;
}

async function readScoreInfo(client: IotaClient, tableId: string, owner: string) {
  const normalizedOwner = owner.toLowerCase();
  let cursor: string | undefined = undefined;
  while (true) {
    const page = await client.getDynamicFields({ parentId: tableId, cursor, limit: 200 });
    const field = page.data.find((entry: any) => {
      const name = entry?.name;
      return (
        name?.type === "address" &&
        typeof name.value === "string" &&
        name.value.toLowerCase() === normalizedOwner
      );
    });
    if (field) {
      const scoreInfo = await client.getObject({
        id: field.objectId,
        options: { showContent: true },
      });
      const fields = (scoreInfo.data as any)?.content?.fields;
      return fields?.value?.fields ?? null;
    }
    if (!page.hasNextPage || !page.nextCursor) {
      break;
    }
    cursor = page.nextCursor;
  }
  return null;
}

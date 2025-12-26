export type AppEnv = {
  rpcUrl: string;
  peripheryPackageId: string;
  capStoreId: string;
  scoreboardId: string;
  linearScoreboardId: string;
  clockObjectId: string;
};

function requireEnvVar(value: string | undefined, fallback: string): string {
  return value && value.trim().length > 0 ? value : fallback;
}

export const appEnv: AppEnv = {
  rpcUrl: requireEnvVar(process.env.NEXT_PUBLIC_IOTA_RPC, "https://json-rpc.testnet.iota.cafe"),
  peripheryPackageId: requireEnvVar(
    process.env.NEXT_PUBLIC_PERIPHERY_PACKAGE_ID,
    "0xab56947cd677ef92725b198baaea9a5764a1da74a307421221ad69ad66a879bf"
  ),
  capStoreId: requireEnvVar(
    process.env.NEXT_PUBLIC_CAP_STORE_ID,
    "0xc4f07dcff368462dd7c052df84161742df86d9d950a008263e98f8c11cd3db5b"
  ),
  scoreboardId: requireEnvVar(
    process.env.NEXT_PUBLIC_SCOREBOARD_ID,
    "0x0e35a1bbacad91cd0b5bd1fbd36cbad13c59e90678fe6b7d75d72a9bd83f8e86"
  ),
  linearScoreboardId: requireEnvVar(
    process.env.NEXT_PUBLIC_LINEAR_SCOREBOARD_ID,
    "0xb67b03db7794131998ecbc470db0c1adb93c816aef19fa799ca1b936249cfcf3"
  ),
  clockObjectId: requireEnvVar(process.env.NEXT_PUBLIC_CLOCK_ID, "0x6"),
};

export const peripheryModule = `${appEnv.peripheryPackageId}::periphery`;

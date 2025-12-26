export type AppEnv = {
  rpcUrl: string;
  network: string;
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
  rpcUrl: requireEnvVar(process.env.NEXT_PUBLIC_SUI_RPC, "https://fullnode.testnet.sui.io"),
  network: requireEnvVar(process.env.NEXT_PUBLIC_SUI_NETWORK, "testnet"),
  peripheryPackageId: requireEnvVar(
    process.env.NEXT_PUBLIC_PERIPHERY_PACKAGE_ID,
    "0x1da549415fb44144ff80b5bce14f248becca529d57a4755aa4e56db8f702d1fc"
  ),
  capStoreId: requireEnvVar(
    process.env.NEXT_PUBLIC_CAP_STORE_ID,
    "0xfef9b5cd49b6dba1cd33a250ba7dc17b9d43f591ada126a9877124befa10568c"
  ),
  scoreboardId: requireEnvVar(
    process.env.NEXT_PUBLIC_SCOREBOARD_ID,
    "0x059d47fa0ecf2c2144346980d934261492e7d5ad9446a90ec9f97d6cabe5f192"
  ),
  linearScoreboardId: requireEnvVar(
    process.env.NEXT_PUBLIC_LINEAR_SCOREBOARD_ID,
    "0x426e35b86717ec9e4888c13158a521c055883bde337d724959b3db02fca3dcef"
  ),
  clockObjectId: requireEnvVar(process.env.NEXT_PUBLIC_CLOCK_ID, "0x6"),
};

export const peripheryModule = `${appEnv.peripheryPackageId}::periphery`;

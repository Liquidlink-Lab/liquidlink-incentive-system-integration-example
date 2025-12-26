"use client";

import { ReactNode, useState } from "react";
import { SuiClientProvider, WalletProvider, createNetworkConfig } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { appEnv } from "../lib/env";

const networkName = appEnv.network;
const networks: Record<string, { url: string }> = {
  [networkName]: { url: appEnv.rpcUrl },
};
const { networkConfig } = createNetworkConfig(networks);

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork={networkName}>
        <WalletProvider
          autoConnect
          enableUnsafeBurner
        >
          {children}
          {/* <ConnectModal trigger={<button className="connect-trigger">Connect wallet</button>} /> */}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

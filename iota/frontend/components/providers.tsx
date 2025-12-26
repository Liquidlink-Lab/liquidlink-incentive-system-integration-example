"use client";

import { ReactNode, useState } from "react";
import {
  ConnectModal,
  IotaClientProvider,
  WalletProvider,
  createNetworkConfig,
} from "@iota/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { appEnv } from "../lib/env";

const { networkConfig } = createNetworkConfig({
  custom: { url: appEnv.rpcUrl },
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <IotaClientProvider networks={networkConfig}>
        <WalletProvider
          autoConnect
          enableUnsafeBurner
        >
          {children}
          {/* <ConnectModal trigger={<button className="connect-trigger">Connect wallet</button>} /> */}
        </WalletProvider>
      </IotaClientProvider>
    </QueryClientProvider>
  );
}

"use client";

import { useMemo } from "react";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";

export function WalletControls() {
  const account = useCurrentAccount();
  const shortAddress = useMemo(() => {
    if (!account?.address) {
      return "Not connected";
    }
    return `${account.address.slice(0, 10)}…${account.address.slice(-6)}`;
  }, [account?.address]);

  return (
    <div className="wallet-controls">
      <div>
        <div className="label">Address</div>
        <div className="value">{shortAddress}</div>
      </div>
      <ConnectButton className="connect-btn">
        {account ? "Switch wallet" : "Connect wallet"}
      </ConnectButton>
    </div>
  );
}

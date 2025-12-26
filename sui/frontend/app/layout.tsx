import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@mysten/dapp-kit/dist/index.css";
import "./globals.css";
import { Providers } from "../components/providers";

export const metadata: Metadata = {
  title: "LiquidLink Sui Integrate Demo",
  description: "Next.js front-end powered by the Sui dapp kit for LiquidLink periphery",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

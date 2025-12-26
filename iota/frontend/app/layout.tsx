import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@iota/dapp-kit/dist/index.css";
import "./globals.css";
import { Providers } from "../components/providers";

export const metadata: Metadata = {
  title: "LiquidLink Integrate Demo",
  description: "Next.js front-end powered by IOTA dapp kit for LiquidLink periphery",
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

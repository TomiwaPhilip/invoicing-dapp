"use client";

import "@mysten/dapp-kit/dist/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic"; 
import { getFullnodeUrl } from "@mysten/sui/client";
import { SuiProvider } from "./providers/SuiProvider";
import "./globals.css";

const queryClient = new QueryClient();

const networks = {
  devnet: { url: getFullnodeUrl("devnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
};

const SuiClientProvider = dynamic(
  () => import("@mysten/dapp-kit").then((mod) => mod.SuiClientProvider),
  { ssr: false }
);

const WalletProvider = dynamic(
  () => import("@mysten/dapp-kit").then((mod) => mod.WalletProvider),
  { ssr: false }
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <SuiClientProvider networks={networks} defaultNetwork="devnet">
            <WalletProvider>
              <SuiProvider>{children}</SuiProvider>
            </WalletProvider>
          </SuiClientProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

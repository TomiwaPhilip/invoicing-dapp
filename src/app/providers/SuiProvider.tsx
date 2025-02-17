"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { PropsWithChildren } from "react";

const queryClient = new QueryClient();

export function SuiProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <SuiClientProvider>{children}</SuiClientProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
}

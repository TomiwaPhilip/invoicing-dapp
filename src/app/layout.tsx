"use client";

import "@solana/wallet-adapter-react-ui/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SuiProvider } from "./providers/SuiProvider";
import "./globals.css";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <SuiProvider>{children}</SuiProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

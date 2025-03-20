import "./globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";
import { SessionProvider } from "next-auth/react";

import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar/navbar";

import { Toaster } from "@/components/ui/toaster";
import { DataProvider } from "@/contexts/data-context";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Ground Server",
  description:
    "The Ground Server that displays telemetry data from and sends commands to the Cornell Rocketry Team's rocket",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <DataProvider>
              <Navbar />
              <main>{children}</main>
              <Toaster />{" "}
              {/* Place Toaster here within the first return statement */}
            </DataProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

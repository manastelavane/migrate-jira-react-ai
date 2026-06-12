import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider } from "@/providers/query-provider";
import { Snow } from '@/components/common/snow';

export const metadata: Metadata = {
  title: "Jira Clone",
  description: "A Jira clone built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full">
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Snow />
      </body>
    </html>
  );
}

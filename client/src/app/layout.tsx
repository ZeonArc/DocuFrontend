import type { Metadata } from "next";
import "./globals.css";
import { CursorProvider } from "@/components/custom-cursor";

export const metadata: Metadata = {
  title: "DocuGithub - Your One Stop Solution to Readmes",
  description: "Generate beautiful READMEs with AI-powered documentation tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/kag3qbi.css" />
      </head>
      <body><CursorProvider>{children}</CursorProvider></body>
    </html>
  );
}

import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import { CursorProvider } from "@/components/custom-cursor";

const kanit = Kanit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-kanit",
});

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
    <html lang="en" suppressHydrationWarning className={`${kanit.variable} font-body antialiased`}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/kag3qbi.css" />
      </head>
      <body>
        <CursorProvider>{children}</CursorProvider>
      </body>
    </html>
  );
}

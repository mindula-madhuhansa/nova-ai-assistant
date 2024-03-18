import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nova | AI Assistant",
  description: "Your Next-Gen AI Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden">{children}</body>
    </html>
  );
}

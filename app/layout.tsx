import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zipply",
  description: "Url shortener",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark antialiased">{children}</body>
    </html>
  );
}

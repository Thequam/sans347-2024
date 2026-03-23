import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SANS 347 — 2024 3rd Edition",
  description: "Categorization and conformity assessment criteria for all pressure equipment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}

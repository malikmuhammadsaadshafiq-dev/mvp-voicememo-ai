import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoiceMemo AI",
  description: "WhatsApp bot that transcribes and summarizes voice messages",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
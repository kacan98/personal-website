import type { Metadata } from "next";
import { BACKGROUND_COLORS } from "./colors";

export const metadata: Metadata = {
  title: "Karel Čančara - Full-Stack Developer",
  description: "Full-Stack Developer specializing in TypeScript, React, .NET, and AI-enhanced development. Building enterprise solutions for 100+ companies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: BACKGROUND_COLORS.primary,
          color: "white",
          fontFamily: "Urbanist, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
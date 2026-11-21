import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OneAtlas — AI Model Discovery & Intelligence Platform",
  description:
    "Discover, compare, and benchmark 80+ frontier AI models across OpenAI, Anthropic, Google, Meta, DeepSeek, and more with real-time provider pricing and latency metrics.",
  keywords: [
    "AI Models",
    "LLM Leaderboard",
    "OpenRouter alternative",
    "Model Benchmarks",
    "AI Pricing",
    "DeepSeek",
    "Claude 3.5",
    "GPT-4o",
    "Llama 3.3",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen font-sans bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

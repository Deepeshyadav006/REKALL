import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Rekall – AI-Powered Social Media Assistant",
  description:
    "Rekall helps you craft, schedule, and optimize social media content using the power of AI. Generate engaging posts, analyze performance, and grow your audience effortlessly.",
  keywords: ["AI", "social media", "content creation", "assistant", "Rekall"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.ENV = {
                NEXT_PUBLIC_SUPABASE_URL: '${process.env.NEXT_PUBLIC_SUPABASE_URL || ''}',
                NEXT_PUBLIC_SUPABASE_ANON_KEY: '${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}'
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

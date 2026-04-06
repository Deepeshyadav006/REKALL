import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Vrixo – AI-Powered Social Media Assistant",
  description:
    "Vrixo helps you craft, schedule, and optimize social media content using the power of AI. Generate engaging posts, analyze performance, and grow your audience effortlessly.",
  keywords: ["AI", "social media", "content creation", "assistant", "Vrixo"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify({
              NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
              NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseKey
            })};`,
          }}
        />
      </body>
    </html>
  );
}

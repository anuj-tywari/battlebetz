import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { AuthProvider } from "@/components/providers/auth-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import "@/lib/auth-check";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BattleBetz - Fantasy Sports Betting Platform",
  description: "Join BattleBetz for the ultimate fantasy sports betting experience. Compete in tournaments, place bets, and win big!",
  icons: {
    icon: "/assets/images/favicon.png",
    apple: "/assets/images/logo.png"
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gray-900 text-white flex flex-col`} suppressHydrationWarning>
        <SessionProvider session={null}>
          <AuthProvider>
            <Header />
            <main className="flex-grow flex flex-col">{children}</main>
            <Footer />
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "../components/providers/AuthProvider";
import QueryProvider from "../components/providers/QueryProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BattleBetz Admin Panel",
  description: "Administration panel for BattleBetz platform",
  icons: {
    icon: [
      {
        url: '/assets/images/favicon.png',
        href: '/assets/images/favicon.png',
      }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 dark:bg-gray-900 min-h-screen`}>
        <AuthProvider>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

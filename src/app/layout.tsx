import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/auth-provider";
import { Toaster } from "react-hot-toast";
import { ProvidersQuery } from "../providers/providersQuery";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spotify Clone",
  description: "Nghe nhạc không giới hạn với Spotify Clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <ProvidersQuery>
          <AuthProvider>{children}</AuthProvider>
        </ProvidersQuery>
        <Toaster />
      </body>
    </html>
  );
}

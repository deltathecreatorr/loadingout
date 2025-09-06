import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LoadOut",
  description: "Create your own game library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="fixed top-0 left-0 w-[200%] h-full flex -z-10">
          <div className="w-1/2 h-full bg-[url('../../public/background/orig_big.webp')] bg-no-repeat bg-auto bg-top animate-scroll-left"></div>
          <div className="w-1/2 h-full bg-[url('../../public/background/orig_big.webp')] bg-no-repeat bg-auto bg-top animate-scroll-left"></div>
        </div>
        <div className="relative min-h-screen">{children}</div>
      </body>
    </html>
  );
}

"use client";

import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "./components/BottomNav";
import TopBar from "./components/TopBar"; 
import { pixelFont } from "./fonts";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable} ${pixelFont.variable}
          antialiased relative text-white font-pixel
        `}
      >
        {/* Fullscreen background */}
        <img
          src="/assets/background.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/50 z-10"></div>

        {/* Flex container for content + nav */}
        <div className="relative z-20 min-h-screen flex flex-col">
          {/* Top bar */}
          <TopBar />

          {/* Main content */}
          <main className="flex-1 px-4 sm:px-8 pb-28">{children}</main>

          {/* Bottom nav */}
          <div className="absolute bottom-0 left-0 right-0 z-30">
            <BottomNav />
          </div>
        </div>
      </body>
    </html>
  );
}

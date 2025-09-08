"use client";

import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "../components/BottomNav";
import { pixelFont } from "./fonts"; // relative to layout.tsx
import Image from "next/image";
import TopNav from "@/components/TopNav";
import localFont from "next/font/local";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable} ${pixelFont.variable}
          antialiased relative text-white
        `}
      >
        {/* <div className="absolute inset-0 bg-black/50 z-10"></div> */}
        {/* Fullscreen background for all pages */}
        <Image
          src="/assets/background.png"
          alt="Background"
          className="absolute  w-full h-full object-cover z-0 !brightness-50  "
          width={100}
          height={100}
          
        />
        <div className="grid grid-rows-[10%_1fr_15%] h-screen">
          <div className="z-30 relative">
            <TopNav />
          </div>
          <div className="relative z-20   overflow-y-scroll">
            {children}
          </div>
          <div className="relative  z-30 ">
            <BottomNav />
          </div>
        </div>
      </body>
    </html>
  );
}

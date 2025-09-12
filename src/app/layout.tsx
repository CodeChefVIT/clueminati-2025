"use client";

import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "../components/BottomNav";
import { pixelFont, rethinkSansBold, rethinkSansMedium } from "./fonts";
import Image from "next/image";
import TopNav from "@/components/TopNav";
import { usePathname } from "next/navigation";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const rethinkPages = ["/login", "/create-team", "/join-team", "/role-selection"];
  const docsPage = pathname.startsWith("/docs");

  const isRethinkPage = rethinkPages.some((page) => pathname.startsWith(page));

  return (
    (!docsPage) ?
      <html lang="en">
        <body
          className={`${isRethinkPage
            ? `${rethinkSansMedium.variable} ${rethinkSansBold.variable} font-rethink`
            : `${pixelFont.variable} font-pixel relative min-h-screen`
            }`}
        >

          <Image
            src="/assets/background.svg"
            alt="Background"
            className="absolute w-full h-full object-cover z-0 !brightness-50"
            width={100}
            height={100}
            priority
          />


          {isRethinkPage ? (

            <div className="relative z-20 min-h-screen overflow-y-auto">{children}</div>
          ) : (

            <div className="grid grid-rows-[10%_1fr_15%] h-screen">

              <div className="z-30 relative">
                <TopNav />
              </div>


              <div className="relative z-20 overflow-y-scroll">{children}</div>


              <div className="relative z-30">
                <BottomNav />
              </div>
            </div>
          )}
        </body>
      </html> :
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
  );
}

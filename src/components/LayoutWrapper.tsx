"use client";

import { usePathname } from "next/navigation";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import Image from "next/image";
import { pixelFont, rethinkSansBold, rethinkSansMedium } from "@/app/fonts";

export default function LayoutClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const rethinkPages = ["/login", "/create-team", "/join-team", "/role-selection", "/signup"];
  const docsPage = pathname.startsWith("/docs");
  const isRethinkPage = rethinkPages.some((page) => pathname.startsWith(page));

  if (docsPage) {
    return <>{children}</>;
  }

  return (
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
  );
}

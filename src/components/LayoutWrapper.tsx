"use client";

import { usePathname } from "next/navigation";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import Image from "next/image";
import { pixelFont, rethinkSansBold, rethinkSansMedium } from "@/app/fonts";
import { useEffect, useState } from "react";

export default function LayoutClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const rethinkPages = ["/login", "/create-team", "/join-team", "/role-selection", "/signup"];
  const docsPage = pathname.startsWith("/docs");
  const isRethinkPage = rethinkPages.some((page) => pathname.startsWith(page));
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  if (docsPage) {
    return <>{children}</>;
  }

  if (isDesktop && !isRethinkPage) {
    return (
      <body className={`${pixelFont.variable} font-pixel`}>
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white text-center p-8">
          <Image src="/icon-192x192.png" alt="Clueminati Logo" width={200} height={200} className="mb-8" />
          <h1 className="text-3xl font-bold mb-4">Desktop View Not Supported</h1>
          <p className="text-xl max-w-md">
            This experience is designed for mobile devices. Please switch to a mobile view or open on your smartphone for the
            best experience.
          </p>
        </div>
      </body>
    );
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

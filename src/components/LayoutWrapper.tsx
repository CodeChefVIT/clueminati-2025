"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import Image from "next/image";
import { pixelFont, rethinkSansBold, rethinkSansMedium } from "@/app/fonts";
import { motion } from "framer-motion";
import axios from "axios";
import Instructions from "@/app/instructions/page";
import KeyVerification from "@/app/key-verification/page";

export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const rethinkPages = [
    "/login",
    "/create-team",
    "/join-team",
    "/role-selection",
    "/signup",
    "/verifyemail",
    "/hell-instructions",
    "/instructions",
    "/admin",
    "/admin/*",
    "/not-found",
    "/key-verification",
    "/core-member/choose-station",
    "/admin/edit-stations"
  ];

  const isDocsPage = pathname.startsWith("/docs");
  const isRethinkPage = rethinkPages.some((page) => pathname.startsWith(page));
  const isAdminPage = pathname.startsWith("/admin");

  const [isDesktop, setIsDesktop] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  const [round, setRound] = useState<
    "Not Started" | "Round 1" | "Round 2" | "Half Time" | "Finished" | "..."
  >("...");
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  async function fetchGameStat() {
    try {
      const { data } = await axios.get("/api/get-game-stat");

      const now = Date.now();
      const r1Start = new Date(data.r1StartTime).getTime();
      const r1End = new Date(data.r1EndTime).getTime();
      const r2Start = new Date(data.r2StartTime).getTime();
      const r2End = new Date(data.r2EndTime).getTime();
      let theRound = "";
      if (now < r1Start) {
        theRound = "Not Started";
        setTimeLeft(r1Start - now);
      } else if (now >= r1Start && now <= r1End) {
        theRound = "Round 1";
        setTimeLeft(r1End - now);
        // if (pathname === "/instructions") {
        //   router.push("/");
        // }
      } else if (now > r1End && now < r2Start) {
        theRound = "Half Time";
        setTimeLeft(r2Start - now);
      } else if (now >= r2Start && now <= r2End) {
        theRound = "Round 2";
        setTimeLeft(r2End - now);
        // router.push("/");
        if (pathname === "/instructions") {
        }
      } else {
        theRound = "Finished";
        setTimeLeft(null);
      }
      localStorage.setItem("round", theRound);
      setRound(
        theRound as
          | "Not Started"
          | "Round 1"
          | "Round 2"
          | "Half Time"
          | "Finished"
          | "..."
      );
    } catch (err) {
      console.error("Failed to fetch game stats:", err);
    }
  }

  useEffect(() => {
    console.log(pathname);
    fetchGameStat();

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 1000) {
          fetchGameStat();
          return null;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
  // useEffect(() => {
  //   console.log("ok so round has changed")
  //   if (
  //     (round === "Round 1" || round === "Round 2") &&
  //     pathname === "/instructions"
  //   ) {
  //     router.push("/");
  //   }
  // }, [round, pathname, router]);

  useEffect(() => {
    const checkDevice = () => setIsDesktop(window.innerWidth >= 768);
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      console.log("'beforeinstallprompt' event fired.");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      console.log("PWA was installed");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  if (!isAdminPage && !isRethinkPage && !isDocsPage && isDesktop) {
    return (
      <body className={`${pixelFont.variable} font-pixel`}>
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white text-center p-8">
          <Image
            src="/icon-192x192.png"
            alt="Clueminati Logo"
            width={200}
            height={200}
            className="mb-8"
          />
          <h1 className="text-3xl font-bold mb-4">
            Desktop View Not Supported
          </h1>
          <p className="text-xl max-w-md">
            This experience is designed for mobile devices. Please switch to a
            mobile view or open on your smartphone for the best experience.
          </p>
        </div>
      </body>
    );
  }

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return (
    <body
      className={`${
        isRethinkPage
          ? `${rethinkSansMedium.variable} ${rethinkSansBold.variable} font-rethink`
          : `${pixelFont.variable} font-pixel relative min-h-screen`
      }`}
    >
      {!isAdminPage && (
        <Image
          src="/assets/background.png"
          alt="Background"
          className="absolute w-full h-full object-cover z-0"
          width={100}
          height={100}
          priority
        />
      )}

      {isRethinkPage ? (
        <div className="relative z-20 min-h-screen overflow-y-auto">
          {children}
        </div>
      ) : isAdminPage ? (
        <div className="relative z-20 min-h-screen bg-gray-900 text-gray-100 flex flex-col p-6">
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      ) : round === "Round 1" || round === "Round 2" ? (
        <div
          className={`grid ${
            pathname.startsWith("/question") ? "grid-rows-[10%_1fr]" : "grid-rows-[10%_1fr_15%]"
          } h-screen`}
        >
          <div className="z-30 relative">
            <TopNav round={round} timeLeft={timeLeft} />
          </div>
          <div className="relative z-20 overflow-y-scroll">{children}</div>
          {!pathname.startsWith("/question") && (
            <div className="relative z-30">
              <BottomNav />
            </div>
          )}
        </div>
      ) : round === "Half Time" || round === "Not Started" ? (
        <Instructions timeLeft={timeLeft!} />
      ) : round === "Finished" && !pathname.startsWith("/core-member") ? (
        <KeyVerification />
      ) : pathname.startsWith("/core-member") ?(
        <div className="text-9xl z-100">
        </div>
      ) : (
        ""
      )}

      {installPrompt && !isAdminPage && (
        <motion.button
          onClick={handleInstallClick}
          className="fixed bottom-24 right-4 z-50 flex items-center justify-center gap-2 text-white font-bold rounded-full shadow-lg hover:brightness-50 bg-cover h-14  px-6 w-fit"
          style={{ backgroundImage: "url('/assets/neutral-slab.svg')" }}
          initial={{ x: "150%" }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <Image
            src="/icon-512x512.png"
            alt="Install"
            width={24}
            height={24}
            className="rounded-sm"
          />
          Install App
        </motion.button>
      )}
    </body>
  );
}

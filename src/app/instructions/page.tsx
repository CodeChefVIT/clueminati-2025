"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { formatTime } from "@/utils/formatTime";

export default function Instructions({ timeLeft }: { timeLeft?: number }) {
  const [currentRound, setCurrentRound] = useState<string>("loading");

  useEffect(() => {
    const round = localStorage.getItem("round");
    if (round) {
      setCurrentRound(round);
    }
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-white">
      <div
        className="relative w-full bg-center bg-contain bg-no-repeat flex flex-col items-center justify-center h-[33rem] px-6"
        style={{ backgroundImage: "url('/assets/instructions_bg.svg')" }}
      >
        <h2 className="text-2xl font-bold mb-6 mt-8 text-[#A5A5A5]">
          Instructions 
        </h2>
        <div className="relative w-40 sm:w-44">
          <img src="/assets/timer-box.svg" alt="Timer" className="w-full" />
          <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
            {formatTime(timeLeft!)}
          </span>
        </div>
        <p className="text-center text-[#A5A5A5] text-sm sm:text-base">{currentRound}</p>

        <p className="text-center text-[#A5A5A5] text-sm sm:text-base px-8 max-w-[70%] sm:max-w-[65%] break-words">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Click on the Home button to start
        </p>
      </div>

      {/* <Link
        href="/"
        className="relative mt-8 w-[50%] max-w-xs hover:brightness-50"
      >
        <Image
          src="/assets/round-box.svg"
          alt="Proceed"
          width={200}
          height={80}
          className="w-full h-auto"
        />
        <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
          Proceed
        </span>
      </Link> */}
    </div>
  );
}

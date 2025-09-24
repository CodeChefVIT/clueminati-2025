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
  const instructions: Record<string, string> = {
    "Not Started": `Hear ye, brave wanderers! You now hold the Scroll of Instructions.
    Read carefully, for it holds the rules and whispers that may tip the
    scales in your favor. Your journey begins at the station assigned to
    you. This is your first and mandatory trial - only after attempting
    it will the rest of the map unveil itself. Once revealed, you are
    free to roam the campus and visit any number of stations, in any
    order you desire. The trials await in three forms: easy, medium, and
    hard — offering 20, 40, and 70 points respectively. But beware,
    patience is part of the test. A question may only be skipped after
    five minutes, when the option reveals itself upon your screen. The
    more you explore, the more you gain. And remember—knowing the
    locations of each station may serve you well in the trials to come…
    though the choice, of course, is yours.`,

    "Half Time": `Round 2 YAPPPPPP Lorem ipsum dolor sit amet, consectetur adipiscing
    elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
    laboris nisi ut aliquip ex ea commodo consequat. Click on the Home
    button to start...`,

    // Add more rounds here as needed
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-white">
      <div
        className="relative w-full bg-center bg-contain bg-no-repeat flex flex-col items-center justify-center h-[33rem] px-6 min-h-[100px]"
        style={{ backgroundImage: "url('/assets/instructions_bg.svg')" }}
      >
        <h2 className="text-2xl font-bold mb-6 mt-8 text-[#A5A5A5]">
          Instructions
        </h2>

        {/* Timer */}
        <div className="relative w-40 sm:w-44">
          <img src="/assets/timer-box.svg" alt="Timer" className="w-full" />
          <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
            {formatTime(timeLeft!)}
          </span>
        </div>

        {/* Round name */}
        <p className="text-center text-[#A5A5A5] mb-4 text-sm sm:text-base">
          {currentRound}
        </p>

        {/* Conditional rendering using mapping */}
        {instructions[currentRound] ? (
          <p className="text-center text-[#A5A5A5] text-sm sm:text-base max-w-[65%] max-h-[150px] overflow-y-auto break-words px-10">
            {instructions[currentRound]}
          </p>
        ) : (
          <p className="text-[#A5A5A5] text-sm sm:text-base italic">
            Stay tuned! Instructions will appear when the round begins.
          </p>
        )}
      </div>
      <Link
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
      </Link>
    </div>
  );
}

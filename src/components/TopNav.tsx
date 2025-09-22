"use client";
import { formatTime } from "@/utils/formatTime";
import React from "react";

function TopNav({ round, timeLeft }: { round: string; timeLeft: number | null }) {
  

  return (
    <div className="w-full flex justify-between items-center z-20 pt-6">
      {/* Round Box */}
      <div className="relative w-40 sm:w-44">
        <img src="/assets/round-box.svg" alt="Round" className="w-full" />
        <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
          {round}
        </span>
      </div>

      <div className="relative w-40 sm:w-44">
        <img src="/assets/timer-box.svg" alt="Timer" className="w-full" />
        <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
          {formatTime(timeLeft)}
        </span>
      </div>
    </div>
  );
}

export default TopNav;
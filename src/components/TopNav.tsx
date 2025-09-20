"use client";
import React from "react";

function TopNav({ round, timeLeft }: { round: string; timeLeft: number | null }) {
  function formatTime(ms: number | null) {
    if (ms === null) return "--:--:--";
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

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
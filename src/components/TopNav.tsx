"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

function TopNav() {
  const [round, setRound] = useState<string>("...");
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  async function fetchGameStat() {
    try {
      const { data } = await axios.get("/api/get-game-stat");

      const now = Date.now();
      const r1Start = new Date(data.r1StartTime).getTime();
      const r1End = new Date(data.r1EndTime).getTime();
      const r2Start = new Date(data.r2StartTime).getTime();
      const r2End = new Date(data.r2EndTime).getTime();

      if (now < r1Start) {
        //before round 1
        setRound("Not Started");
        setTimeLeft(r1Start - now);
      } else if (now >= r1Start && now <= r1End) {
        //during round 1
        setRound("Round 1");
        setTimeLeft(r1End - now);
      } else if (now > r1End && now < r2Start) {
        //gap between round 1 and round 2
        setRound("Half Time");
        setTimeLeft(r2Start - now);
      } else if (now >= r2Start && now <= r2End) {
        //during round 2
        setRound("Round 2");
        setTimeLeft(r2End - now);
      } else {
        //after round 2
        setRound("Finished");
        setTimeLeft(null);
      }
    } catch (err) {
      console.error("Failed to fetch game stats:", err);
    }
  }

  useEffect(() => {
    fetchGameStat();

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 1000) {
          // ⏱ When timer hits zero, refetch game state to auto-transition
          fetchGameStat();
          return null;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

      {/* Timer Box */}
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

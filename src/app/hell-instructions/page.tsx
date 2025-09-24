"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios, { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { pixelFont } from "../fonts";
import Modal from "@/components/Modal";
import { formatTime } from "@/utils/formatTime";

function HellInstructions() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
      } else if (now > r1End && now < r2Start) {
        theRound = "Half Time";
        setTimeLeft(r2Start - now);
      } else if (now >= r2Start && now <= r2End) {
        theRound = "Round 2";
        setTimeLeft(r2End - now);
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
      );
    } catch (err) {
      console.error("Failed to fetch game stats:", err);
    }
  }

  useEffect(() => {
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

  async function leaveTeam() {
    setLeaving(true);
    try {
      const res = await axios.post("/api/users/leave-team");
      console.log("Leave team response:", res.data);
      router.push("/join-team");
    } catch (error) {
      console.error("Error leaving team:", error);
      let message = "Failed to leave team. Please try again.";

      if (isAxiosError(error) && error.response) {
        message = "You can leave team once the round starts.";
      }

      setErrorMessage(message);
      setShowErrorModal(true);
    } finally {
      setLeaving(false);
    }
  }

  const handleLogout = async () => {
    try {
      setLoading(true);
      await axios.get("/api/users/logout");
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error: any) {
      console.error("Logout failed", error);
      toast.error(error.response?.data?.error || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden w-full font-pixel ${pixelFont.variable} flex flex-col justify-center items-center`}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: "url('/assets/hell-bg.png')" }}
      />
      {/* Instructions */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center text-white p-4">
        <div
          className="relative w-full max-w-md bg-center bg-contain bg-no-repeat flex flex-col items-center justify-start text-white h-[40rem] px-8 pt-20 "
          style={{ backgroundImage: "url('/assets/hell-instructions.svg')" }}
        >
          <h2 className="text-xl font-pixel underline underline-offset-6 font-bold text-[#A5A5A5] mt-35">
            Instructions
          </h2>
          {/* Timer */}
          <div className="relative w-40 sm:w-44 my-2">
            <img src="/assets/timer-box.svg" alt="Timer" className="w-full" />
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
              {formatTime(timeLeft!)}
            </span>
          </div>
          <p className="text-center text-[#A5A5A5] mb-2 text-sm sm:text-base">
            {round === "Not Started"? "For Round 1": ""}
          </p>
          <p className="text-center text-[#A5A5A5] text-sm sm:text-base px-10 max-h-[200px] overflow-y-auto">
            Hello, lost souls trapped in Hell. All instructions shall be revealed to you as the game unfolds
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="relative z-10 flex justify-center flex-col pb-8 gap-4">
        {round === "Not Started" && (
          <Button
            onClick={leaveTeam}
            disabled={leaving}
            className="w-48 h-14 text-xl font-bold rounded-xl transition-all duration-300 bg-no-repeat bg-center bg-cover text-white shadow-lg hover:scale-105"
            style={{
              backgroundImage: `url('/assets/round-box-hell.svg')`,
            }}
          >
            Leave Team
          </Button>
        )}
        <Button
          onClick={handleLogout}
          disabled={loading}
          className="w-48 h-14 text-xl font-bold rounded-xl transition-all duration-300 bg-no-repeat bg-center bg-cover text-white shadow-lg hover:scale-105"
          style={{
            backgroundImage: `url('/assets/round-box-hell.svg')`,
          }}
        >
          Logout
        </Button>
      </div>

      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        backgroundSvg="/assets/round-box-hell.svg"
      >
        <h2 className="text-xl font-bold mb-4 text-red-400">Notice</h2>
        <p className="mb-6 text-center text-white">{errorMessage}</p>
      </Modal>
    </div>
  );
}

export default HellInstructions;

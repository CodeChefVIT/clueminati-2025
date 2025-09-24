"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { pixelFont } from "../fonts";

function HellInstructions() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
        message = error.response.data.error || message;
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
      className={`min-h-screen relative overflow-hidden w-full font-pixel ${pixelFont.variable} flex flex-col justify-between items-center`}
    >
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: "url('/assets/hell-bg.png')" }}
      />
      <div className="relative z-10 w-full flex flex-col items-center justify-center text-white h-full p-4 max-h-[580px]">
        <div
          className="relative w-full max-w-md bg-center bg-contain bg-no-repeat flex flex-col items-center justify-center text-white h-[40rem] px-8"
          style={{ backgroundImage: "url('/assets/hell-instructions.svg')" }}
        >
          <p className="text-center text-[#A5A5A5] text-sm sm:text-base px-15">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
      <div className="relative z-10 flex justify-center flex-col pb-8 gap-4">
        <Button
          onClick={leaveTeam}
          disabled={leaving}
          className="w-48 h-14 text-md font-bold rounded-xl transition-all duration-300 bg-no-repeat bg-center bg-cover text-white shadow-lg hover:scale-105"
          style={{
            backgroundImage: `url('/assets/round-box-hell.svg')`,
          }}
        >
          Leave Team
        </Button>
        <Button
          onClick={handleLogout}
          disabled={loading}
          className="w-48 h-14 text-md font-bold rounded-xl transition-all duration-300 bg-no-repeat bg-center bg-cover text-white shadow-lg hover:scale-105"
          style={{
            backgroundImage: `url('/assets/round-box-hell.svg')`,
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}

export default HellInstructions;

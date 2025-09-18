"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { pixelFont } from "../fonts";

function HellInstructions() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
        style={{ backgroundImage: "url('/assets/hell-bg.svg')" }}
      />
      <div className="relative z-10 w-full flex flex-col items-center justify-center text-white h-full p-4">
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
      <div className="relative z-10 flex justify-center pb-8">
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
    </div>
  );
}

export default HellInstructions;

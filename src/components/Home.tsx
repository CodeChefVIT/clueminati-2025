"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "./Button";


export default function Home() {
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axios.post("/api/users/profile");
        const team = response.data.data.team;
        if (team?.total_score !== undefined) {
          setScore(team.total_score);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    fetchProfile();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center h-full relative overflow-hidden">
      <h1
        className="text-[32px] font-bold text-white mb-6"
        style={{
          WebkitTextStrokeWidth: "0.35px",
          WebkitTextStrokeColor: "#000",
        }}
      >
        Scan QR code
      </h1>

      {/* QR Scanner Icon */}
      <Image
        src="/assets/qr_scanner_icon.svg"
        alt="Scan Frame"
        width={211}
        height={163}
        className="mb-6"
      />

      {/* Scan Button */}
      <Link href="/Scanner" aria-label="Navigate to another page">
        <Image
          src="/assets/scan.svg"
          alt="Scan Button"
          width={137}
          height={38}
        />
      </Link>

      
      <div className="mt-8">
        <Button
          label={`Score: ${score}`}
          onClick={() => {}}
          className="cursor-default"
        />
      </div>
    </main>
  );
}

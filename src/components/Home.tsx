"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "./Button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<string>("");
  const [answeredForRound, setAnsweredForRound] = useState<boolean>(false);

  useEffect(() => {
    // Load current round from localStorage
    const r = localStorage.getItem("round");
    if (r) {
      setRound(r);

      // ✅ Check if question was already answered for this round
      const answeredKey = `answered_${r}`;
      const answered = localStorage.getItem(answeredKey);
      if (answered === "true") {
        setAnsweredForRound(true);
      }
    }

    // Fetch score from backend
    async function fetchProfile() {
      try {
        const response = await axios.get("/api/users/profile");
        const team = response.data.data?.team;
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
        onClick={() => router.push("/scanner")}
        src="/assets/qr_scanner_icon.svg"
        alt="Scan Frame"
        width={211}
        height={163}
        className="mb-6"
      />

      {/* Scan Button */}
      <Button
        label="Scan"
        onClick={() => router.push("/scanner")}
        className="cursor-default w-35 text-base"
      />

      {/* Round logic */}
      {round && !answeredForRound && (
        <div className="relative w-fit px-6 py-5 mt-4">
          <Image
            src="/assets/brick.svg"
            alt="next station"
            fill
            className="object-cover -z-10 rounded-lg"
          />
          <div className="relative text-white">First Station: Foodyes</div>
        </div>
      )}

      {round && answeredForRound && (
        <Button
          label="Map"
          onClick={() => router.push("/map")}
          className="cursor-default w-35 text-base mt-4"
        />
      )}

      {/* Score display */}
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

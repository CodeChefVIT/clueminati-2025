"use client";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import axios from "axios";
import Button from "./Button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<string>("");
  const [currentStation, setCurrentStation] = useState<string>("Loading...");
  const [nextStation] = useState<string>("Loading...");
  const [firstStation, setFirstStation] = useState<string>("Loading...");
  const [answeredForRound, setAnsweredForRound] = useState<boolean>(false);

  useEffect(() => {
    const firstStat = localStorage.getItem("firstStation");
    if (firstStat) {
      setFirstStation(firstStat);
    } else {
      async function randomStation() {
        try {
          const response = await axios.get("/api/get-stations");
          const stations = response.data.stations;
          const randomIndex = Math.floor(Math.random() * stations.length);
          const randomStationName = stations[randomIndex].name;

          setFirstStation(randomStationName);
          localStorage.setItem("firstStation", randomStationName);
        } catch (error) {
          console.error("Error fetching stations:", error);
        }
      }
      randomStation();
    }

    const r = localStorage.getItem("round");
    if (r) {
      setRound(r);

      const answeredKey = `answered_${r}`;
      const answered = localStorage.getItem(answeredKey);
      if (answered === "true") setAnsweredForRound(true);
    }

    async function fetchProfile() {
      try {
        const response = await axios.get("/api/users/profile");
        const team = response.data.data?.team;
        const currentStation = response.data.data?.team.currentStationName;
        setCurrentStation(currentStation)
        if (team?.total_score !== undefined) setScore(team.total_score);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    fetchProfile();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center h-full relative overflow-hidden">
      <h1
        className="text-[30px] font-bold text-white mb-4 mt-8"
        style={{
          WebkitTextStrokeWidth: "0.35px",
          WebkitTextStrokeColor: "#000",
        }}
      >
        Scan QR code
      </h1>

      <Image
        onClick={() => router.push("/scanner")}
        src="/assets/qr_scanner_icon.svg"
        alt="Scan Frame"
        width={211}
        height={163}
        className="mb-6"
      />

      <Button
        label="Scan"
        onClick={() => router.push("/scanner")}
        className="cursor-default w-35 text-[15px] "
      />

      {round === "Round 1" && !answeredForRound && (
        <div className="relative w-fit px-6 py-5 mt-7">
          <Image
            src="/assets/brick.svg"
            alt="next station"
            fill
            className="object-cover -z-10 rounded-lg"
          />
          <div className="relative text-white">
            Go To: {firstStation}
          </div>
        </div>
      )}
      {round === "Round 2" && (
        <div className="relative w-fit px-6 py-5 mt-4">
          <Image
            src="/assets/brick.svg"
            alt="next station"
            fill
            className="object-cover -z-10 rounded-lg"
          />
          <div className="relative text-white">
            Next Station: {currentStation}
          </div>
        </div>
      )}

      {round == "Round 1" && answeredForRound && (
        <Button
          label="Map"
          onClick={() => router.push("/map")}
          className="cursor-default w-35 text-base mt-4"
        />
      )}

      {/* Score display */}
      <div className="mt-8 ">
        <Button
          label={`Score: ${score}`}
          onClick={() => {}}
          className="cursor-default text-[16px]"
        />
      </div>
    </main>
  );
}

"use client";
import axios from "axios";
import Image from "next/image";

import Link from "next/link";
import { useEffect, useState } from "react";
export default function CoreMember() {
  const [station, setStation] = useState("");
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axios.get("/api/users/profile");
        const stationData = response.data.data.station;
        setStation(stationData.difficulty);
      } catch (error: any) {
        console.error(
          "Error fetching profile:",
          error.response?.data || error.message
        );
        if (error.response?.status === 401) {
        }
      } finally {
      }
    }

    fetchProfile();
  }, []);
  return (
    <main className="pt-20 w-full flex flex-col items-center justify-center p-4">
      {/* Instruction Text */}
      <div className="text-white text-lg mb-4 text-center">
        CAUTION!!! FOR ROUND 1 SERVE ONLY {station.toUpperCase()} QUESTIONS
      </div>
      <div className="text-white text-lg mb-4 text-center">Scan Team QR</div>

      {/* QR Scanner Image */}
      <div className="mb-8">
        <Image
          src="/assets/qr_scanner_icon.svg" // qr frame asset
          alt="QR Scan Frame"
          width={204}
          height={157}
          className="object-contain"
        />
      </div>

      {/* Scan Button Link */}
      <Link
        href="/core-member/scanner"
        className="group hover:scale-105 transition"
      >
        <Image
          src="/assets/scan.svg"
          alt="Scan QR Code"
          width={145}
          height={60}
          className="object-contain"
        />
      </Link>
    </main>
  );
}

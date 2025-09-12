"use client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
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

      {/* Score Section */}
      <h2
        className="mt-19 text-[30px] font-bold text-white"
        style={{
          WebkitTextStrokeWidth: "0.35px",
          WebkitTextStrokeColor: "#000",
        }}
      >
        Your Score
      </h2>
      <Image
        src="/assets/score card.svg"
        alt="Score Frame"
        width={254}
        height={70}
        className="mt-4"
      />
    </main>
  );
}

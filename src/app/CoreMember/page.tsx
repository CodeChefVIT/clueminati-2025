"use client";
import Image from "next/image";

import Link from "next/link";
export default function CoreMember() {
  return (
    <main className="relative min-h-screen w-full  flex flex-col items-center justify-start">
      {/* Transparent header (NO background color) */}
      <div className="relative z-10 w-full flex flex-col items-center pt-8 pb-2">
        <h1 className="text-3xl text-white tracking-wider text-center absolute top-[47px]">
          Home
        </h1>
      </div>
      <div className="absolute top-[172px] flex items-center justify-center">
        <Image
          src="/assets/brick.png" // pixel panel for the round
          alt="Round Panel"
          width={320}
          height={76}
          className="object-contain"
        />
        <span className="absolute left-0 right-0 text-2xl text-[#F7F7EE] text-center">
          Round 1
        </span>
      </div>

      {/* Timer Panel */}
      <div className="absolute top-[267px] mb-4 flex items-center justify-center">
        <Image
          src="/assets/brick.png" // pixel panel for the timer
          alt="Timer Panel"
          width={320}
          height={76}
          className="object-contain"
        />
        <span className="absolute left-0 right-0 text-2xl font-bold text-[#F7F7EE] text-center">
          1:23:12
        </span>
      </div>
      {/* Scan Team QR instruction */}
      <div className="absolute top-[426px] text-white text-lg mt-6 mb-2 text-center">
        Scan Team QR
      </div>
      {/* QR frame illustration */}
      <div className=" absolute top-[497px] flex items-center justify-center mb-4">
        <Image
          src="/assets/qr_scanner_icon.png" // qr frame asset
          alt="QR Scan Frame"
          width={204}
          height={157}
          className="object-contain"
        />
        {/* (Optional QR icon inside) */}
      </div>
      {/* Scan Button */}
      <Link
        href="/CoreMemberScanner"
        aria-label="Scan QR Code" // More descriptive for accessibility
        className="absolute top-[670px] flex items-center justify-center mt-2 group z-10 hover:scale-105 transition"
      >
        <Image
          src="/assets/scan.png"
          alt="Scan Button" // This is already good!
          width={145}
          height={60}
          className="object-contain"
        />
      </Link>
      {/* This was the incorrect line -> </section> */}
    </main>
  );
}

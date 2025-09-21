"use client";
import Image from "next/image";

import Link from "next/link";
export default function CoreMember() {
  return (
    <main className="pt-20 w-full flex flex-col items-center justify-center p-4">
      {/* Instruction Text */}
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

      <Link
        href="/core-member/choose-station"
        className="group relative hover:scale-105 transition flex items-center justify-center"
      >
        {/* Background Image */}
        <Image
          src="/assets/round-box.svg"
          alt="Choose Station"
          width={200}
          height={85}
          className="object-contain pt-12"
        />

        {/* Overlay Text */}
        <span className="absolute inset-0 translate-y-[25px] flex items-center justify-center text-white text-lg font-semibold pointer-events-none">
          Choose Station
        </span>
      </Link>
    </main>
  );
}

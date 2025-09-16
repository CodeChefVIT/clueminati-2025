"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
export default function CoreMember() {
  const [qrValue, setQrValue] = useState("Default QR Code Value");

  return (
    <main className="relative  w-full flex flex-col items-center justify-center gap-y-6 p-4">
      {/* Header */}

      {/* Team Name Display */}
      <div className="relative flex items-center justify-center">
        <Image
          src="/assets/brick.svg"
          alt="Team Name Panel"
          width={320}
          height={76}
          className="object-contain"
        />
        <span className="absolute text-2xl text-[#F7F7EE] text-center">
          Team Name
        </span>
      </div>

      {/* Score Display */}
      <div className="relative flex items-center justify-center">
        <Image
          src="/assets/brick.svg"
          alt="Score Panel"
          width={238}
          height={60}
          className="object-contain"
        />
        <span className="absolute text-2xl font-bold text-[#F7F7EE] text-center">
          Score
        </span>
      </div>

      {/* QR frame */}
      <div className="relative flex items-center justify-center ">
        <Image
          src="/assets/QR BG.svg"
          alt="QR Scan Frame"
          width={276}
          height={276}
          className="object-contain"
        />
        <div className="absolute">
          <QRCodeSVG
            value={qrValue}
            size={125} // Size of the QR code in pixels
            bgColor={"transparent"} // Background color
            fgColor={"#83B283"} // Foreground (code) color
            level={"L"} // Error correction level
          />
        </div>
      </div>

      {/* Close Button */}
      <Link href="/CoreMember" aria-label="Close page">
        <Image
          src="/assets/close.svg"
          alt="Close Button"
          width={145}
          height={60}
          className="object-contain"
        />
      </Link>
    </main>
  );
}

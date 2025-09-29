"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
export default function CoreMemberQrPage() {
  const params = useParams();
  const questionId = params.id as string;

  return (
    <main className="relative pt-20 w-full flex flex-col items-center justify-center gap-y-6 p-4">
      {/* Header */}

      <h1 className="text-2xl font-bold text-white text-center">Question ID: {questionId}</h1>

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
            value={questionId}
            bgColor="#000000"
              fgColor="#ffffff"
            size={125} // Size of the QR code in pixels
            level={"L"} // Error correction level
          />
        </div>
      </div>

      {/* Close Button */}
      <Link href="/core-member" aria-label="Close page">
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

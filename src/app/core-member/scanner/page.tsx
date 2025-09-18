"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Scanner } from "@yudiel/react-qr-scanner";
import Link from "next/link";
import GamePopup from "@/components/gamePopup";

export default function ScannerPage() {
  const [scannedResult, setScannedResult] = useState("");
  const [isScanning, setIsScanning] = useState(true);
  const [manualCode, setManualCode] = useState("");
  const [useManual, setUseManual] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Manual Code Entered:", manualCode);
  };

  const handleScan = (result: string) => {
    // MongoDB ObjectId validation regex
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;

    if (objectIdRegex.test(result)) {
      setScannedResult(result);
      setIsScanning(false);
      router.push(`/core-member/difficulty/${result}`);
    } else {
      setMessage("Invalid QR Code. Not a valid Team ID.");
      setShowPopup(true);
    }
  };

  return (
    <main className="relative pt-10 w-full flex flex-col items-center justify-center gap-y-8 overflow-hidden no-scrollbar">
      {/* Header */}
      <div className="relative z-10">
        <Image
          src="/assets/scan-page-header.png"
          alt="Scan Page Header"
          width={229}
          height={67}
        />
      </div>

      {/* Scanner with overlay */}
      <div className="relative w-[300px] h-[300px] flex items-center justify-center z-10">
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
          {isScanning && (
            <Scanner
              onScan={(detectedCodes) => {
                if (detectedCodes.length > 0) {
                  const result = detectedCodes[0].rawValue;
                  handleScan(result);
                }
              }}
              onError={(error) => {
                console.error("QR Scanner Error:", error);
              }}
              constraints={{ facingMode: "environment" }}
              styles={{
                container: { width: "100%", height: "100%" },
                video: { objectFit: "cover", width: "100%", height: "100%" },
              }}
            />
          )}
        </div>

        <Image
          src="/assets/scanner-screen.svg"
          alt="Scanner Frame Overlay"
          fill
          className="pointer-events-none object-contain absolute top-0 left-0 z-20"
        />
      </div>

      {/* Manual Input box */}
      {/* {useManual && (
        <div className="relative w-[360px] h-[78px] z-10">
          <Image
            src="/assets/mannual entry.svg"
            alt="Manual Entry Frame"
            fill
            className="object-contain pointer-events-none"
          />
          <form
            className="absolute inset-0 flex items-center justify-center"
            onSubmit={handleManualSubmit}
          >
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Enter the code manually"
              className="w-[80%] h-[50%] bg-transparent text-center text-white placeholder:text-gray-300 focus:outline-none"
            />
          </form>
        </div>
      )} */}

      {/* Close Button */}
      <Link
        href="/core-member"
        aria-label="Close Scanner"
        className="group z-10 hover:scale-105 transition"
      >
        <Image
          src="/assets/close.svg"
          alt="Close Button"
          width={145}
          height={60}
          className="object-contain"
        />
      </Link>

      {/* Debug output */}
      {(scannedResult || manualCode) && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 p-2 bg-gray-800 rounded-md text-white text-sm max-w-[300px] break-words z-30">
          {useManual ? `Manual: ${manualCode}` : `Scanned: ${scannedResult}`}
        </div>
      )}
      <GamePopup isOpen={showPopup} onClose={() => setShowPopup(false)} message={message} />
    </main>
  );
}

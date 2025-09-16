"use client";

import { useState } from "react";
import Image from "next/image";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useRouter } from "next/navigation";
import axios from "axios";
import GamePopup from "@/components/gamePopup";

export default function ScannerPage() {
  const [scannedResult, setScannedResult] = useState("");
  const [isScanning, setIsScanning] = useState(true);
  const [manualCode, setManualCode] = useState("");
  const [useManual, setUseManual] = useState(true);
  const [showPopup, setShowPopup] = useState(false); // <-- popup state
  const [message, setMessage] = useState('');

  const router = useRouter();

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get("/api/round-one/get-question-by-id", {
        params: { id: manualCode },
      });
      router.push("/question/" + manualCode);
    } catch (error: any) {
      console.error(error);
      setMessage(error.response.data.error);
      setShowPopup(true);
    }
  };

  const handleScan = async (result: string) => {
    try {
      const response = await axios.get("/api/round-one/get-question-by-id", {
        params: { id: result },
      });
      setScannedResult(result);
      setIsScanning(false);
      router.push("/question/" + result);
    } catch (error: any) {
      console.error(error);
      setMessage(error.response.data.error);
      setShowPopup(true);
      setIsScanning(true);
    }
  };

  return (
    <main className="relative h-screen w-full flex flex-col items-center justify-start overflow-hidden no-scrollbar">
      {/* Header */}
      <div className="mt-[60px] relative z-10">
        <Image
          src="/assets/scan page header.png"
          alt="Scan Page Header"
          width={229}
          height={67}
        />
      </div>

      {/* Scanner with overlay */}
      <div className="mt-[20px] relative w-[340px] h-[340px] flex items-center justify-center z-10">
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
          {isScanning && (
            <Scanner
              onScan={(detectedCodes) => {
                if (detectedCodes.length > 0) {
                  const result = detectedCodes[0].rawValue;
                  console.log("QR Code Result:", result);
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
          src="/assets/scanner screen.svg"
          alt="Scanner Frame Overlay"
          fill
          className="pointer-events-none object-contain absolute top-0 left-0 z-20"
        />
      </div>

      {/* Manual Input box */}
      {useManual && (
        <div className="mt-[30px] relative w-[360px] h-[78px] z-10">
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
      )}

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

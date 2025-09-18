"use client";
import React from "react";

interface CodeModal {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  backgroundSvg?: string;
  showCloseButton?: boolean
}

const TeamCode: React.FC<CodeModal> = ({
  joinCode,
  onProceed,
  backgroundSvg,
  isOpen,
  onClose,
  children,
  showCloseButton = true,
}) => {
  const copyCode = () => {
    navigator.clipboard.writeText(joinCode);
    alert("Code copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div className="relative max-w-md w-full">
        <div
          className="relative bg-cover bg-center bg-no-repeat p-8 min-h-[260px] flex flex-col items-center justify-center"
          style={{
            backgroundImage: backgroundSvg ? `url(${backgroundSvg})` : "none",
            backgroundColor: !backgroundSvg ? "#1C1C1C" : "transparent",
            border: !backgroundSvg ? "1px solid #4A4A4A" : "none",
            borderRadius: !backgroundSvg ? "1rem" : "0",
          }}
        >
          <div className="text-center space-y-4 px-4">
            <h2 className="font-bold text-2xl" style={{ color: "#fcfcfcff" }}>
              Team Successfully Created!
            </h2>

            <p className="text-lg text-gray-300">
              Join Code:{" "}
              <span className="font-mono bg-gray-700 px-2 py-1 rounded">
                {joinCode}
              </span>
              <button
                onClick={copyCode}
                className="ml-2 text-blue-400 underline"
              >
                Copy
              </button>
            </p>

            <button
              onClick={onProceed}
              className="mt-6 w-full h-12 bg-cover bg-center bg-no-repeat text-white font-bold flex items-center justify-center"
              style={{
                backgroundImage: "url(/assets/X.svg)",
              }}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCode;

"use client";
import React from "react";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface TeamPopUp {
  isOpen: boolean;
  teamName: string;
  joinCode: string;
  onProceed: () => void;
}

const Popup: React.FC<TeamPopUp> = ({
  isOpen,
  teamName,
  joinCode,
  onProceed,
}) => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div className="bg-[#D3D5D7] rounded-lg p-6 w-full max-w-md mx-auto">
        <div className="text-center mb-5">
          <h2 className="text-xl font-bold text-black mb-2">
            Team Created Successfully!
          </h2>
          <p className="text-black">
            Your team has been created. Share the join code with others to let
            them join.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="rounded-lg p-4">
            <label className="block text-sm font-medium text-black mb-2">
              Team Name
            </label>
            <div className="text-lg font-base text-black ">{teamName}</div>
          </div>

          <div className="bg-[#D3D5D7] rounded-lg p-4">
            <label className="block text-sm font-sm text-black mb-2">
              Join Code
            </label>
            <div className="flex items-center justify-between bg-white border rounded-lg px-3 py-2">
              <span className="text-lg font-base text-[#24CCFF]">
                {joinCode}
              </span>
              <button
                onClick={() => copyToClipboard(joinCode)}
                className="ml-2 p-2 text-gray-500 rounded-lg"
                title="Copy join code"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
            {copied && (
              <p className="text-sm text-black mt-1">Copied to clipboard!</p>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-30">
          <Button
            type="submit"
            disabled={loading}
            className="w-38 h-9 bg-no-repeat bg-center rounded-xl bg-cover flex items-center justify-center"
            style={{
              backgroundImage: "url('/assets/proceedbuttonlogin.svg')",
            }}
          >
            {loading ? "Creating..." : ""}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Popup;

"use client";
import React from "react";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface TeamCreatedModalProps {
  isOpen: boolean;
  teamName: string;
  joinCode: string;
  onProceed: () => void;
}

const TeamCreatedModal: React.FC<TeamCreatedModalProps> = ({
  isOpen,
  teamName,
  joinCode,
  onProceed,
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Team Created Successfully!
          </h2>
          <p className="text-gray-600">
            Your team has been created. Share the join code with others to let them join.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Name
            </label>
            <div className="text-lg font-semibold text-gray-800">
              {teamName}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Join Code
            </label>
            <div className="flex items-center justify-between bg-white border rounded-lg px-3 py-2">
              <span className="text-lg font-mono font-semibold text-gray-800">
                {joinCode}
              </span>
              <button
                onClick={() => copyToClipboard(joinCode)}
                className="ml-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
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
              <p className="text-sm text-green-600 mt-1">Copied to clipboard!</p>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onProceed}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamCreatedModal;
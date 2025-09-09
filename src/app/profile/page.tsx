"use client";

import { useState } from "react";
// @ts-ignore
import QRCode from "react-qr-code";
import Button from "../../components/Button";

export default function ProfileScreen() {
  const [showQR, setShowQR] = useState<boolean>(false);
  const dummyTeamId = "TEAM-12345-BLUELOCK";

  const profilePic = "/assets/profile-pic.png";

  return (
    <div className="w-full flex flex-col items-center justify-start text-white min-h-[calc(100vh-7rem)] p-4 sm:p-8 pt-4">
      {/* Top Bar */}
      

      <div className="flex flex-col items-center ">
        {/* Profile Picture */}
        <div className="relative w-36 h-36 sm:w-48 sm:h-48 mb-4">
          <img
            src={profilePic}
            alt="Profile"
            className="w-full h-full rounded-full object-cover relative z-10"
          />
          <div className="absolute inset-0 rounded-full bg-black/40 z-0 blur-[12px]"></div>
        </div>
        {/* Name and Email */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Ayman Raza
          </h1>
          <p className="text-base sm:text-lg text-gray-300">
            aymanraza2024@vitstudent.ac.in
          </p>
        </div>

        {/* Team Info */}
        <div className="text-white text-xl sm:text-2xl max-w-xs w-full mb-8 space-y-6">
          <div className="flex justify-between">
            <span>Team Name:</span>
            <span>BLUELOCK</span>
          </div>
          <div className="flex justify-between">
            <span>Team Code:</span>
            <span>i914thGen</span>
          </div>
          <div className="flex justify-between">
            <span>Role Type:</span>
            <span>HELL</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col space-y-2 items-center w-full max-w-xs">
          <Button
            label="Leave Team"
            onClick={() => alert("Leave Team clicked")}
          />
          <Button label="Log Out" onClick={() => alert("Log Out clicked")} />
          <Button label="Show Team QR" onClick={() => setShowQR(true)} />
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 px-4">
          <div className="relative w-full max-w-md bg-[#1a1a1a] rounded-2xl p-6 flex flex-col items-center shadow-lg border border-green-500/40">
            <h2 className="text-green-400 font-bold text-lg mb-4">
              Team QR Code
            </h2>
            {/* @ts-ignore */}
            <QRCode
              value={dummyTeamId}
              size={260}
              bgColor="#3b2f2f"
              fgColor="#22c55e"
            />
            <p className="text-green-300 font-semibold mt-4 text-sm break-all text-center">
              {dummyTeamId}
            </p>

            <Button
              label="Close"
              onClick={() => setShowQR(false)}
              className="w-40 sm:w-44 text-lg sm:text-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}

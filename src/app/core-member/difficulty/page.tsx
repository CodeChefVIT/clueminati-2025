"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CoreMemberDifficulty() {
  const [difficulty, setDifficulty] = useState("Medium");
  const [isOpen, setIsOpen] = useState(false);

  const difficulties = ["Easy", "Medium", "Hard"];

  const handleOptionClick = (level: string) => {
    setDifficulty(level);
    setIsOpen(false); // Close the dropdown after selection
  };

  return (
    <main className="relative pt-8 w-full flex flex-col items-center justify-center gap-y-8 p-4">
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

      <div className="relative mt-16">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-center"
        >
          <Image
            src="/assets/brick.svg"
            alt="Pick Difficulty background"
            width={320}
            height={76}
            className="object-contain"
          />
          <span className="absolute text-2xl text-[#F7F7EE] text-center pointer-events-none">
            {difficulty}
          </span>
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 w-full z-20">
            <div className="relative flex flex-col items-center justify-center">
              <Image
                src="/assets/brick.svg" // Using your asset as a background
                alt="Dropdown Menu Background"
                width={320}
                height={120} // Adjusted height for 3 options
              />
              <div className="absolute inset-0 flex flex-col justify-around p-2">
                {difficulties.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleOptionClick(level)}
                    className="text-xl text-[#F7F7EE] text-center hover:bg-white/10 rounded-md"
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Link
        href="/core-member/qr"
        aria-label="Generate QR Code"
        className="group hover:scale-105 transition"
      >
        <Image
          src="/assets/generate.svg"
          alt="Generate Button"
          width={145}
          height={60}
          className="object-contain"
        />
      </Link>
    </main>
  );
}

"use client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ChooseStation() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <main className="pt-20 w-full flex flex-col items-center justify-center p-4">
      {/* Instruction Text */}
      <div className="text-white text-lg mb-4 text-center">
        Choose the station
      </div>

      {/* Dropdown */}
      <div className="relative mt-16">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-center"
        >
          <Image
            src="/assets/brick.svg"
            alt="Pick Station background"
            width={320}
            height={76}
            className="object-contain"
          />
          {/* Label + Arrow */}
          <span className="absolute flex items-center gap-2 text-2xl text-[#F7F7EE] text-center pointer-events-none">
            {selectedOption ?? "Select Station"}
            <ChevronDown
              size={24}
              className={`transition-transform ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </span>
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 w-full z-20 max-h-72 overflow-y-auto flex flex-col items-center gap-2">
            {Array.from({ length: 12 }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleOptionClick(`Option ${i + 1}`)}
                className="relative flex items-center justify-center"
              >
                <Image
                  src="/assets/brick.svg"
                  alt={`Option ${i + 1} background`}
                  width={220}
                  height={40}
                  className="object-contain"
                />
                <span className="absolute text-xl text-[#F7F7EE] text-center pointer-events-none">
                  Option {i + 1}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Close Button */}
      <Link
        href="/core-member"
        className="group relative hover:scale-105 transition flex items-center justify-center"
      >
        {/* Background Image */}
        <Image
          src="/assets/round-box.svg"
          alt="Choose Station"
          width={145}
          height={60}
          className="object-contain pt-12"
        />

        {/* Overlay Text */}
        <span className="absolute inset-0 translate-y-[25px] flex items-center justify-center text-white text-lg font-semibold pointer-events-none">
          Submit
        </span>
      </Link>

      {/* Close Button */}
      <Link
        href="/core-member/choose-station"
        className="group relative hover:scale-105 transition flex items-center justify-center"
      >
        {/* Background Image */}
        <Image
          src="/assets/round-box.svg"
          alt="Choose Station"
          width={145}
          height={60}
          className="object-contain pt-8"
        />

        {/* Overlay Text */}
        <span className="absolute inset-0 translate-y-[18px] flex items-center justify-center text-white text-lg font-semibold pointer-events-none">
          Close
        </span>
      </Link>
    </main>
  );
}

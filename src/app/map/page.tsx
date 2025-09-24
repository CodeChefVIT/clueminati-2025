"use client";

import Button from "@/components/Button";
import Link from "next/link";

const mapSvgPath = "/assets/map.jpg"; 
const Brick = "/assets/brick.svg"; 

export default function MapScreen() {
  return (
    <div className="screen relative h-screen w-full bg-transparent">
      <div className="absolute top-[50px] bottom-[70px] left-0 right-0 overflow-y-auto">
        <div className="flex flex-col items-center gap-6 p-4">
          
          {/* Map Image */}
          <img
            src={mapSvgPath}
            alt="Game Map"
            className="w-[320px] h-auto rounded-md shadow-2xl"
          />

          <p className="text-center text-white text-[0.8rem] font-semibold w-[250px] leading-snug mb-2">
            Click the Stations button to view locations
          </p>

          <a
            href="https://maps.app.goo.gl/wywN5KHuZHghMKBX8"
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-[150px] flex items-center justify-center cursor-pointer"
          >
            <img
              src={Brick}
              alt="Station Brick"
              className="w-[150px] h-auto object-contain"
            />
            <span className="absolute text-white font-semibold text-[0.8rem]">
              Stations
            </span>
          </a>

        </div>
      </div>
    </div>
  );
}

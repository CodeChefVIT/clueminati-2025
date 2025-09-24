"use client";

import Button from "@/components/Button";

import Link from "next/link";
const mapSvgPath = "/assets/map.jpg"; 
const Brick="/assets/brick.svg"; 

export default function MapScreen() {
  return (
    
  <div className="screen relative h-screen w-full bg-transparent ">
      <div className="absolute top-[50px] bottom-[70px] left-0 right-0 overflow-y-auto">
         <div className="flex flex-col items-center gap-6 p-4">
        <img
          src={mapSvgPath}
          alt="Game Map"
          className="w-[320px] h-auto rounded-md shadow-2xl" 
        />
        <div className="relative w-[150px] flex items-center justify-center">
        <img
          src={Brick}
          alt="Game Map"
          className="w-[150px] h-auto object-contain translate-y-[40px]" 
        />
         <a
            href="https://maps.app.goo.gl/wywN5KHuZHghMKBX8"
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-[150px] flex items-center justify-center cursor-pointer"
          ></a>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
<p className="text-center text-white text-[0.7rem] font-semibold w-[250px] mx-30 leading-snug translate-y-[55px]">
            Stations
          </p>
          <p className="text-center text-white text-[0.7rem] font-semibold w-[250px] mx-30 leading-snug translate-y-[-17px]">
            Click the button to view station locations
          </p>
        </div>
        </div>
        
      
        
        
        
      </div>
      
    

      </div>
      
    </div>
    
  );
}
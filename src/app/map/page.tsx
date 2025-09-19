"use client";

import Button from "@/components/Button";
const mapSvgPath = "/assets/map.svg"; 
const Brick="/assets/brick.png"; 

export default function MapScreen() {
  return (
  <div className="w-[600px] h-[600px] flex items-center justify-center p-4 bg-transparent ">
      <div className="relative w-full max-w-[200px] bg-white rounded-lg p-1.5 shadow-2xl -mt-40 left-0">
        <img
          src={mapSvgPath}
          alt="Game Map"
          className="w-full h-auto rounded-md" 
        />
      </div>
      <div className="relative w-full max-w-[263px] rounded-lg p-1.5 shadow-2xl right-59 mt-77">
        <img
          src={Brick}
          alt="Game Map"
          className="w-full h-auto rounded-md" 
        />
      </div>
    <div className="max-w-[40px] rounded-lg  right-66 mt-190">
        <span className="absolute inset-0 bg-transparent text-center text-xs sm:text-sm text-white font-semibold focus:outline-none px-10 py-110">
                The areas marked in green are your stations
              </span>
      </div>
      
    </div>
    
  );
}
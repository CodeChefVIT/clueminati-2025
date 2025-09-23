"use client";

import Button from "@/components/Button";
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
        <img
          src={Brick}
          alt="Game Map"
          className="w-[300px] h-auto object-contain" 
        />
      </div>
    <p className="text-center text-white text-[1rem] font-semibold w-[250px] mx-auto leading-snug -mt-17">
            Here are your stations 
          </p>

      </div>
      
    </div>
    
  );
}
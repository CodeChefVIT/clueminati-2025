"use client";

import Button from "@/components/Button";
const mapSvgPath = "/assets/map.svg"; 
const Brick="/assets/brick.png"; 

export default function MapScreen() {
  return (
    
  <div className="screen relative overflow-hidden  inset-0 flex items-center justify-center p-4 bg-transparent ">
      <div className="absolute top-7 left-20 w-[200px] h-auto bg-white rounded-lg p-1.5 shadow-2xl"
       style={{
          touchAction: 'none',
          overscrollBehavior: 'none'
        }}>
        <img
          src={mapSvgPath}
          alt="Game Map"
          className="w-full h-auto rounded-md" 
        />
      </div>
      <div className="relative overflow-visible flex items-center justify-center top-[170px] w-full rounded-lg p-20 shadow-2xl absolute right-[32px] mt-[290px]  ">
        <img
          src={Brick}
          alt="Game Map"
          className="absolute bottom-20 right-10 w-[220px] h-[220px] object-contain " 
        />
      </div>
    <div className=" max-w-[40px] rounded-lg ">
<span className="absolute inset-0 -left-[20px] bg-transparent text-center text-[0.52rem] sm:text-sm text-white font-semibold focus:outline-none px-20 py-110">
                The areas marked in green are your stations
              </span>
      </div>
      
    </div>
    
  );
}
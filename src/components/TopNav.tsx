import React from "react";

function TopNav() {
  return (
    <div className="w-full  flex justify-between items-center  z-20 pt-6">
      <div className="relative w-40 sm:w-44">
        <img src="/assets/round-box.svg" alt="Round" className="w-full" />
        <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
          Round S
        </span>
      </div>

      <div className="relative w-40 sm:w-44">
        <img src="/assets/timer-box.svg" alt="Timer" className="w-full" />
        <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
          01:28:49
        </span>
      </div>
    </div>
  );
}

export default TopNav;

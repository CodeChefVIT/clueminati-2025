"use client";

const timerBox = "/assets/timer-box.png";

export default function TopBar() {
  return (
    <div className="w-full max-w-sm flex justify-between items-center mx-auto mb-6 gap-x-6 mt-2">
      <div className="relative w-36 sm:w-44">
        <img src="/assets/round-box.png" alt="Round" className="w-full" />
        <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
          Round S
        </span>
      </div>

      <div className="relative w-36 sm:w-44">
        <img src={timerBox} alt="Timer" className="w-full" />
        <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
          01:28:49
        </span>
      </div>
    </div>
  );
}

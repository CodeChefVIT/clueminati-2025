"use client";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center justify-start text-white min-h-screen p-4">
      <div className="relative w-[100%] max-w-md bg-center bg-contain bg-no-repeat flex flex-col items-center justify-center text-white aspect-[3/4]"
        style={{ backgroundImage: "url('/assets/instructions_bg.svg')" }}
      >
        <h2 className="text-lg sm:text-xl font-bold mb-4 mt-12 text-[#A5A5A5]">Instructions</h2>

        <ul className="space-y-2 text-center text-[#A5A5A5] text-sm sm:text-base">
          <li>Instructions</li>
          <li>Instructions</li>
          <li>Instructions</li>
          <li>Instructions</li>
          <li>Instructions</li>
        </ul>
      </div>

      <div
        className="mt-6 w-[60%] max-w-xs h-23 bg-center bg-contain bg-no-repeat flex items-center justify-center text-white font-bold tracking-wide cursor-pointer"
        style={{ backgroundImage: "url('/assets/proceed.svg')" }}
      />
    </div>
  );
}

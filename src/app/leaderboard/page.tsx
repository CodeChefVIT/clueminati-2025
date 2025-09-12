"use client";

import Image from "next/image";

const teams = [
  { rank: 1, name: "SANJAN the platipus" },
  { rank: 2, name: "NarendrNOT" },
  { rank: 3, name: "Parthinator" },
  { rank: 4, name: "OBAMA-BIN-OSAMA" },
  { rank: 5, name: "Yatharth" },
  { rank: 6, name: "Team 6" },
  { rank: 7, name: "Team 7" },
  { rank: 8, name: "Team 8" },
  { rank: 9, name: "Team 9" },
  { rank: 10, name: "Team 10" },
];

const getBanner = (rank: number) => {
  if (rank >= 1 && rank <= 10) {
    return `/assets/banners/banner-${rank}.png`;
  }
  return "/assets/banners/banner-default.png";
};

export default function Leaderboard() {
  return (
    <div className="flex flex-col items-center h-full">
      <h2 className="text-3xl text-center py-6 font-bold">Top Performers</h2>

      {/* Scrollable list */}
      <div className="w-full max-w-lg flex-1 px-4 overflow-y-auto">
        <div className="flex flex-col gap-6">
          {teams.map((team) => (
            <div key={team.rank} className="relative w-full h-32 md:h-40">
              {/* Banner image */}
              <Image
                src={getBanner(team.rank)}
                alt={`Rank ${team.rank}`}
                fill
                className="object-contain"
              />

              {/* Team name */}
              <span className="absolute inset-0 flex items-center justify-center text-xl sm:text-3xl font-bold truncate px-8 z-10">
                {team.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

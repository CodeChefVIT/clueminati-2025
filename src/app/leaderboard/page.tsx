"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

type Team = {
  rank: number;
  name: string;
  total_score?: number;
  members?: string[];
};

// Placeholder 
const placeholderTeams: Team[] = [
  { rank: 1, name: "Platypus" },
  { rank: 2, name: "Perry" },
];

export default function Leaderboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getBanner = (rank: number) => {
    if (rank >= 1 && rank <= 10) {
      return `/assets/banners/banner-${rank}.svg`;
    }
    return "/assets/banners/banner-default.svg";
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/leaderboard");

        // If API returns data array, use it; otherwise, use placeholders
        setTeams(res.data?.data && res.data.data.length > 0 ? res.data.data : placeholderTeams);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch leaderboard. Showing placeholders.");
        setTeams(placeholderTeams);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);


  if (loading) {
    return <p className="text-center py-6 text-white">Loading leaderboard...</p>;
  }

  if (error) {
    return <p className="text-center py-6 text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col items-center h-full text-white">
      <h2 className="text-3xl text-center py-6 font-bold">Top Performers</h2>

      <div className="w-full max-w-lg flex-1 px-4 overflow-y-auto">
        <div className="flex flex-col ">
          {teams.map((team) => (
            <div key={team.rank} className="relative w-full h-32 md:h-40">
              <Image
                src={getBanner(team.rank)}
                alt={`Rank ${team.rank}`}
                fill
                className="object-contain"
              />
              <span className="absolute inset-0 flex items-center justify-start text-xl sm:text-3xl font-bold truncate px-8 z-10 left-20">
                {team.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Submission = {
  questionId: string;
  difficulty: "easy" | "medium" | "hard";
  questionDescription: string | null;
};

export default function History() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState<number>(0);

  // ✅ Fetch profile to get total_score
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axios.post("/api/users/profile");
        const team = response.data.data.team;
        if (team?.total_score !== undefined) {
          setScore(team.total_score);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    fetchProfile();
  }, []);

  // ✅ Fetch submissions (API already uses token → no teamId needed)
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch(`/api/submission-history`);
        const data = await res.json();
        if (res.ok) {
          setSubmissions(data.solved);
        } else {
          console.error("Error fetching history:", data.error);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  // ✅ Difficulty → points mapping
  const getPoints = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return 10;
      case "medium":
        return 40;
      case "hard":
        return 70;
      default:
        return 0;
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-start text-white min-h-[calc(100vh-7rem)] p-8 sm:p-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">
        Submission History
      </h1>

      {/* Score box */}
      <div className="mb-6">
        <div
          className="flex items-center justify-center text-lg font-bold text-[#CDCDCD] w-60 h-16 sm:w-72 sm:h-20"
          style={{
            backgroundImage: "url('/assets/score_bg.svg')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <span className="ml-2 text-lg text-[#ffffff]">
            {`Score: ${score}`}
          </span>
        </div>
      </div>

      {/* Submissions list */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="w-full flex flex-col gap-2 max-w-md">
          {submissions.length === 0 ? (
            <p>No submissions yet</p>
          ) : (
            submissions.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center px-6 py-3 w-full max-w-md min-h-[100px]"
                style={{
                  backgroundImage: "url('/assets/submission_bg.svg')",
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base">
                    {item.questionDescription || "No description available"}
                  </span>
                  <span className="text-xs opacity-80">{item.difficulty}</span>
                </div>
                <span className="text-4xl font-bold text-yellow-400">
                  +{getPoints(item.difficulty)}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Submission = {
  questionId: string;
  difficulty: "easy" | "medium" | "hard";
  questionDescription: string | null;
  round: string | null;
};

export default function History() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState<number>(0);



  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(`/api/submission-history`);
        const data = res.data;
        if (data.solved) {
          setSubmissions(data.solved);
        }

        if (data.total_score !== undefined) {
          setScore(data.total_score);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const getPoints = (difficulty: string, round: string | null) => {
    if (round === "1") {
      switch (difficulty) {
        case "easy":
          return 20;
        case "medium":
          return 40;
        case "hard":
          return 70;
        default:
          return 0;
      }
    } else if (round === "2") {
      switch (difficulty) {
        case "easy":
          return 25;
        case "medium":
        case "hard":
          return 60;
        default:
          return 0;
      }
    }
    return 0; // fallback for unknown rounds
  };

  return (
    <div className="w-full flex flex-col items-center justify-start text-white  p-8 sm:p-12">
      <h1 className="text-2xl sm:text-2xl font-bold mb-6">
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
                className="flex justify-between items-center px-11 py-3 w-full max-w-md min-h-[100px]"
                style={{
                  backgroundImage: "url('/assets/submission_bg.svg')",
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base">
                    {item.questionDescription && item.questionDescription.length > 40
                      ? `${item.questionDescription.substring(0, 40)}...`
                      : item.questionDescription || "No description available"}
                  </span>
                  <span className="text-xs opacity-80">{item.difficulty}</span>
                </div>
                <span className="text-xl font-bold text-yellow-400">
                  +{getPoints(item.difficulty, item.round)}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import Modal from "@/components/Modal";

const questionBox = "/assets/Question_Box.svg";

export default function CoreMemberDifficulty() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [teamName, setTeamName] = useState("Loading...");
  const [score, setScore] = useState<number | string>("...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [difficulty, setDifficulty] = useState("Medium");
  const [isOpen, setIsOpen] = useState(false);

  const difficulties = ["Easy", "Medium", "Hard"];

  useEffect(() => {
    if (!id) return;

    const fetchTeamData = async () => {
      try {
        const response = await axios.get("/api/get-team-by-id", {
          params: { teamId: id },
        });
        const { teamname, total_score } = response.data.data;
        setTeamName(teamname);
        setScore(total_score);
      } catch (err) {
        console.error("Error fetching team data:", err);
        let message = "Failed to fetch team data.";
        if (isAxiosError(err) && err.response) {
          message = err.response.data.error || message;
        }
        setErrorMessage(message);
        setShowErrorModal(true);
      }
    };

    fetchTeamData();
  }, [id]);

  const handleOptionClick = (level: string) => {
    setDifficulty(level);
    setIsOpen(false);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    try {
      const response = await axios.post("/api/round/serve-question", {
        teamId: id,
        difficulty: difficulty.toLowerCase(),
      });
      const questionId = response.data.data._id;
      router.push(`/core-member/qr/${questionId}`);
    } catch (err) {
      console.error("Error generating question:", err);
      let message = "Failed to generate a question.";
      if (isAxiosError(err) && err.response) {
        message = err.response.data.error || message;
      }
      setErrorMessage(message);
      setShowErrorModal(true);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="relative pt-8 w-full flex flex-col items-center justify-center gap-y-8 p-4">
      <div className="relative flex items-center justify-center">
        <Image
          src="/assets/brick.svg"
          alt="Team Name Panel"
          width={320}
          height={76}
          className="object-contain"
        />
        <span className="absolute text-2xl text-[#F7F7EE] text-center">
          {teamName}
        </span>
      </div>

      <div className="relative flex items-center justify-center">
        <Image
          src="/assets/brick.svg"
          alt="Score Panel"
          width={238}
          height={60}
          className="object-contain"
        />
        <span className="absolute text-2xl font-bold text-[#F7F7EE] text-center">
          Score: {score}
        </span>
      </div>

      <div className="relative mt-16">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-center"
        >
          <Image
            src="/assets/brick.svg"
            alt="Pick Difficulty background"
            width={320}
            height={76}
            className="object-contain"
          />
          <span className="absolute text-2xl text-[#F7F7EE] text-center pointer-events-none">
            {difficulty}
          </span>
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 w-full z-20">
            <div className="relative flex flex-col items-center justify-center">
              <Image
                src="/assets/brick.svg"
                alt="Dropdown Menu Background"
                width={320}
                height={120}
              />
              <div className="absolute inset-0 flex flex-col justify-around p-2">
                {difficulties.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleOptionClick(level)}
                    className="text-xl text-[#F7F7EE] text-center hover:bg-white/10 rounded-md"
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating}
        aria-label="Generate QR Code"
        className="group hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Image
          src="/assets/generate.svg"
          alt={isGenerating ? "Generating..." : "Generate Button"}
          width={145}
          height={60}
          className="object-contain"
        />
      </button>
      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        backgroundSvg={questionBox}
      >
        <div className="text-center space-y-6 px-4">
          <h2 className="text-xl font-bold text-red-500">Error</h2>
          <p className="text-base text-gray-300 leading-relaxed">
            {errorMessage}
          </p>
        </div>
      </Modal>
    </main>
  );
}

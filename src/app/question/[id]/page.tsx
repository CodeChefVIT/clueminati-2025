"use client";

import Button from "@/components/Button";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Modal from "@/components/Modal";

const questionBox = "/assets/Question_Box.svg";
const answerBox = "/assets/Answer_Box.svg";

export default function QuestionScreen() {
  const router = useRouter()
  const params = useParams();
  const [question, setQuestion] = useState("");
  const [inputValue, setInputValue] = useState("");
  const id = params.id;
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');
  
  // testing skip - Skip functionality state
  const [canSkip, setCanSkip] = useState(true);
  const [skipCooldownSeconds, setSkipCooldownSeconds] = useState(0);
  const [skipLoading, setSkipLoading] = useState(false);

  // testing skip - Check skip status on component mount and set up timer
  useEffect(() => {
    const checkSkipStatus = async () => {
      try {
        const response = await axios.get("/api/round/skip-question");
        setCanSkip(response.data.canSkip);
        if (!response.data.canSkip && response.data.remainingSeconds) {
          setSkipCooldownSeconds(response.data.remainingSeconds);
        }
      } catch (error) {
        console.error("Error checking skip status:", error);
        setCanSkip(true); // Default to allowing skip if check fails
      }
    };
    
    checkSkipStatus();
  }, []);

  // testing skip - Countdown timer for skip cooldown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (skipCooldownSeconds > 0) {
      interval = setInterval(() => {
        setSkipCooldownSeconds((prev) => {
          if (prev <= 1) {
            setCanSkip(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [skipCooldownSeconds]);

  useEffect(() => {
    const getQuestionById = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/round-one/get-question-by-id", {
          params: { id },
        });

        setQuestion(response.data.data.question_description);
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getQuestionById();
  }, [id]);

  const handleSubmit = useCallback(async () => {
    if (!inputValue.trim()) return;

    try {
      setLoading(true);
      const response = await axios.post("/api/round-one/validate-answer", {
        questionId: id,
        userAnswer: inputValue,
      });
      if (response.status === 200) {
        if (response.data.message === "correct") {
          setMessage("Correct Answer!");
          setShowPopup(true);
          setTimeout(() => {
            router.push("/submission-history");
          }, 1000);
        } else {
          setMessage(response.data.message);
          setShowPopup(true);
        }
      }
      setInputValue("");
    } catch (error: any) {
      console.error(error);
      setMessage(error.response.data.error);
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  }, [id, inputValue, router]);

  // testing skip - Updated skip handler with API call and cooldown
  const handleSkip = async () => {
    if (!canSkip || skipLoading) return;

    try {
      setSkipLoading(true);
      const response = await axios.post("/api/round/skip-question");
      
      if (response.status === 200) {
        setMessage("Question skipped! You can skip again in 5 minutes.");
        setShowPopup(true);
        setCanSkip(false);
        setSkipCooldownSeconds(300); // 5 minutes = 300 seconds
        
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Skip error:", error);
      if (error.response?.status === 429) {
        setMessage(`Skip cooldown active. Try again in ${error.response.data.remainingMinutes} minutes.`);
        setCanSkip(false);
        setSkipCooldownSeconds(Math.ceil(error.response.data.remainingTime / 1000));
      } else {
        setMessage(error.response?.data?.error || "Failed to skip question");
      }
      setShowPopup(true);
    } finally {
      setSkipLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start text-white px-4 sm:px-8 overflow-hidden gap-4">
      <div className="relative w-full max-w-2xl">
        <img src={questionBox} alt="Question Box" className="w-full" />
        <span className="absolute inset-0 flex items-center justify-center px-6 text-center text-lg sm:text-xl font-bold">
          {question}
        </span>
      </div>

      <div className="relative w-full max-w-lg h-44 sm:h-52">
        <img
          src={answerBox}
          alt="Answer Box"
          className="w-full h-full object-contain"
        />
        <input
          type="text"
          value={inputValue}
          placeholder="Answer"
          onChange={(e) => setInputValue(e.target.value)}
          className="absolute inset-0 bg-transparent text-center text-xl sm:text-2xl text-white font-semibold focus:outline-none px-6"
        />
      </div>

      <div className="flex flex-col items-center w-full max-w-[16rem] sm:max-w-[18rem]">
        {/* testing skip - Enhanced skip button with timer and disabled state */}
        <Button
          label={
            canSkip && !skipLoading
              ? "Skip"
              : skipLoading
              ? "Skipping..."
              : `Skip (${Math.floor(skipCooldownSeconds / 60)}:${(skipCooldownSeconds % 60).toString().padStart(2, '0')})`
          }
          onClick={canSkip && !skipLoading ? handleSkip : () => {}}
          className={`!w-full !text-3xl sm:!text-4xl !font-extrabold ${
            !canSkip || skipLoading
              ? "!bg-gray-600 !text-gray-400 cursor-not-allowed opacity-60"
              : "!bg-red-600 hover:!bg-red-700"
          }`}
        />
        <Button
          label="Submit"
          onClick={handleSubmit}
          className="!w-full !text-3xl sm:!text-4xl !font-extrabold"
        />
      </div>

      <Modal
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        backgroundSvg={questionBox}
      >
        <div className="text-center space-y-6 px-4">
          <div className="font-bold text-2xl leading-tight tracking-wide" style={{ color: "#B9B9B9" }}>
            {message}
          </div>
        </div>
      </Modal>
    </div>
  );
}

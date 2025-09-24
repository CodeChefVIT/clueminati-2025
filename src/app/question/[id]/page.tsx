"use client";

import Button from "@/components/Button";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Modal from "@/components/Modal";

const questionBox = "/assets/Question_Box.svg";
const answerBox = "/assets/Answer_Box.svg";

export default function QuestionScreen() {
  const router = useRouter();
  const params = useParams();
  const [question, setQuestion] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [difficultyInfo, setDifficultyInfo] = useState<{ text: string, className: string } | null>(null);
  const id = params.id;
  const [loading, setLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [revealedChar, setRevealedChar] = useState("");
  const [nextStationName, setNextStationName] = useState("");
  const [skipDisabled, setSkipDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const getQuestionById = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/round/get-question-by-id", {
          params: { id },
        });
        
        const { difficulty } = response.data.data;
        const { round } = response.data;
        
        // Calculate points based on round and difficulty
        let points: number;
        if (round === "1") {
          points = difficulty === "easy" ? 20 : difficulty === "medium" ? 40 : 70;
        } else if (round === "2") {
          points = difficulty === "easy" ? 25 : 60; // medium and hard both get 60
        } else {
          points = 0;
        }
        
        const difficultyLabel = difficulty === "easy" ? "E" : difficulty === "medium" ? "M" : "H";
        
        setQuestion(
          response.data.data.question_description + " " + `${difficultyLabel} ${points}`
        );
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getQuestionById();
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          setSkipDisabled(false);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!inputValue.trim()) return;

    try {
      setLoading(true);
      const response = await axios.post("/api/round/validate-answer", {
        questionId: id,
        userAnswer: inputValue,
      });

      if (response.status === 200) {
        if (response.data.message === "correct") {
          const round = localStorage.getItem("round");
          if (round) {
            localStorage.setItem(`answered_${round}`, "true");
          }

          // Set success popup data
          setRevealedChar(response.data.reveal || "");
          setNextStationName(response.data.nextStation?.station_name || "");
          setShowSuccessPopup(true);

          // Auto-redirect after 12 seconds (un-skippable)
          setTimeout(() => {
            router.push("/submission-history");
          }, 12000);
        } else {
          // Set error popup
          setMessage(response.data.message);
          setShowErrorPopup(true);

          // Auto-hide error popup after 2 seconds
          setTimeout(() => {
            setShowErrorPopup(false);
          }, 2000);
        }
      }

      setInputValue("");
    } catch (error: any) {
      console.error(error);
      setMessage(error.response?.data?.error || "Something went wrong");
      setShowErrorPopup(true);

      // Auto-hide error popup after 2 seconds
      setTimeout(() => {
        setShowErrorPopup(false);
      }, 2000);
    } finally {
      setLoading(false);
    }
  }, [id, inputValue, router]);

  const handleSkip = () => {
    setMessage("Answer skipped!");
    setShowErrorPopup(true);
    setTimeout(() => {
      setShowErrorPopup(false);
      router.push("/");
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-start text-white px-4 sm:px-8 overflow-hidden gap-6">
      {/* Question Box */}
      <div className="relative w-full max-w-2xl mt-2">
        <img src={questionBox} alt="Question Box" className="w-full" />
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-base sm:text-lg font-bold leading-tight">
          <p>{question}
          {difficultyInfo && (
            <span className={`ml-2 ${difficultyInfo.className}`}>{`(${difficultyInfo.text})`}</span>
          )}
          </p>
        </div>
      </div>

      {/* Answer Box */}
      <div className="relative w-[20rem]  -mt-2">
        <img
          src={answerBox}
          alt="Answer Box"
          className="w-full h-full object-contain"
        />
        <input
          type="text"
          value={inputValue}
          placeholder="Enter your answer"
          onChange={(e) => setInputValue(e.target.value)}
          className="absolute inset-0 bg-transparent text-center text-lg sm:text-xl text-white font-semibold  placeholder-gray-400 focus:outline-none px-4"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row  w-full max-w-[16rem] sm:max-w-xl">
        <Button
          label={loading ? "Submitting..." : "Submit"}
          onClick={handleSubmit}
          disabled={loading}
          className=" !text-lg sm:!text-xl !font-bold py-2 sm:py-3 "
        />
        <Button
          label={skipDisabled ? `Skip (${countdown}s)` : "Skip"}
          onClick={handleSkip}
          disabled={skipDisabled}
          className="flex-1 !text-lg sm:!text-xl !font-bold py-2 sm:py-3 "
        />
      </div>

      {/* Success Popup - Un-skippable */}
      <Modal
        isOpen={showSuccessPopup}
        onClose={() => {}} // Empty function - makes it un-skippable
        backgroundSvg={questionBox}
        showCloseButton={false}
      >
        <div className="text-center space-y-6 px-4">
          <div className="font-bold text-2xl text-green-400">
            Correct Answer!
          </div>
          {revealedChar && (
            <div className="font-bold text-xl">
              Secret Char: <span className="text-3xl text-yellow-400 animate-pulse filter drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]">{revealedChar}</span>
            </div>
          )}
          {nextStationName && (
            <div className="font-bold text-lg text-blue-400">
              Next Station: <span className="text-white">{nextStationName}</span>
            </div>
          )}
        </div>
      </Modal>

      {/* Error Popup - Auto-dismiss */}
      <Modal
        isOpen={showErrorPopup}
        onClose={() => setShowErrorPopup(false)}
        backgroundSvg={questionBox}
      >
        <div className="text-center space-y-6 px-4">
          <div className="font-bold text-xl text-red-400">
             {message}
          </div>
        </div>
      </Modal>
    </div>
  );
}

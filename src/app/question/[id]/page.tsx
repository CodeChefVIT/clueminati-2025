"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

import Button from "@/components/Button";
import Modal from "@/components/Modal";

const questionBox = "/assets/Question_Box.svg";
const answerBox = "/assets/Answer_Box.svg";

export default function QuestionScreen() {
  const router = useRouter();
  const { id } = useParams();
  
  const [question, setQuestion] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [loadingQuestion, setLoadingQuestion] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  
  const [skipDisabled, setSkipDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);

  //5 mins ka skip
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);

  useEffect(() => {
    const getQuestionById = async () => {
      try {
        setLoadingQuestion(true);
        const res = await axios.get("/api/round/get-question-by-id", {
          params: { id },
        });
        setQuestion(
          res.data.data.question_description +
            " " +
            (res.data.data.difficulty === "hard"
              ? "H 70"
              : res.data.data.difficulty === "easy"
              ? "E 10"
              : "M 40")
        );
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoadingQuestion(false);
      }
    };
    if (id) getQuestionById();
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
      setSubmitting(true);
      const res = await axios.post("/api/round/validate-answer", {
        questionId: id,
        userAnswer: inputValue,
      });

      if (res.status === 200) {
        if (res.data.message === "correct") {
          const round = localStorage.getItem("round");
          if (round) {
            localStorage.setItem(`answered_${round}`, "true");
          }

          setMessage("Correct Answer!");
          setShowPopup(true);

          setTimeout(() => {
            router.push("/submission-history");
          }, 1000);
        } else {
          setMessage(res.data.message);
          setShowPopup(true);
        }
      }

      setInputValue("");
    } catch (error: any) {
      console.error(error);
      setMessage(error.response?.data?.error || "Something went wrong");
      setShowPopup(true);
    } finally {
      setSubmitting(false);
    }
  }, [id, inputValue, router]);

  const handleSkip = () => {
    setMessage("answer skipped!!");
    setShowPopup(true);
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-start text-white px-4 sm:px-8 overflow-hidden gap-4">
      <div className="relative w-full max-w-2xl">
        <img 
          src={questionBox} 
          alt="Question Box" 
          className="w-full" 
          width={800} 
          height={200}
          style={{ width: "auto", height: "auto" }}
        />
        <span className="absolute inset-0 flex items-center justify-center px-6 text-center text-lg sm:text-xl font-bold">
          {loadingQuestion ? "Loading question…" : question}
        </span>
      </div>

      <div className="relative w-full max-w-lg h-44 sm:h-52">
        <img 
          src={answerBox} 
          alt="Answer Box" 
          className="w-full h-full object-contain" 
          width={600} 
          height={200}
          style={{ width: "auto", height: "auto" }}  {/*console error aa rha tha*/}
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
        <Button
          label={submitting ? "Submitting..." : "Submit"}
          onClick={handleSubmit}
          disabled={submitting || loadingQuestion}
          className="!w-full !text-3xl sm:!text-4xl !font-extrabold"
        />
        <Button
          label={skipDisabled ? `Skip (${countdown}s)` : "Skip"}
          onClick={handleSkip}
          disabled={skipDisabled}
          className="!w-full !text-3xl sm:!text-4xl !font-extrabold"
        />
      </div>

      <Modal
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        backgroundSvg={questionBox}
      >
        <div className="text-center space-y-6 px-4">
          <div
            className="font-bold text-2xl leading-tight tracking-wide"
            style={{ color: "#B9B9B9" }}
          >
            {message}
          </div>
        </div>
      </Modal>
    </div>
  );
}

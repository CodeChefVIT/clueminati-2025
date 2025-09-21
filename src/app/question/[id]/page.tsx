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
  const { id } = useParams<{ id: string }>();

  // ── State ───────────────────────────────────────────────
  const [question, setQuestion] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [loadingQuestion, setLoadingQuestion] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  // skip button initial delay
  const [skipDisabled, setSkipDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);

  // 5-minute block after skip
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);

  // ── Fetch question ──────────────────────────────────────
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

  // ── Check if user already blocked ───────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("skipBlockUntil");
    if (stored && Number(stored) > Date.now()) {
      setBlockedUntil(Number(stored));
    }
  }, []);

  // ── Countdown for initial Skip enable ───────────────────
  useEffect(() => {
    if (!skipDisabled || blockedUntil) return;
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          setSkipDisabled(false);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [skipDisabled, blockedUntil]);

  // ── Submit answer ───────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    // block check
    if (blockedUntil && Date.now() < blockedUntil) {
      setMessage("You skipped a question. Please wait 5 minutes before continuing.");
      setShowPopup(true);
      return;
    }

    if (!inputValue.trim() || submitting) return;

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
  }, [blockedUntil, id, inputValue, router, submitting]);

  //skip 
  const handleSkip = useCallback(() => {
    //5-min ka block dala hai, change it if you want
    const until = Date.now() + 5 * 60 * 1000;
    localStorage.setItem("skipBlockUntil", String(until));
    setBlockedUntil(until);
    setMessage("You skipped this question. You cannot proceed for 5 minutes.");
    setShowPopup(true);
  }, []);

  //render
  const isBlocked = !!(blockedUntil && Date.now() < blockedUntil);
  const skipLabel = isBlocked
    ? "Blocked (5 min)"
    : skipDisabled
    ? `Skip (${countdown}s)`
    : "Skip";

  return (
    <div className="flex flex-col items-center justify-start text-white px-4 sm:px-8 overflow-hidden gap-4">
      <div className="relative w-full max-w-2xl">
        <img src={questionBox} alt="Question Box" className="w-full" />
        <span className="absolute inset-0 flex items-center justify-center px-6 text-center text-lg sm:text-xl font-bold">
          {loadingQuestion ? "Loading question…" : question}
        </span>
      </div>

      <div className="relative w-full max-w-lg h-44 sm:h-52">
        <img src={answerBox} alt="Answer Box" className="w-full h-full object-contain" />
        <input
          type="text"
          value={inputValue}
          placeholder="Answer"
          onChange={(e) => setInputValue(e.target.value)}
          disabled={submitting || isBlocked}
          className="absolute inset-0 bg-transparent text-center text-xl sm:text-2xl text-white font-semibold focus:outline-none px-6"
        />
      </div>

      <div className="flex flex-col items-center w-full max-w-[16rem] sm:max-w-[18rem] space-y-2">
        <Button
          label={submitting ? "Submitting..." : "Submit"}
          onClick={handleSubmit}
          disabled={submitting || loadingQuestion || isBlocked}
          className="!w-full !text-3xl sm:!text-4xl !font-extrabold"
        />
        <Button
          label={skipLabel}
          onClick={handleSkip}
          disabled={skipDisabled || isBlocked}
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

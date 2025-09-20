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
  const id = params.id;
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [skipDisabled, setSkipDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const getQuestionById = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/round-one/get-question-by-id", {
          params: { id },
        });
        setQuestion(
          response.data.data.question_description + " " +
          (response.data.data.difficulty === 'hard'
            ? 'H 70'
            : response.data.data.difficulty === 'easy'
              ? 'E 10'
              : 'M 40')
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
          label="Skip"
          onClick={handleSkip}
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

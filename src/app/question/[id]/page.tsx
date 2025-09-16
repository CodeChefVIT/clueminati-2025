"use client";

import Button from "@/components/Button";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import GamePopup from "@/components/gamePopup";

const questionBox = "/assets/Question_Box.svg";
const answerBox = "/assets/Answer_Box.svg";

export default function QuestionScreen() {
  const params = useParams();
  const [question, setQuestion] = useState("");
  const [inputValue, setInputValue] = useState("");
  const id = params.id;
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // <-- popup state
  const [message, setMessage] = useState('');

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
        // setMessage(error.response.data.error);
        // setShowPopup(true);
      } finally {
        setLoading(false);
      }
    };
    getQuestionById();
  }, [id]);

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    try {
      setLoading(true);
      const response = await axios.post("/api/round-one/validate-answer", {
        questionId: id,
        userAnswer: inputValue,
      });
      if (response.status == 200 && response.data.message != "correct") {
        setMessage(response.data.message);
        setShowPopup(true);
      }
      setInputValue("");
    } catch (error: any) {
      console.error(error);
      setMessage(error.response.data.error);
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100%] flex flex-col items-center justify-start text-white px-4 sm:px-8 overflow-hidden gap-4">
      {/* Question Box */}
      <div className="relative w-full max-w-2xl">
        <img src={questionBox} alt="Question Box" className="w-full" />
        <span className="absolute inset-0 flex items-center justify-center px-6 text-center text-lg sm:text-xl font-bold">
          {question}
        </span>
      </div>

      {/* Answer Box */}
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

      {/* Buttons Column */}
      <div className="flex flex-col items-center w-full max-w-[16rem] sm:max-w-[18rem]">
        <Button
          label="Skip"
          onClick={() => { }}
          className="!w-full !text-3xl sm:!text-4xl !font-extrabold"
        />
        <Button
          label="Submit"
          onClick={handleSubmit}
          className="!w-full !text-3xl sm:!text-4xl !font-extrabold"
        />
      </div>

      {/* Wrong Answer Popup */}
      <GamePopup isOpen={showPopup} onClose={() => setShowPopup(false)} message={message} />
    </div>
  );
}

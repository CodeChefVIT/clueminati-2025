"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Modal from "@/components/Modal";

const questionBox = "/assets/Question_Box.svg";

export default function CreateQuestionPage() {
  const [question, setQuestion] = useState({
    question_description: "",
    answer: "",
    difficulty: "",
    round: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({
    title: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post("/api/admin/create-question", question);
      setModalMessage({
        title: "Success",
        description: "Question created successfully!",
      });
      setShowModal(true);
    } catch (error: unknown) {
      console.error("Failed to create question", error);
      let description = "An unknown error occurred.";
      if (error instanceof AxiosError) {
        description = error.response?.data?.error || description;
      }
      setModalMessage({ title: "Error", description });
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen items-center">
      <div className="container mx-auto p-4 sm:p-8 text-white">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">
          Create Question
        </h1>
        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-gray-900/50 p-6 rounded-lg shadow-lg space-y-6 border border-gray-700"
        >
          <div className="space-y-2">
            <Label htmlFor="question_description" className="text-lg">
              Question Description
            </Label>
            <Input
              id="question_description"
              name="question_description"
              type="text"
              value={question.question_description}
              onChange={handleChange}
              required
              className="bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer" className="text-lg">
              Answer
            </Label>
            <Input
              id="answer"
              name="answer"
              type="text"
              value={question.answer}
              onChange={handleChange}
              required
              className="bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty" className="text-lg">
              Difficulty
            </Label>
            <select
              id="difficulty"
              name="difficulty"
              value={question.difficulty}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-gray-700 border border-gray-600 text-white p-2 focus:ring-blue-500"
            >
              <option value="">Select difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="round" className="text-lg">
              Round
            </Label>
            <select
              id="round"
              name="round"
              value={question.round}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-gray-700 border border-gray-600 text-white p-2 focus:ring-blue-500"
            >
              <option value="">Select round</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full !text-xl !py-6 !bg-blue-600 hover:!bg-blue-700 transition-colors"
          >
            {isSubmitting ? "Creating..." : "Create Question"}
          </Button>
        </form>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          backgroundSvg={questionBox}
        >
          <div className="text-center space-y-4 px-4">
            <h2
              className={`text-2xl font-bold ${modalMessage.title === "Error"
                ? "text-red-500"
                : "text-green-500"
                }`}
            >
              {modalMessage.title}
            </h2>
            <p className="text-gray-300 text-base">
              {modalMessage.description}
            </p>
          </div>
        </Modal>
      </div>
    </div>
  );
}

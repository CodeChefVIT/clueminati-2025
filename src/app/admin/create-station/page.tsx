"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Modal from "@/components/Modal";

const questionBox = "/assets/Question_Box.svg";

export default function CreateStationPage() {
  const [station, setStation] = useState<{ station_name: string, difficulty: string }>({
    station_name: "",
    difficulty: "",
  });
  const [membersInput, setMembersInput] = useState('');
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
    setStation((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const membersArray = membersInput
        .split(",")
        .map((m) => m.trim())
        .filter((m) => m !== "");
      console.log(membersArray);
      await axios.post("/api/admin/create-station", {
        "station_name": station.station_name,
        "difficulty": station.difficulty,
        "members": membersArray
      });
      setModalMessage({
        title: "Success",
        description: "Station created successfully!",
      });
      setShowModal(true);
    } catch (error: unknown) {
      console.error("Failed to create station", error);
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
          Create Station
        </h1>
        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-gray-900/50 p-6 rounded-lg shadow-lg space-y-6 border border-gray-700"
        >
          <div className="space-y-2">
            <Label htmlFor="station_name" className="text-lg">
              Station Name
            </Label>
            <Input
              id="station_name"
              name="station_name"
              type="text"
              value={station.station_name}
              onChange={handleChange}
              required
              className="bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="members" className="text-lg">
              Members (comma-separated)
            </Label>
            <Input
              id="members"
              name="members"
              type="text"
              value={membersInput}
              onChange={(e) => setMembersInput(e.target.value)}
              placeholder="Enter member names separated by commas"
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
              value={station.difficulty}
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

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full !text-xl !py-6 !bg-blue-600 hover:!bg-blue-700 transition-colors"
          >
            {isSubmitting ? "Creating..." : "Create Station"}
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

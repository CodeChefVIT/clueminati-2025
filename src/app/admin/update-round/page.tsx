"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Modal from "@/components/Modal";

const questionBox = "/assets/Question_Box.svg";

// Helper to format date for datetime-local input, respecting local timezone
const formatDateForInput = (date: Date | string | null): string => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const pad = (num: number) => num.toString().padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function UpdateRoundPage() {
  const [roundTimes, setRoundTimes] = useState({
    r1StartTime: "",
    r1EndTime: "",
    r2StartTime: "",
    r2EndTime: "",
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    const fetchGameStats = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/get-game-stat");
        if (data) {
          setRoundTimes({
            r1StartTime: formatDateForInput(data.r1StartTime),
            r1EndTime: formatDateForInput(data.r1EndTime),
            r2StartTime: formatDateForInput(data.r2StartTime),
            r2EndTime: formatDateForInput(data.r2EndTime),
          });
        }
      } catch (error) {
        console.error("Failed to fetch game stats", error);
        setModalMessage({
          title: "Error",
          description: "Failed to load current round times.",
        });
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    };

    fetchGameStats();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRoundTimes((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        r1StartTime: new Date(roundTimes.r1StartTime),
        r1EndTime: new Date(roundTimes.r1EndTime),
        r2StartTime: new Date(roundTimes.r2StartTime),
        r2EndTime: new Date(roundTimes.r2EndTime),
      };
      await axios.post("/api/admin/update-round", payload);
      setModalMessage({
        title: "Success",
        description: "Round times updated successfully!",
      });
      setShowModal(true);
    } catch (error: any) {
      console.error("Failed to update game stats", error);
      const description =
        error.response?.data?.error || "An unknown error occurred.";
      setModalMessage({ title: "Error", description });
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-white text-center p-8 text-xl">
        Loading game settings...
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center"> 
      <div className="container mx-auto p-4 sm:p-8 text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Update Round Times
        </h1>
        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-gray-900/50 p-6 rounded-lg shadow-lg space-y-6 border border-gray-700"
        >
          {Object.entries(roundTimes).map(([key, value]) => (
            <div className="space-y-2" key={key}>
              <Label htmlFor={key} className="text-lg capitalize">
                {key.replace(/([A-Z])/g, " $1").replace("r", "Round ")}
              </Label>
              <Input
                id={key}
                name={key}
                type="datetime-local"
                value={value}
                onChange={handleChange}
                required
                className="bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
              />
            </div>
          ))}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full !text-xl !py-6 !bg-blue-600 hover:!bg-blue-700 transition-colors"
          >
            {isSubmitting ? "Updating..." : "Update Times"}
          </Button>
        </form>
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          backgroundSvg={questionBox}
        >
          <div className="text-center space-y-4 px-4">
            <h2
              className={`text-2xl font-bold ${
                modalMessage.title === "Error"
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

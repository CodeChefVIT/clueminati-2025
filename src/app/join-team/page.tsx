"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import axios, { isAxiosError } from "axios";
import toast from "react-hot-toast";
import localFont from "next/font/local";
import Link from "next/link";
import Modal from "@/components/Modal";

const questionBox = "/assets/Question_Box.svg";

const rethinkSansBold = localFont({
  src: "../../../public/assets/RethinkSans-Bold.ttf",
  variable: "--font-rethinkSansBold",
});
const rethinkSansMedium = localFont({
  src: "../../../public/assets/RethinkSans-Medium.ttf",
  variable: "--font-rethinkSansMedium",
});
export default function JoinTeam() {
  const router = useRouter();
  const [teamCode, setTeamCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/users/join-team', { joinCode: teamCode });
      if (response.data.message) {
        toast.success(response.data.message);
        router.push(`/role-selection?teamId=${response.data.team._id}`);
      }
    } catch (error) {
      console.error("Error joining team:", error);
      let message = "Failed to join team. Please try again.";
      if (isAxiosError(error) && error.response) {
        message = error.response.data.error || message;
      }
      setErrorMessage(message);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden w-full`}>
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: "url('/assets/login-bg.png')",
        }}
      />  

      <div className="relative z-10 min-h-screen flex items-center justify-center p-9">
        <div className="w-full max-w-sm mx-auto mb-25">
          <h1
            className="text-4xl font-bold text-white text-center mb-15"
            style={{ fontFamily: "var(--font-rethinkSansBold)" }}
          >
            Join A Team
          </h1>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="space-y-1 text-center">
              <Label
                htmlFor="teamCode"
                className="text-white font-medium text-lg ml-5"
              >
                Enter Team Code
              </Label>
              <Input
                id="teamCode"
                type="text"
                value={teamCode}
                onChange={(e) => setTeamCode(e.target.value)}
                className="h-[50px] w-[91%] bg-[#D3D5D7] border border-black/20 rounded-lg text-black flex justify-center mx-auto"
                required
              />
            </div>

            <div className="text-right">
              <span className="text-white font-medium text-base mr-1">
                Don't have a team?
              </span>
              <Link href="/create-team" className="text-[#00E4B6] text-base mr-7">
                Create
              </Link>
            </div>

            <div className="flex justify-center mt-30">
              <Button
                type="submit"
                className="w-43 h-11 bg-no-repeat bg-center rounded-xl bg-cover flex items-center justify-center"
                style={{
                  backgroundImage: "url('/assets/proceedbuttonlogin.svg')",
                }}
                disabled={loading}>
                  
              </Button>
            </div>
          </form>
        </div>
      </div>
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
    </div>
  );
}

"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import localFont from "next/font/local";
import axios, { isAxiosError } from "axios";
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

export default function CreateTeam() {
  const router = useRouter();
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [createdTeam, setCreatedTeam] = useState<{
    name: string;
    joinCode: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim()) {
      setErrorMessage("Team name cannot be empty.");
      setShowErrorModal(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/users/create-team", {
        teamname: teamName,
      });

      setCreatedTeam({
        name: response.data.team.teamname,
        joinCode: response.data.team.joinCode,
      });
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Error creating team:", err);
      let message = "Failed to create team. Please try again.";
      if (isAxiosError(err) && err.response) {
        // A 500 error is often due to a unique constraint violation (duplicate team name)
        if (err.response.status === 500) {
          message = "Error, try changing the name of your team.";
        } else {
          message = err.response.data.error || message;
        }
      }
      setErrorMessage(message);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    router.push("/role-selection");
  };

  return (
    <>
      <div
        className={`min-h-screen relative overflow-hidden w-full ${rethinkSansBold.variable} ${rethinkSansMedium.variable}`}
      >
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
              Create A Team
            </h1>

            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="space-y-1 text-center">
                <Label
                  htmlFor="teamName"
                  className="text-white font-medium text-lg ml-5"
                >
                  Enter Team Name
                </Label>
                <Input
                  id="teamName"
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="h-[50px] w-[91%] bg-[#D3D5D7] border border-black/20 rounded-lg text-black flex justify-center mx-auto"
                  required
                />
              </div>

              <div className="text-right">
                <span className="text-white font-medium text-base mr-1.5">
                  Have a team?
                </span>
                <button
                  type="button"
                  className="text-[#24CCFF] text-base mr-8"
                  onClick={() => router.push("/join-team")}
                >
                  Join
                </button>
              </div>

              <div className="flex justify-center mt-30">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-43 h-11 bg-no-repeat bg-center rounded-xl bg-cover"
                  style={{
                    backgroundImage: "url('/assets/proceedbuttonlogin.svg')",
                  }}
                  aria-label="Proceed"
                >
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {createdTeam && (
        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          showCloseButton={false}
          backgroundSvg="/assets/Question_Box.svg"
        >
          <div className="text-center space-y-6 px-4 text-white">
            <h2 className="text-2xl font-bold mb-4">Team Created!</h2>
            <p className="text-lg">Join Code: {createdTeam.joinCode}</p>
            <button
              onClick={handleProceed}
              className="w-43 h-11 bg-no-repeat bg-center rounded-xl bg-cover"
              style={{
                backgroundImage: "url('/assets/proceedbuttonlogin.svg')",
              }}
              aria-label="Proceed"
            />
          </div>
        </Modal>
      )}
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
    </>
  );
}

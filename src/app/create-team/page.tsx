"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import localFont from "next/font/local";
import toast from "react-hot-toast";
import axios from "axios";
import Popup from "@/components/Popup";

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
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [createdTeam, setCreatedTeam] = useState<{
    name: string;
    joinCode: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim()) {
      toast.error("Team name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "/api/users/create-team",
        { teamname: teamName },
      );

      setCreatedTeam({
        name: res.data.team?.teamname || teamName,
        joinCode: res.data.team?.joinCode || "TEAM123", 
      });
      setShowModal(true);
    } catch (err: any) {
      console.error("Error creating team:", err);
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    setShowModal(false);
    // Redirect to role selection after team creation
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
            backgroundImage: "url('/assets/loginbg.png')",
            filter: "brightness(0.55)",
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

              {error && (
                <p className="text-red-500 text-center text-sm">{error}</p>
              )}

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
                  className="w-43 h-11 bg-no-repeat bg-center rounded-xl bg-cover flex items-center justify-center"
                  style={{
                    backgroundImage: "url('/assets/proceedbuttonlogin.svg')",
                  }}
                >
                  {loading ? "Creating..." : ""}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>


      {createdTeam && (
        <Popup
          isOpen={showModal}
          teamName={createdTeam.name}
          joinCode={createdTeam.joinCode}
          onProceed={handleProceed}
        />
      )}
    </>
  );
}
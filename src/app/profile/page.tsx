"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import Button from "../../components/Button";
import axios, { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";

const questionBox = "/assets/Question_Box.svg";

interface User {
  fullname: string;
  email: string;
  role: "admin" | "core_member" | "participant";
  region?: "hell" | "earth";
  teamId?: string;
}

interface Team {
  teamname: string;
  joinCode: string;
  teamId: string;
  total_score: number;
}

export default function ProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axios.get("/api/users/profile");
        setUser(response.data.data.user);
        setTeam(response.data.data.team);
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (isAxiosError(error) && error.response?.status === 401) {
          router.push("/login");
          return;
        }

        let message = "Failed to fetch profile data.";
        if (isAxiosError(error) && error.response) {
          message = error.response.data.error || message;
        }
        setErrorMessage(message);
        setShowErrorModal(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  async function logout() {
    try {
      const response = await axios.get("/api/users/logout");
      console.log(response.data);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      let message = "Logout failed. Please try again.";
      if (isAxiosError(error) && error.response) {
        message = error.response.data.error || message;
      }
      setErrorMessage(message);
      setShowErrorModal(true);
    }
  }

  async function leaveTeam() {
    setLeaving(true);
    try {
      const res = await axios.post("/api/users/leave-team");
      console.log("Leave team response:", res.data);

      router.push("/join-team");
    } catch (error) {
      console.error("Error leaving team:", error);
      let message = "Failed to leave team. Please try again.";
      if (isAxiosError(error) && error.response) {
        message = error.response.data.error || message;
      }
      setErrorMessage(message);
      setShowErrorModal(true);
    } finally {
      setLeaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-7rem)] text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-7rem)] text-red-400">
        Failed to load profile
      </div>
    );
  }

  const profilePic = "/assets/profile-pic.svg";
  const teamCode = team?.joinCode || "N/A";
  const teamName = team?.teamname || "No Team";
  const teamIdForQR = team?.teamId || "No-Team";

  return (
    <div className="w-full flex flex-col items-center justify-start text-white min-h-[calc(100vh-7rem)] p-4 sm:p-8 pt-4">
      <div className="flex flex-col items-center ">
        <div className="relative w-36 h-36 sm:w-48 sm:h-48 mb-4">
          <img
            src={profilePic}
            alt="Profile"
            className="w-full h-full rounded-full object-cover relative z-10"
          />
          <div className="absolute inset-0 rounded-full bg-black/40 z-0 blur-[12px]"></div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            {user.fullname}
          </h1>
          <p className="text-base sm:text-lg text-gray-300">{user.email}</p>
        </div>

        <div className="text-white text-xl sm:text-2xl max-w-xs w-full mb-8 space-y-6">
          <div className="flex justify-between">
            <span>Team:</span>
            <span>{" " + teamName}</span>
          </div>
          <div className="flex justify-between">
            <span>Team Code:</span>
            <span>{teamCode}</span>
          </div>
          <div className="flex justify-between">
            <span>Region:</span>
            <span>{user.region || "N/A"}</span>
          </div>
        </div>

        <div className="flex flex-col space-y-1 items-center w-full max-w-xs">
          {team && (
            <Button label="Show Team QR" onClick={() => setShowQR(true)} />
          )}
          {team && (
            <Button
              label={leaving ? "Leaving..." : "Leave Team"}
              onClick={() => {
                if (!leaving) leaveTeam();
              }}
            />
          )}

          <Button label="Log Out" onClick={logout} />
        </div>
      </div>

      {showQR && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 px-4">
          <div className="relative w-full max-w-md bg-[#1a1a1a] rounded-2xl p-6 flex flex-col items-center shadow-lg border border-green-500/40">
            <h2 className="text-green-400 font-bold text-lg mb-4">
              Team QR Code
            </h2>
            <QRCode
              value={teamIdForQR}
              size={260}
              bgColor="#3b2f2f"
              fgColor="#22c55e"
            />

            <div className="mt-6">
              <Button
                label="Close"
                onClick={() => setShowQR(false)}
                className="w-40 sm:w-44 text-lg sm:text-xl "
              />
            </div>
          </div>
        </div>
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
    </div>
  );
}

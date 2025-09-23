"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import Button from "@/components/Button";
import axios from "axios";
import { useRouter } from "next/navigation";

interface User {
  fullname: string;
  email: string;
  role: "admin" | "core_member" | "participant";
  region?: "hell" | "earth";
  teamId?: string;
  core_allocated_station?: string;
}

interface Team {
  teamname: string;
  joinCode: string;
  teamId: string;
  total_score: number;
}

interface Station {
  id: string;
  name: string;
  difficulty: string;
}

export default function ProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // fetch profile (station info included)
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axios.get("/api/users/profile");
        const userData = response.data.data.user;
        const teamData = response.data.data.team;
        const stationData = response.data.data.station;
        
        setUser(userData);
        setTeam(teamData);
        setStation(stationData); // Station data is now included in profile response
      } catch (error: any) {
        console.error(
          "Error fetching profile:",
          error.response?.data || error.message
        );
        if (error.response?.status === 401) {
          router.push("/login");
        }
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
      localStorage.removeItem("round")
      router.push("/login");

    } catch (error: any) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  }

  async function leaveTeam() {
    setLeaving(true);
    try {
      const res = await axios.post("/api/users/leave-team");
      console.log("Leave team response:", res.data);

      router.push("/join-team");
    } catch (error: any) {
      console.error(
        "Error leaving team:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.error || "Failed to leave team");
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
    <div className="w-full flex flex-col items-center justify-start text-white p-4 sm:p-8 pt-10">
      <div className="flex flex-col items-center ">
        {/* Profile Picture */}
        <div className="relative w-36 h-36 sm:w-48 sm:h-48 mb-4">
          <img
            src={profilePic}
            alt="Profile"
            className="w-full h-full rounded-full object-cover relative z-10"
          />
          <div className="absolute inset-0 rounded-full bg-black/40 z-0 blur-[12px]"></div>
        </div>

        {/* Name and Email */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            {user.fullname}
          </h1>
          <p className="text-base sm:text-lg text-gray-300">{user.email}</p>
        </div>

        {/* User Info */}
        <div className="text-white text-xl sm:text-2xl max-w-xs w-full mb-8 space-y-6">
          {/* Role Display */}
          <div className="text-center">
            <p className="text-gray-300 text-lg">Role</p>
            <p className="text-green-400 font-semibold capitalize">{user.role.replace('_', ' ')}</p>
          </div>

          {/* Station Info for Core Members */}
          {user.role === "core_member" && (
            <div className="text-center">
              <p className="text-gray-300 text-lg">Allocated Station</p>
              {station ? (
                <div>
                  <p className="text-blue-400 font-semibold">{station.name}</p>
                  <p className="text-gray-400 text-sm">({station.difficulty})</p>
                </div>
              ) : user.core_allocated_station ? (
                <p className="text-yellow-400 font-semibold">Loading station...</p>
              ) : (
                <p className="text-red-400 font-semibold">Not assigned</p>
              )}
            </div>
          )}

          {/* Region for participants */}
          {user.role === "participant" && user.region && (
            <div className="text-center">
              <p className="text-gray-300 text-lg">Region</p>
              <p className="text-purple-400 font-semibold capitalize">{user.region}</p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col space-y-1 items-center w-full max-w-xs">
          {/* Core Member specific buttons */}
          {user.role === "core_member" && (
            <Button 
              label="Change Stat" 
              onClick={() => router.push("/core-member/choose-station")} 
            />
          )}

          {/* Team related buttons for participants */}
          {/* yeh kyun add kiya hai, leaving it as it is */}
          {team && user.role === "participant" && (
            <Button label="Show Team QR" onClick={() => setShowQR(true)} />
          )}
          {team && user.role === "participant" && (
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

      {/* QR Code Modal */}
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
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios, { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { pixelFont, rethinkSansBold, rethinkSansMedium } from "../fonts";
import Modal from "@/components/Modal";

const questionBox = "/assets/Question_Box.svg";
interface TeamMember {
  _id: string;
  fullname: string;
  region?: "hell" | "earth";
}

export default function RegionSelection() {
  const router = useRouter();
  const [selectedRegion, setSelectedRegion] = useState<"hell" | "earth" | null>(
    null
  );
  const [background, setBackground] = useState("/assets/login-bg.svg");
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(null);
  const [hellCount, setHellCount] = useState(0);
  const [earthCount, setEarthCount] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //fetch current user and team data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await axios.post("/api/users/profile");
        const userData = profileResponse.data.data.user;
        const teamData = profileResponse.data.data.team;

        setCurrentUser(userData);

        if (teamData?.teamId) {
          try {
            const membersResponse = await axios.get(
              `/api/teams/${teamData.teamId}/members`
            );
            if (membersResponse.data.success) {
              setTeamMembers(membersResponse.data.members);
              //count current hell and earth members
              const hellMembers = membersResponse.data.members.filter(
                (m: TeamMember) => m.region === "hell"
              );
              const earthMembers = membersResponse.data.members.filter(
                (m: TeamMember) => m.region === "earth"
              );
              setHellCount(hellMembers.length);
              setEarthCount(earthMembers.length);
            }
          } catch (membersError) {
            console.error("Error fetching team members:", membersError);
            let message = "Could not fetch team members. Region counts may be inaccurate.";
            if (isAxiosError(membersError) && membersError.response) {
              message = membersError.response.data.error || message;
            }
            setErrorMessage(message);
            setShowErrorModal(true);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        let message = "Failed to load user data. Please try again.";
        if (isAxiosError(error) && error.response) {
          message = error.response.data.error || message;
        }
        setErrorMessage(message);
        setShowErrorModal(true);
      }
    };
    fetchData();
  }, []);

  const handleRegionSelect = async (region: "hell" | "earth") => {
    if (!currentUser) {
      setErrorMessage("User data not loaded. Please refresh the page.");
      setShowErrorModal(true);
      return;
    }

    const currentUserHasHell = currentUser.region === "hell";
    const currentUserHasEarth = currentUser.region === "earth";
    const effectiveHellCount = currentUserHasHell ? hellCount - 1 : hellCount;
    const effectiveEarthCount = currentUserHasEarth
      ? earthCount - 1
      : earthCount;

    if (region === "hell" && effectiveHellCount >= 2) {
      setErrorMessage("Hell region is full! Maximum 2 members allowed.");
      setShowErrorModal(true);
      return;
    }

    if (region === "earth" && effectiveEarthCount >= 3) {
      setErrorMessage("Earth region is full! Maximum 3 members allowed.");
      setShowErrorModal(true);
      return;
    }

    if (region === "hell") {
      setBackground("/assets/hell-bg.svg");
    } else {
      setBackground("/assets/background.svg");
    }

    setSelectedRegion(region);
  };

  const handleConfirm = async () => {
    if (!selectedRegion) return;

    try {
      setLoading(true);
      console.log("Attempting to confirm region:", selectedRegion);

      const response = await axios.post("/api/region-selection", {
        region: selectedRegion,
      });

      console.log("API Response:", response.data);

      if (response.data.success || response.data.message) {
        setCurrentUser((prev) =>
          prev ? { ...prev, region: selectedRegion } : null
        );

        if (
          selectedRegion === "hell" &&
          currentUser &&
          currentUser.region !== "hell"
        ) {
          setHellCount((prev) => prev + 1);
        } else if (
          selectedRegion === "earth" &&
          currentUser &&
          currentUser.region !== "earth"
        ) {
          setEarthCount((prev) => prev + 1);
        }

        if (
          currentUser &&
          currentUser.region === "hell" &&
          selectedRegion !== "hell"
        ) {
          setHellCount((prev) => prev - 1);
        } else if (
          currentUser &&
          currentUser.region === "earth" &&
          selectedRegion !== "earth"
        ) {
          setEarthCount((prev) => prev - 1);
        }

        if (selectedRegion === "hell") {
          router.push("/hell-instructions");
        } else {
          router.push("/instructions");
        }
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Region confirmation error:", error);
      let message = "Failed to assign region. Please try again.";
      if (isAxiosError(error) && error.response) {
        message = error.response.data.error || message;
      }
      setErrorMessage(message);
      setShowErrorModal(true);
      setSelectedRegion(null);
    } finally {
      setLoading(false);
    }
  };

  const isHellDisabled = () => {
    if (!currentUser) return true;
    const currentUserHasHell = currentUser.region === "hell";
    const effectiveHellCount = currentUserHasHell ? hellCount - 1 : hellCount;
    return effectiveHellCount >= 2;
  };

  const isEarthDisabled = () => {
    if (!currentUser) return true;
    const currentUserHasEarth = currentUser.region === "earth";
    const effectiveEarthCount = currentUserHasEarth
      ? earthCount - 1
      : earthCount;
    return effectiveEarthCount >= 3;
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden w-full ${rethinkSansBold.variable} ${rethinkSansMedium.variable} ${pixelFont.variable} font-pixel`}
    >
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat flex items-center justify-center transition-all duration-500"
        style={{
          backgroundImage: `url('${background}')`,
        }}
      />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 font-pixel">
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-4">
            Region Selection
          </h1>
          <p className="text-white text-center font-rethink mb-10 text-lg">
            Choose your region to play in
          </p>

          <div className="grid grid-cols-1 gap-6 mb-8">
            {/* Hell Region */}
            <div className="flex flex-col items-center">
              <Button
                onClick={() => handleRegionSelect("hell")}
                disabled={loading || isHellDisabled()}
                className={`w-full h-24 bg-no-repeat bg-center bg-cover text-white font-bold text-xl rounded-xl shadow-lg transition-all duration-300 ${
                  selectedRegion === "hell" ? "brightness-100" : "brightness-50"
                } ${
                  isHellDisabled()
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105 hover:opacity-100"
                }`}
                style={{ backgroundImage: "url('/assets/round-box-hell.svg')" }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-xl">HELL</span>
                  <span className="text-xs mt-1">
                    ({hellCount}/2 slots filled)
                  </span>
                </div>
              </Button>
          
            </div>

            {/* Earth Region */}
            <div className="flex flex-col items-center">
              <Button
                onClick={() => handleRegionSelect("earth")}
                disabled={loading || isEarthDisabled()}
                className={`w-full h-24 bg-no-repeat bg-center bg-cover text-white font-bold text-xl rounded-xl shadow-lg transition-all duration-300 ${
                  selectedRegion === "earth"
                    ? "brightness-100"
                    : "brightness-50"
                } ${
                  isEarthDisabled()
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105 hover:opacity-100"
                }`}
                style={{ backgroundImage: "url('/assets/round-box.svg')" }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-xl">EARTH</span>
                  <span className="text-xs mt-1">
                    ({earthCount}/3 slots filled)
                  </span>
                </div>
              </Button>
            
            </div>
          </div>

          {selectedRegion && (
            <div className="flex flex-col items-center mb-8">
              <Button
                onClick={handleConfirm}
                disabled={loading}
                className="w-fit py-6 px-8  text-xl font-bold rounded-xl transition-all duration-300 bg-no-repeat bg-center bg-cover text-white shadow-lg hover:scale-105"
                style={{
                  backgroundImage: `url(${
                    selectedRegion === "hell"
                      ? "/assets/round-box-hell.svg"
                      : "/assets/round-box.svg"
                  })`,
                }}
              >
                {loading
                  ? "Entering..."
                  : `ENTER ${selectedRegion.toUpperCase()}`}
              </Button>
            </div>
          )}

          <p className="text-white text-center font-medium text-base">
            Choose wisely! Hell region: max 2 members, Earth region: max 3
            members per team.
          </p>
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

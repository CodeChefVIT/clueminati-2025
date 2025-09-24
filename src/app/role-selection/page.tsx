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
  const [background, setBackground] = useState("/assets/login-bg.png");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); 
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(null);
  const [hellCount, setHellCount] = useState(0);
  const [earthCount, setEarthCount] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = async () => {
    try {
      setFetching(true);
      const profileResponse = await axios.get("/api/users/profile");
      const userData = profileResponse.data.data.user;
      const teamData = profileResponse.data.data.team;

      setCurrentUser(userData);

      if (teamData?.teamId) {
        const membersResponse = await axios.get(
          `/api/teams/${teamData.teamId}/members`
        );
        if (membersResponse.data.success) {
          const members: TeamMember[] = membersResponse.data.members;
          setTeamMembers(members);

          const hellMembers = members.filter((m) => m.region === "hell");
          const earthMembers = members.filter((m) => m.region === "earth");

          setHellCount(hellMembers.length);
          setEarthCount(earthMembers.length);
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
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegionSelect = (region: "hell" | "earth") => {
    if (!currentUser) {
      setErrorMessage("User data not loaded. Please refresh the page.");
      setShowErrorModal(true);
      return;
    }
setBackground(region === "hell" ? "/assets/hell-bg.png" : "/assets/background.png");
    setSelectedRegion(region);
  };

  const handleConfirm = async () => {
    if (!selectedRegion) return;

    try {
      setLoading(true);

      const response = await axios.post("/api/users/region-selection", {
        region: selectedRegion,
      });

      if (response.data.success || response.data.message) {
        if (selectedRegion === "hell") {
          router.push("/hell-instructions");
        } else {
          router.push("/");
        }

        await fetchData();
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
    const effectiveHellCount =
      currentUser.region === "hell" ? hellCount - 1 : hellCount;
    return effectiveHellCount >= 2;
  };

  const isEarthDisabled = () => {
    if (!currentUser) return true;
    const effectiveEarthCount =
      currentUser.region === "earth" ? earthCount - 1 : earthCount;
    return effectiveEarthCount >= 3;
  };

  const RegionButton = ({
    region,
    count,
    max,
    disabled,
    selected,
    onClick,
  }: {
    region: "hell" | "earth";
    count: number;
    max: number;
    disabled: boolean;
    selected: boolean;
    onClick: () => void;
  }) => (
    <Button
      onClick={onClick}
      disabled={loading || disabled}
      className={`w-full h-24 bg-no-repeat bg-center bg-cover text-white font-bold text-xl rounded-xl shadow-lg transition-all duration-300 ${
        selected ? "brightness-100" : "brightness-50"
      } ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:scale-105 hover:opacity-100"
      }`}
      style={{
        backgroundImage: `url('${
          region === "hell"
            ? "/assets/round-box-hell.svg"
            : "/assets/round-box.svg"
        }')`,
      }}
    >
      <div className="flex flex-col items-center">
        <span className="text-xl">{region.toUpperCase()}</span>
        
      </div>
    </Button>
  );

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen relative overflow-hidden w-full ${rethinkSansBold.variable} ${rethinkSansMedium.variable} ${pixelFont.variable} font-pixel`}
    >
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat flex items-center justify-center transition-all duration-500"
        style={{ backgroundImage: `url('${background}')` }}
      />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 font-pixel">
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-white text-center mb-4 font-pixel">
            Region Selection
          </h1>
          <div className="grid grid-cols-1 gap-6 mb-8">
            <RegionButton
              region="hell"
              count={hellCount}
              max={2}
              disabled={isHellDisabled()}
              selected={selectedRegion === "hell"}
              onClick={() => handleRegionSelect("hell")}
            />
            <RegionButton
              region="earth"
              count={earthCount}
              max={3}
              disabled={isEarthDisabled()}
              selected={selectedRegion === "earth"}
              onClick={() => handleRegionSelect("earth")}
            />
          </div>

          {selectedRegion && (
            <div className="flex flex-col items-center mb-8">
              <Button
                onClick={handleConfirm}
                disabled={loading}
                className="w-fit py-6 px-8 text-xl font-bold rounded-xl transition-all duration-300 bg-no-repeat bg-center bg-cover text-white shadow-lg hover:scale-105"
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

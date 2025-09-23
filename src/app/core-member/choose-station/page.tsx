"use client";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Station {
  id: string;
  name: string;
  difficulty: string;
}

export default function ChooseStation() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await axios.get("/api/get-stations");
      setStations(response.data.stations);
      setLoading(false);
    } catch (err: any) {
      console.error("❌ Error fetching stations:", err);
      setError(err.response?.data?.error || "Failed to load stations");
      setLoading(false);
    }
  };

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
    setIsOpen(false);
  };

  const handleSubmit = async () => {
    if (!selectedStation) {
      setError("Please select a station first");
      return;
    }

    console.log("📤 Submitting station:", selectedStation);

    setSubmitting(true);
    try {
      const res = await axios.post(
        "/api/core-member/allocate-station",
        { stationId: selectedStation.id },
        { withCredentials: true }
      );

      console.log("✅ Allocation success:", res.data);
      router.push("/core-member");
    } catch (err: any) {
      console.error("❌ Error allocating station:", err);
      setError(err.response?.data?.error || "Failed to allocate station");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    try {
      await axios.get("/api/users/logout", { withCredentials: true });
      router.push("/login");
    } catch (err) {
      console.error("❌ Logout failed:", err);
    }
  };

  if (loading) {
    return (
      <main className="pt-20 w-full flex flex-col items-center justify-center p-4">
        <div className="text-white text-lg">Loading stations...</div>
      </main>
    );
  }

  return (
    <main className="pt-20 w-full flex flex-col items-center justify-center p-4">
      {/* Instruction Text */}
      {/* <div className="text-white text-lg mb-4 text-center">
        Choose your station
      </div> */}

      {error && (
        <div className="text-red-400 text-sm mb-4 text-center">{error}</div>
      )}

      {/* Dropdown */}
      <div className="relative mt-16">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-center"
          disabled={submitting}
        >
          <Image
            src="/assets/brick.svg"
            alt="Pick Station background"
            width={320}
            height={76}
            className="object-contain pointer-events-none"
          />
          <span className="absolute flex items-center gap-2 text-2xl text-[#F7F7EE] text-center pointer-events-none">
            {selectedStation
              ? `${selectedStation.name} (${selectedStation.difficulty})`
              : "Select Station"}
            <ChevronDown
              size={24}
              className={`transition-transform ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </span>
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 w-full z-20 max-h-100 overflow-y-auto flex flex-col items-center gap-2">
            {stations.map((station) => (
              <button
                key={station.id}
                type="button"
                onClick={() => handleStationSelect(station)}
                className="relative flex items-center justify-center"
              >
                <Image
                  src="/assets/brick.svg"
                  alt={`${station.name} background`}
                  width={220}
                  height={40}
                  className="object-contain pointer-events-none"
                />
                <span className="absolute text-xl text-[#F7F7EE] text-center pointer-events-none">
                  {station.name} ({station.difficulty})
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!selectedStation || submitting}
        className="group relative hover:scale-105 transition flex items-center justify-center mt-8"
      >
        <Image
          src="/assets/round-box.svg"
          alt="Submit"
          width={145}
          height={60}
          className="object-contain pointer-events-none"
        />
        <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-semibold pointer-events-none">
          {submitting ? "Submitting..." : "Submit"}
        </span>
      </button>

      
    </main>
  );
}

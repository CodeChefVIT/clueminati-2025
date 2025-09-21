"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

interface StationOption {
  id: string;
  station_name: string;
  difficulty: string;
}

export default function ChooseStation() {
  const [stations, setStations] = useState<StationOption[]>([]);
  const [selectedStation, setSelectedStation] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [allocating, setAllocating] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await fetch("/api/core-member/get-stations");
      const data = await response.json();
      
      if (response.ok) {
        setStations(data.stations);
      } else {
        setError(data.error || "Failed to load stations");
      }
    } catch (error) {
      console.error("Error fetching stations:", error);
      setError("Failed to load stations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAllocateStation = async () => {
    if (!selectedStation) {
      setError("Please select a station");
      return;
    }

    setAllocating(true);
    setError("");
    console.log("Allocating station:", selectedStation);

    try {
      const response = await fetch("/api/core-member/allocate-station", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stationId: selectedStation }),
      });

      const data = await response.json();
      console.log(" API Response:", { status: response.status, data });

      if (response.ok) {
        console.log("✅ Station allocated successfully, redirecting...");
        // Force a hard redirect to trigger middleware re-evaluation
        window.location.href = "/core-member";
      } else {
        console.error(" API Error:", data);
        setError(data.error || "Failed to allocate station");
      }
    } catch (error) {
      console.error("Error allocating station:", error);
      setError("Failed to allocate station. Please try again.");
    } finally {
      setAllocating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading stations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Choose Your Station</h1>
          <p className="text-gray-400">Select a station to manage as a core member</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="station-select" className="block text-sm font-medium mb-2">
              Available Stations
            </label>
            <select
              id="station-select"
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={allocating}
            >
              <option value="">Select a station...</option>
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.station_name} ({station.difficulty})
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Button
            onClick={handleAllocateStation}
            disabled={!selectedStation || allocating}
            className="w-full"
            label={allocating ? "Allocating..." : "Proceed"}
          />
        </div>

        <div className="text-center text-sm text-gray-400">
          <p>Once you select a station, you'll be redirected to your dashboard.</p>
        </div>
      </div>
    </div>
  );
}
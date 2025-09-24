"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

interface Station {
  _id: string;
  station_name: string;
  difficulty: "easy" | "medium" | "hard" | "Not specified";
}

const EditStationsPage: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newStationName, setNewStationName] = useState("");
  const [newStationDifficulty, setNewStationDifficulty] = useState<"easy" | "medium" | "hard">("easy");

  const [editingStation, setEditingStation] = useState<Station | null>(null);

  const fetchStations = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/edit-station");
      setStations(response.data.stations);
      setError(null);
    } catch (err) {
      setError("Failed to fetch stations.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleAddStation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStationName) return;
    try {
      await axios.post("/api/admin/edit-station", {
        station_name: newStationName,
        difficulty: newStationDifficulty,
      });
      setNewStationName("");
      fetchStations();
    } catch (err) {
      setError("Failed to add station. It might already exist.");
      console.error(err);
    }
  };

  const handleUpdateStation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStation) return;
    try {
      await axios.put(`/api/admin/edit-station`, {
          id: editingStation._id,
          station_name: editingStation.station_name,
          difficulty: editingStation.difficulty,
      });
      setEditingStation(null);
      fetchStations();
    } catch (err) {
      setError("Failed to update station.");
      console.error(err);
    }
  };

  const handleDeleteStation = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this station?")) {
      try {
        await axios.delete(`/api/admin/edit-station?id=${id}`);
        fetchStations();
      } catch (err) {
        setError("Failed to delete station.");
        console.error(err);
      }
    }
  };

  if (loading) return <p className="text-center text-gray-400">Loading stations...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Stations</h1>

      {/* Add Station Form */}
      <div className="mb-8 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Add New Station</h2>
        <form onSubmit={handleAddStation} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newStationName}
            onChange={(e) => setNewStationName(e.target.value)}
            placeholder="Station Name"
            className="p-2 rounded bg-gray-700 text-white border border-gray-600 flex-grow"
          />
          <select
            value={newStationDifficulty}
            onChange={(e) => setNewStationDifficulty(e.target.value as any)}
            className="p-2 rounded bg-gray-700 text-white border border-gray-600"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Station
          </button>
        </form>
      </div>

      {/* Stations List */}
      <div className="space-y-4">
        {stations.map((station) => (
          <div key={station._id} className="p-4 bg-gray-800 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
            {editingStation?._id === station._id ? (
              <form onSubmit={handleUpdateStation} className="flex-grow flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  value={editingStation.station_name}
                  onChange={(e) => setEditingStation({ ...editingStation, station_name: e.target.value })}
                  className="p-2 rounded bg-gray-700 text-white border border-gray-600 flex-grow"
                />
                <select
                  value={editingStation.difficulty}
                  onChange={(e) => setEditingStation({ ...editingStation, difficulty: e.target.value as any })}
                  className="p-2 rounded bg-gray-700 text-white border border-gray-600"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="Not specified">Not specified</option>
                </select>
                <div className="flex gap-2">
                  <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Save</button>
                  <button onClick={() => setEditingStation(null)} type="button" className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div>
                  <p className="text-lg font-semibold">{station.station_name}</p>
                  <p className="text-sm text-gray-400">Difficulty: {station.difficulty}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingStation(station)} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteStation(station._id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditStationsPage;
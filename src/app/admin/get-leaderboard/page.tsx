"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

type Member = {
  _id?: string;
  name?: string;
  username?: string;
  email?: string;
};

type LeaderboardRow = {
  name: string;
  total_score: number;
  members: (Member | string)[];
  secret_string?: string;
};

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 10;

  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => document.documentElement.classList.remove("dark");
  }, []);

  const fetchLeaderboard = async (page: number) => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/admin/get-Leaderboard?page=${page}`, {
  headers: { Authorization: token ? `Bearer ${token}` : "" },
});

      if (res.status === 401) {
        setError("Unauthorized. Please log in as admin.");
        setLeaderboardData([]);
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch leaderboard data");

      const json = await res.json();
      setTotalPages(Math.ceil((json.totalCount || 100) / pageSize));

      const normalizedData = (json.data || []).map((team: any) => ({
        name: team.name,
        total_score: team.total_score,
        secret_string: team.secret_string || "",
        members: (team.members || []).map((m: any) => (typeof m === "string" ? { _id: m } : m)),
      }));

      setLeaderboardData(normalizedData);
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
      setError("Unable to fetch leaderboard. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(pageIndex);
  }, [pageIndex]);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return leaderboardData;
    return leaderboardData.filter((team) => {
      const nameMatch = team.name.toLowerCase().includes(searchQuery.toLowerCase());
      const memberMatch = team.members.some((m) => {
        const member = typeof m === "string" ? { _id: m } : m;
        return (
          member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      return nameMatch || memberMatch;
    });
  }, [searchQuery, leaderboardData]);

  const columns: ColumnDef<LeaderboardRow>[] = [
    {
      id: "rank",
      header: "Rank",
      cell: ({ row }) => {
        const rank = (pageIndex - 1) * pageSize + row.index + 1;
        return <span className="font-semibold text-gray-100">{rank}</span>;
      },
    },
    {
      accessorKey: "name",
      header: "Team Name",
      cell: ({ getValue }) => <span className="font-medium text-white">{getValue<string>()}</span>,
    },
    {
      accessorKey: "members",
      header: "Members",
      cell: ({ getValue }) => {
        const members = getValue<(Member | string)[]>() || [];
        if (!members.length) return <span className="text-gray-500 italic">No members</span>;
        return (
          <ul className="divide-y divide-gray-600">
            {members.map((m, i) => {
              const member = typeof m === "string" ? { _id: m } : m;
              return (
                <li key={i} className="py-1 px-2 text-sm truncate">
                  {member.name || member.username || member.email || (member._id ? `User-${member._id}` : "Unknown")}
                </li>
              );
            })}
          </ul>
        );
      },
    },
    {
      accessorKey: "total_score",
      header: "Total Score",
      cell: ({ getValue }) => <span className="font-bold text-blue-400 text-center">{getValue<number>()}</span>,
    },
    {
      accessorKey: "secret_string",
      header: "Secret String",
      cell: ({ getValue }) => <span className="font-mono text-green-400">{getValue<string>() || "—"}</span>,
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="p-8 min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-red-400 text-lg font-medium">{error}</p>
      </div>
    );

  return (
    <div className="p-8 min-h-screen bg-gray-900 text-gray-100">
      <h1 className="mb-6 text-4xl font-extrabold text-center text-white">Leaderboard</h1>

      {/* Search Bar */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search team or member..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-600 bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-700">
        <table className="min-w-full border-collapse bg-gray-800 rounded-lg">
          <thead className="bg-gray-700 text-gray-300">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-b border-gray-600 px-4 py-3 text-left font-semibold cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === "asc" && " ▲"}
                    {header.column.getIsSorted() === "desc" && " ▼"}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-gray-500 italic">
                  No teams found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-700 transition-colors border-b border-gray-600">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 align-top border-r border-gray-600 last:border-r-0">
                      {cell.column.id === "members" ? (
                        <ul className="divide-y divide-gray-600">
                          {((cell.getValue() as (Member | string)[]) || []).map((m, i) => {
                            const member = typeof m === "string" ? { _id: m } : m;
                            return (
                              <li key={i} className="py-1 px-2 text-sm truncate">
                                {member.name || member.username || member.email || (member._id ? `User-${member._id}` : "Unknown")}
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => setPageIndex((prev) => Math.max(prev - 1, 1))}
          disabled={pageIndex === 1}
          className={`px-4 py-2 rounded-md border border-gray-700 ${
            pageIndex === 1 ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-gray-800 text-gray-200 hover:bg-gray-700"
          }`}
        >
          Previous
        </button>
        <span className="font-medium text-gray-300">
          Page {pageIndex} of {totalPages}
        </span>
        <button
          onClick={() => setPageIndex((prev) => Math.min(prev + 1, totalPages))}
          disabled={pageIndex === totalPages}
          className={`px-4 py-2 rounded-md border border-gray-700 ${
            pageIndex === totalPages ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-gray-800 text-gray-200 hover:bg-gray-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

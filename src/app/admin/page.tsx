"use client";

import { Button } from "@/components/ui/button";
import axios, { isAxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function CreateQuestionPage() {
    const router = useRouter();

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
        }
    }

    const adminRoutes = [
        "/admin/create-question",
        "/admin/create-station",
        "/admin/assign-secret-strings",
        "/admin/get-indoor-leaderboard",
        "/admin/get-leaderboard",
        "/admin/get-outdoor-leaderboard",
        "/admin/update-round",
    ];

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-6 sm:p-8">
                <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
                    Admin Panel
                </h1>

                <div className="space-y-6">
                    <div className="flex flex-col gap-3">
                        {adminRoutes.map((path) => (
                            <Button
                                key={path}
                                onClick={() => router.push(path)}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg rounded-xl shadow-sm"
                            >
                                {(path.replace("/admin/", "")).replace("-", " ")}
                            </Button>
                        ))}
                    </div>

                    <Button
                        onClick={logout}
                        className="w-full bg-red-500 hover:bg-red-600 text-white text-lg py-6 rounded-xl font-semibold transition-colors shadow-md"
                    >
                        Log Out
                    </Button>
                </div>
            </div>
        </div>
    );
}

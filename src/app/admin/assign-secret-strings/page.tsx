"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function AssignSecretStrings() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleAssignStrings = async () => {
    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/admin/assign-secret-strings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult(`✅ ${data.message}`);
        setSuccess(true);
        
        // Redirect to admin home page after 2 seconds
        setTimeout(() => {
          router.push("/admin");
        }, 2000);
      } else {
        setResult(`❌ Error: ${data.error}`);
        setSuccess(false);
      }
    } catch (error) {
      setResult(`❌ Network error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Assign Secret Strings</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Secret String Assignment</h2>
          <div className="bg-blue-900 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-blue-300 mb-2">🎯 How It Works Now:</h3>
            <ul className="text-sm text-blue-200 space-y-1">
              <li>• Secret strings are <strong>automatically assigned</strong> when teams are created</li>
              <li>• When Round 2 starts, any teams without strings get assigned automatically</li>
              <li>• Manual assignment is only needed for edge cases or testing</li>
            </ul>
          </div>
          
          <p className="text-gray-300 mb-4">
            Use this button to manually assign strings to teams that don't have them yet (useful for existing teams created before this feature).
          </p>
          
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Available Test Strings:</h3>
            <div className="grid grid-cols-3 gap-2 text-sm text-gray-400">
              <span>AAAAAA</span>
              <span>BBBBBB</span>
              <span>CCCCCC</span>
              <span>DDDDDD</span>
              <span>EEEEEE</span>
              <span>FFFFFF</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Note: These are test strings. Update assignTeamString.ts for production strings.
            </p>
          </div>

          <Button
            onClick={handleAssignStrings}
            disabled={loading}
            label={loading ? "Assigning..." : "Assign to Existing Teams"}
          />
        </div>

        {result && (
          <div className={`rounded-lg p-4 ${success ? 'bg-green-700' : 'bg-gray-700'}`}>
            <h3 className="font-semibold mb-2">Result:</h3>
            <p className="whitespace-pre-wrap">{result}</p>
            {success && (
              <p className="text-sm text-green-300 mt-2">
                Redirecting to admin panel in 2 seconds...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
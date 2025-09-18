'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';

// testing skip - Test component for skip functionality
export default function TestSkipPage() {
  const [skipStatus, setSkipStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const checkSkipStatus = async () => {
    try {
      const response = await axios.get('/api/round/skip-question');
      setSkipStatus(response.data);
    } catch (error: any) {
      console.error('Error checking skip status:', error);
      setMessage(error.response?.data?.error || 'Failed to check skip status');
    }
  };

  const testSkip = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/round/skip-question');
      setMessage('Skip successful! ' + response.data.message);
      await checkSkipStatus(); // Refresh status
    } catch (error: any) {
      console.error('Skip error:', error);
      setMessage(error.response?.data?.error || 'Skip failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSkipStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Skip Functionality</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Skip Status</h2>
          {skipStatus && (
            <div className="space-y-2">
              <p><strong>Can Skip:</strong> {skipStatus.canSkip ? 'Yes' : 'No'}</p>
              <p><strong>Remaining Time:</strong> {skipStatus.remainingTime || 0}ms</p>
              <p><strong>Remaining Seconds:</strong> {skipStatus.remainingSeconds || 0}s</p>
              {skipStatus.lastSkipTimestamp && (
                <p><strong>Last Skip:</strong> {new Date(skipStatus.lastSkipTimestamp).toLocaleString()}</p>
              )}
            </div>
          )}
          <button
            onClick={checkSkipStatus}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Status
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Skip</h2>
          <button
            onClick={testSkip}
            disabled={loading || (skipStatus && !skipStatus.canSkip)}
            className={`px-6 py-3 rounded text-white font-semibold ${
              loading || (skipStatus && !skipStatus.canSkip)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {loading ? 'Skipping...' : 'Test Skip Question'}
          </button>
        </div>

        {message && (
          <div className={`rounded-lg p-4 ${
            message.includes('successful') 
              ? 'bg-green-100 text-green-700 border border-green-400'
              : 'bg-red-100 text-red-700 border border-red-400'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Testing Notes</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Make sure you're logged in with a team</li>
            <li>Game must be in Round 1 or Round 2</li>
            <li>After first skip, cooldown is 5 minutes (300 seconds)</li>
            <li>Skip button should be disabled during cooldown</li>
            <li>Timer should count down and re-enable button after 5 minutes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
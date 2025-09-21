'use client'

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const questionBox = "/assets/Question_Box.svg";

export default function ValidateStringPage() {
  const router = useRouter();
  const [letters, setLetters] = useState<string[]>(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [validationStatus, setValidationStatus] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Check validation status on component mount
  useEffect(() => {checkValidationStatus()}, []);

  const checkValidationStatus = async () => {
    try {
      const response = await axios.get('/api/round/validate-string');
      setValidationStatus(response.data);
      
      if (response.data.alreadyValidated) {
        // Show previous result if already validated
        setResult({
          success: true,
          message: 'Previously validated',
          pointsEarned: response.data.stringScore,
          maxPossiblePoints: 96
        });
        setShowResult(true);
      }
    } catch (error: any) {
      console.error('Error checking validation status:', error);
    }
  };

  const handleLetterChange = (index: number, value: string) => {
    // Only allow single alphabetic characters
    const filteredValue = value.replace(/[^a-zA-Z]/g, '').toUpperCase();
    
    if (filteredValue.length <= 1) {
      const newLetters = [...letters];
      newLetters[index] = filteredValue;
      setLetters(newLetters);
      
      // Auto-focus next input if current is filled
      if (filteredValue && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !letters[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const guessedString = letters.join('');
    
    if (guessedString.length === 0) {
      alert('Please enter at least one letter');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/round/validate-string', {
        guessedString
      });

      setResult(response.data);
      setShowResult(true);
    } catch (error: any) {
      console.error('Error validating string:', error);
      alert(error.response?.data?.error || 'Failed to validate string');
    } finally {
      setLoading(false);
    }
  };

  const getPointsForLength = (length: number) => {
    return Math.min(length, 6) * 16;
  };

  const filledLength = letters.filter(letter => letter.length > 0).length;

  // Don't show the page if round hasn't ended
  if (validationStatus && !validationStatus.canValidate) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-gray-800 rounded-lg p-8 text-center text-white">
          <h1 className="text-2xl font-bold mb-4">String Validation</h1>
          <p className="text-gray-300">
            String validation is only available after Round 2 ends.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Current round: {validationStatus.currentRound}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Secret String Validation</h1>
          <p className="text-gray-300">
            Enter the letters you discovered during Round 2
          </p>
        </div>

        {/* Letter Input Boxes */}
        <div className="flex justify-center gap-4 mb-8">
          {letters.map((letter, index) => (
            <div key={index} className="relative">
              <input
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                value={letter}
                onChange={(e) => handleLetterChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={loading || showResult}
                className="w-16 h-16 text-3xl font-bold text-center bg-white border-4 border-blue-500 rounded-lg focus:border-blue-300 focus:outline-none disabled:bg-gray-300 disabled:text-gray-600"
                maxLength={1}
              />
              <div className="text-center text-gray-400 text-sm mt-1">
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Scoring Info */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-4">Scoring System</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
            {[1, 2, 3, 4, 5, 6].map(num => (
              <div key={num} className={`p-3 rounded-lg ${
                filledLength >= num ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
              }`}>
                <div className="font-bold">{num} letter{num > 1 ? 's' : ''}</div>
                <div>{getPointsForLength(num)} points</div>
              </div>
            ))}
          </div>
          <p className="text-gray-300 mt-4">
            Current: {filledLength} letters = {getPointsForLength(filledLength)} points
          </p>
        </div>

        {/* Submit Button */}
        {!showResult && (
          <div className="text-center mb-6">
            <button
              onClick={handleSubmit}
              disabled={loading || filledLength === 0}
              className={`px-8 py-4 text-xl font-bold rounded-lg transition-colors ${
                loading || filledLength === 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? 'Validating...' : 'Validate String'}
            </button>
          </div>
        )}

        {/* Result Modal */}
        {showResult && result && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
              <div className={`text-3xl font-bold mb-4 ${
                result.isPerfectMatch ? 'text-green-600' : 'text-blue-600'
              }`}>
                {result.isPerfectMatch ? 'String Accepted!' : 'Partial Match'}
              </div>
              
              <div className="space-y-3 text-gray-700">
                <p><strong>Your Guess:</strong> {result.guessedString || letters.join('')}</p>
                <p><strong>Correct String:</strong> {result.secretString}</p>
                <p><strong>Correct Characters:</strong> {result.correctChars}/6</p>
                <p className="text-2xl font-bold text-blue-600">
                  Points Earned: {result.pointsEarned}/{result.maxPossiblePoints}
                </p>
              </div>
              
              <button
                onClick={() => router.push('/')}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Instructions</h3>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Enter the letters you discovered during Round 2</li>
            <li>• You get 16 points for each correct letter in the correct position</li>
            <li>• Perfect match (all 6 letters) = 96 points</li>
            <li>• You can submit with 1-6 letters for partial points</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
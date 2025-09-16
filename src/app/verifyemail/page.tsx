'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import { Suspense } from 'react'

function VerifyEmailContent() {
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    const urlToken = searchParams.get('token')
    if (urlToken) {
      verifyUserEmail(urlToken)
    } else {
      setError("Verification token is missing or invalid.")
      setLoading(false)
    }
  }, [searchParams])

  const verifyUserEmail = async (token: string) => {
    try {
      await axios.post('/api/users/verifyemail', { token })
      setVerified(true)
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to verify email.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex h-screen justify-center w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
 
      />
      <div className="relative z-10 flex flex-col items-center justify-center  p-4 text-center text-white">
        <h1 className="text-4xl font-bold mb-8">Email Verification</h1>

        {loading && <p className="text-xl">Verifying your email...</p>}

        {verified && (
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl text-green-400">
              Email Verified Successfully!
            </h2>
            <p>You can now log in to your account.</p>
            <Link href="/login" className="text-[#24CCFF] hover:underline">
              Go to Login
            </Link>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl text-red-500">Verification Failed</h2>
            <p>{error}</p>
            <Link href="/signup" className="text-[#24CCFF] hover:underline">
              Try signing up again
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
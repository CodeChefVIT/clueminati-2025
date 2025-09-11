'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import { Suspense } from 'react'

function VerifyEmailContent() {
  const [token, setToken] = useState("")
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState("")
  const searchParams = useSearchParams()

  useEffect(() => {
    const urlToken = searchParams.get('token')
    if (urlToken) {
      setToken(urlToken)
      verifyUserEmail(urlToken)
    }
  }, [searchParams])

  const verifyUserEmail = async (token: string) => {
    try {
      const response = await axios.post('/api/users/verifyemail', { token })
      setVerified(true)
    } catch (error: any) {
      setError(error.response.data.error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl">Verify Email</h1>
      <h2 className="p-2 bg-orange-500 text-black">
        {token ? `${token}` : "no token"}
      </h2>

      {verified && (
        <div>
          <h2 className="text-2xl">Email Verified Successfully</h2>
          <Link href="/login" className="text-blue-500">
            Login
          </Link>
        </div>
      )}
      
      {error && (
        <div>
          <h2 className="text-2xl bg-red-500 text-black">{error}</h2>
          <Link href="/login" className="text-blue-500">
            Login
          </Link>
        </div>
      )}
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
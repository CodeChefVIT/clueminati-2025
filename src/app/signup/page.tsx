'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {toast} from "react-hot-toast"
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const [user, setUser]  = useState({
    email:"",
    password: "",
    fullname: ""
  })

  const [buttonDisabled,setButtonDisabled] = useState(false)
  const [loading,setLoading] = useState(false)
  const [emailError, setEmailError] = useState("")

  const onSignup = async ()=> {
    try {
      setLoading(true)
      setEmailError("") // Clear any existing error
      const response = await axios.post("/api/users/signup", user)
      console.log("Signup success", response.data);
      toast.success("Signup successful! Please check your email to verify your account.");
      router.push("/login")

    } catch (error:any) {
      console.log("Signup failed", error);
      if (error.response?.data?.error === "user already exists") {
        const errorMessage = error.response?.data?.message || "This email is already registered. Please login or use a different email.";
        setEmailError(errorMessage);
        toast.error(errorMessage);
      } else {
        toast.error(error.response?.data?.error || "Signup failed");
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=> {
    if(user.email.length > 0 && user.password.length > 0 && user.fullname.length > 0){
      setButtonDisabled(false)
    }else{
      setButtonDisabled(true)
    }

  },[user])  //user is dependency array, if theres any change in the array, it induces a change in the useEffect function

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1>{loading?"Proccessing" : "Signup"}</h1>
      <hr/>
      <label htmlFor="fullname">Full Name</label>
      <input
      className='p-2 border rounded-lg mb-4 focus:outline-none focus:border-gray-600'
      id='fullname'
      value={user.fullname}
      onChange={(e) => setUser({...user,fullname: e.target.value})}
      placeholder='Full Name'      
      type="text"
      required/>

      <hr/>
      <label htmlFor="email">email</label>
      <div className="w-full max-w-md">
        <input
          className={`p-2 border rounded-lg w-full ${
            emailError ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:border-gray-600`}
          id='email'
          value={user.email}
          onChange={(e) => {
            setUser({...user, email: e.target.value});
            setEmailError(""); // Clear error when user types
          }}
          placeholder='email'      
          type="email"
          required
        />
        {emailError && (
          <p className="text-red-500 text-sm mt-1 mb-2">{emailError}</p>
        )}
      </div>
      <hr/>

      <label htmlFor="password">password</label>
      <input
      className='p-2 border rounded-lg mb-4 focus:outline-none focus:border-gray-600'
      id='password'
      value={user.password}
      onChange={(e) => setUser({...user,password: e.target.value})}
      placeholder='password'      
      type="password"
      required/>

      <button 
        onClick={onSignup}
        disabled={buttonDisabled || loading || !!emailError}
        className={`p-2 rounded-lg mb-4 focus:outline-none ${
          buttonDisabled || loading || !!emailError
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        } transition-colors duration-300`}
      >
        {loading ? "Signing up..." : buttonDisabled ? "Please fill all fields" : "Sign up"}
      </button>

      <Link href="/login" className="text-blue-500 hover:text-blue-700 underline mt-4">
        Visit login page
      </Link>

    </div>
  )
}



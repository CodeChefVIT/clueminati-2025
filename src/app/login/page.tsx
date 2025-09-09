'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {toast} from "react-hot-toast"
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [user, setUser]  = useState({
    email:"",
    password: "",
  })

  const [buttonDisabled,setButtonDisabled] = useState(false)
  const [loading,setLoading] = useState(false)

  const onLogin = async ()=> {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data);
      
      if (response.data.success) {
        toast.success("Login successful!");
        // Use window.location for a full page reload
        window.location.href = "/profile";
      }
      
    } catch (error:any) {
      console.log("Login failed", error);
      toast.error(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=> {
    if(user.email.length > 0 && user.password.length > 0 ){
      setButtonDisabled(false)
    }else{
      setButtonDisabled(true)
    }

  },[user])  //user is dependency array, if theres any change in the array, it induces a change in the useEffect function

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1>{loading?"Proccessing" : "Login"}</h1>
      <hr/>
      <label htmlFor="email">email</label>
      <input
      className=''
      id='email'
      value={user.email}
      onChange={(e) => setUser({...user,email: e.target.value})}
      placeholder='email'      
      type="text"/>
      <hr/>

      <label htmlFor="password">password</label>
      <input
      className=''
      id='password'
      value={user.password}
      onChange={(e) => setUser({...user,password: e.target.value})}
      placeholder='password'      
      type="text"/>

      <button onClick={onLogin}
      className='p-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600'>
        {buttonDisabled? "No Login" : "Login"}
      </button>

      <Link href="/signup" className="text-blue-500 hover:text-blue-700 underline mt-4">
        Visit Signup page
      </Link>

    </div>
  )
}



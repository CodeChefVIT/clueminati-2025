// 'use client'

// import React from 'react'
//WHY TF DID I IMPORT REACT HERE

export default function page({params}:any) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile Page</h1>
      <h2 className="p-3 bg-green-500 rounded text-white">{params.id}</h2>
    </div>
  )
}
"use client"

import { signOut } from "next-auth/react"

export default function SignoutButton() {
  return (
    <button onClick={() => signOut()}>Sign out</button>
  )
}
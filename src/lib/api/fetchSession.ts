const fetchSession = async () => {
  const res = await fetch("/api/auth/session")
  if (!res.ok) throw new Error("Failed to fetch session")

  return res

}

export default fetchSession;
const fetchStats = async() => {
  const response = await fetch("/api/user/stats")

  if (!response.ok) {
    throw new Error("Falha ao buscar estatísticas")
  }

  return response
}

export default fetchStats;
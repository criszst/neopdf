 const fetchPDFs = async(): Promise<any> => {
  try {
    const res = await fetch("/api/pdf")
    if (!res.ok) throw new Error("Failed to fetch PDFs")
    const data = await res.json()
    
    return data
  } catch (error) {
  
    return console.error("Error fetching PDFs:", error)
  }
}

export default fetchPDFs;
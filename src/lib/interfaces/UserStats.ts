interface UserStats {
  totalPdfs: number
  starredPdfs: number
  storage: {
    used: number
    limit: number
    percentage: number
  }
}

export default UserStats;
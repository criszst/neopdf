export async function uploadToS3(file: File) {
  const fileName = `${Date.now()}-${file.name}`

  return {
    file,
    fileName,
  }
}


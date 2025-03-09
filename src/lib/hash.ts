/**
 * Calcula o hash SHA-256 de um arquivo
 * @param file O arquivo para calcular o hash
 * @returns Uma string hexadecimal representando o hash do arquivo
 */
export async function calculateFileHash(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()

  // Usa a API Web Crypto para calcular o hash SHA-256
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)

  // Converte o buffer para uma string hexadecimal
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

  return hashHex
}


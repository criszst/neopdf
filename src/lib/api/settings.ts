"use client"

import { useState, useEffect } from "react"

export interface UserSettings {
  id?: string
  userId?: string
  darkMode: boolean
  language: string
  emailNotifications: boolean
  pushNotifications: boolean
  twoFactorAuth: boolean
  autoDeleteItems: boolean
  phone?: string | null
  address?: string | null
  birthdate?: string | null
  secondaryEmails?: string[]
  name?: string
}

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true)
        const res = await fetch("/api/user/settings")

        if (!res.ok) {
          throw new Error("Falha ao buscar configurações")
        }

        const data = await res.json()
        setSettings(data)
      } catch (error: any) {
        console.error("Erro ao buscar configurações:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      setLoading(true)
      // Usar fetch com a API do Next.js
      const res = await fetch("/api/user/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSettings),
        // Adicionar estas opções para evitar comportamentos padrão
        cache: "no-store",
        next: { revalidate: 0 }
      })

      if (!res.ok) {
        throw new Error("Falha ao atualizar configurações")
      }

      const data = await res.json()
      
      // Atualizar o estado local com as novas configurações
      setSettings((prev) => {
        if (!prev) return data.settings;
        return { ...prev, ...newSettings };
      })

      return { success: true }
    } catch (error: any) {
      console.error("Erro ao atualizar configurações:", error)
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  return { settings, loading, error, updateSettings }
}

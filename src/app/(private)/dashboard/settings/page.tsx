"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type { User as NextAuthUser } from "next-auth"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  User,
  Bell,
  Eye,
  Lock,
  HelpCircle,
  Info,
  ChevronRight,
  LogOut,
  X,
  Save,
  ArrowLeft,
  Camera,
  Trash2,
  Key,
  CreditCard,
  Check,
  AtSign,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Plus,
} from "lucide-react"

import SideBar from "@/components/dashboard/sidebar"
import Header from "@/components/dashboard/header"
import PageLoading from "@/components/ui/page-loading"
import ToastComponent from "@/components/ui/toast"
import type ToastProps from "@/lib/props/ToastProps"

// Importe o hook useSettings
import { useSettings, type UserSettings as UserSettingsType } from "@/lib/api/settings"

export default function SettingsPage() {
  const [user, setUser] = useState<NextAuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("account")
  const [activeSubSection, setActiveSubSection] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showMobileSection, setShowMobileSection] = useState(false)
  const [mobileSectionTitle, setMobileSectionTitle] = useState("")
  const [toast, setToast] = useState<ToastProps>({
    show: false,
    type: "success",
    title: "",
    message: "",
  })

  // User profile data
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    birthdate: "",
    language: "pt-BR",
    profileImage: "",
    primaryEmail: "",
    secondaryEmails: [""],
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Substitua os estados individuais pelo hook useSettings
  // Remova estas linhas:
  // const [darkMode, setDarkMode] = useState(true)
  // const [autoDeleteItems, setAutoDeleteItems] = useState(false)
  // const [emailNotifications, setEmailNotifications] = useState(true)
  // const [pushNotifications, setPushNotifications] = useState(true)
  // const [twoFactorAuth, setTwoFactorAuth] = useState(false)
  // const [language, setLanguage] = useState("pt-BR")

  // Adicione o hook useSettings logo após a declaração dos outros estados:
  const { settings, loading: loadingSettings, error: settingsError, updateSettings } = useSettings()

  const searchInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/session")
        if (!res.ok) throw new Error("Failed to fetch session")
        const data = await res.json()
        setUser(data?.user || null)

        if (data?.user) {
          // Initialize profile data with user info
          setProfileData((prev) => ({
            ...prev,
            name: data.user.name || "",
            email: data.user.email || "",
            primaryEmail: data.user.email || "",
            profileImage: data.user.image || "",
          }))
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchSession()
  }, [])

  // Modifique o useEffect que carrega os dados do usuário para também atualizar o profileData com os dados das configurações
  useEffect(() => {
    if (settings && !loading) {
      setProfileData((prev) => ({
        ...prev,
        name: user?.name || "",
        email: user?.email || "",
        primaryEmail: user?.email || "",
        profileImage: user?.image || "",
        phone: settings.phone || "",
        address: settings.address || "",
        birthdate: settings.birthdate || "",
        language: settings.language || "pt-BR",
        secondaryEmails: settings.secondaryEmails || [""],
      }))
    }
  }, [settings, user, loading])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  // Substitua a função handleSaveChanges para salvar as configurações no banco de dados
  const handleSaveChanges = async (e?: React.MouseEvent) => {
    // Prevenir o comportamento padrão
    if (e) {
      e.preventDefault()
    }

    try {
      // Preparar os dados para atualização
      const settingsData: Partial<UserSettingsType> = {
        darkMode: settings?.darkMode,
        language: profileData.language,
        emailNotifications: settings?.emailNotifications,
        pushNotifications: settings?.pushNotifications,
        twoFactorAuth: settings?.twoFactorAuth,
        autoDeleteItems: settings?.autoDeleteItems,
        phone: profileData.phone,
        address: profileData.address,
        birthdate: profileData.birthdate,
        secondaryEmails: profileData.secondaryEmails.filter((email) => email.trim() !== ""),
        name: profileData.name,
        // Incluir a imagem nos dados a serem salvos
        image: profileData.profileImage,
      }

      // Mostrar toast de carregamento
      setToast({
        show: true,
        type: "info",
        title: "Salvando...",
        message: "Suas configurações estão sendo salvas.",
      })

      const result = await updateSettings(settingsData)

      // Fechar o toast de carregamento
      setToast({
        show: false,
        type: "info",
        title: "",
        message: "",
      })

      // Mostrar o resultado
      setTimeout(() => {
        if (result.success) {
          setToast({
            show: true,
            type: "success",
            title: "Configurações salvas",
            message: "Suas configurações foram atualizadas com sucesso.",
          })
        } else {
          setToast({
            show: true,
            type: "error",
            title: "Erro ao salvar",
            message: result.error || "Ocorreu um erro ao salvar suas configurações.",
          })
        }
      }, 100)
    } catch (error: any) {
      console.error("Erro ao salvar configurações:", error)
      setToast({
        show: true,
        type: "error",
        title: "Erro ao salvar",
        message: error.message || "Ocorreu um erro ao salvar suas configurações.",
      })
    }
  }

  const openMobileSection = (section: string, title: string) => {
    setActiveSection(section)
    setMobileSectionTitle(title)
    setShowMobileSection(true)
    setActiveSubSection(null)
  }

  const closeMobileSection = () => {
    setShowMobileSection(false)
    setActiveSubSection(null)
  }

  const openSubSection = (subsection: string) => {
    setActiveSubSection(subsection)
  }

  const closeSubSection = () => {
    setActiveSubSection(null)
  }

  const handleProfileImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Modificar a função handleFileChange para processar corretamente a imagem
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        const imageDataUrl = event.target.result as string
        setProfileData((prev) => ({
          ...prev,
          profileImage: imageDataUrl,
        }))

        // Não mostrar o toast aqui, apenas quando salvar as configurações
      }
    }
    reader.readAsDataURL(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSecondaryEmailChange = (index: number, value: string) => {
    const newEmails = [...profileData.secondaryEmails]
    newEmails[index] = value
    setProfileData((prev) => ({
      ...prev,
      secondaryEmails: newEmails,
    }))
  }

  const addSecondaryEmail = () => {
    setProfileData((prev) => ({
      ...prev,
      secondaryEmails: [...prev.secondaryEmails, ""],
    }))
  }

  const removeSecondaryEmail = (index: number) => {
    const newEmails = [...profileData.secondaryEmails]
    newEmails.splice(index, 1)
    setProfileData((prev) => ({
      ...prev,
      secondaryEmails: newEmails,
    }))
  }

  // Modifique a função settingsSections para usar os valores do hook useSettings
  // Substitua a chamada para settingsSections por:
  const settingsSections = (
    emailNotifications: boolean,
    setEmailNotifications: (value: boolean) => void,
    pushNotifications: boolean,
    setPushNotifications: (value: boolean) => void,
    language: string,
    setLanguage: (value: string) => void,
    twoFactorAuth: boolean,
    setTwoFactorAuth: (value: boolean) => void,
    darkMode: boolean,
    setDarkMode: (value: boolean) => void,
    autoDeleteItems: boolean,
    setAutoDeleteItems: (value: boolean) => void,
  ) => [
    {
      id: "account",
      title: "Conta",
      icon: User,
      items: [
        { id: "profile", title: "Perfil", description: "Edite suas informações pessoais" },
        { id: "email", title: "Email", description: "Gerencie seus endereços de email" },
        { id: "password", title: "Senha", description: "Altere sua senha" },
        { id: "subscription", title: "Assinatura", description: "Gerencie seu plano Premium" },
      ],
    },
    {
      id: "notifications",
      title: "Notificações",
      icon: Bell,
      items: [
        {
          id: "email_notifications",
          title: "Notificações por email",
          description: "Receba atualizações por email",
          toggle: true,
          state: emailNotifications,
          setState: setEmailNotifications,
        },
        {
          id: "push_notifications",
          title: "Notificações push",
          description: "Receba notificações no navegador",
          toggle: true,
          state: pushNotifications,
          setState: setPushNotifications,
        },
      ],
    },
    {
      id: "appearance",
      title: "Aparência",
      icon: Eye,
      items: [
        {
          id: "dark_mode",
          title: "Modo escuro",
          description: "Ative o tema escuro",
          toggle: true,
          state: darkMode,
          setState: setDarkMode,
        },
        {
          id: "language",
          title: "Idioma",
          description: "Selecione seu idioma preferido",
          select: true,
          options: [
            { value: "pt-BR", label: "Português (Brasil)" },
            { value: "en-US", label: "English (US)" },
            { value: "es", label: "Español" },
          ],
          state: language,
          setState: setLanguage,
        },
      ],
    },
    {
      id: "privacy",
      title: "Privacidade & Segurança",
      icon: Lock,
      items: [
        {
          id: "two_factor",
          title: "Autenticação de dois fatores",
          description: "Adicione uma camada extra de segurança",
          toggle: true,
          state: twoFactorAuth,
          setState: setTwoFactorAuth,
        },
        {
          id: "auto_delete",
          title: "Exclusão automática",
          description: "Excluir PDFs após 30 dias",
          toggle: true,
          state: autoDeleteItems,
          setState: setAutoDeleteItems,
        },
        { id: "data", title: "Meus dados", description: "Baixe ou exclua seus dados" },
      ],
    },
    {
      id: "help",
      title: "Ajuda & Suporte",
      icon: HelpCircle,
      items: [
        { id: "faq", title: "Perguntas frequentes", description: "Respostas para dúvidas comuns" },
        { id: "contact", title: "Contato", description: "Entre em contato com nossa equipe" },
        { id: "feedback", title: "Feedback", description: "Envie suas sugestões" },
      ],
    },
    {
      id: "about",
      title: "Sobre",
      icon: Info,
      items: [
        { id: "version", title: "Versão", description: "NeoPDF v2.0.1" },
        { id: "terms", title: "Termos de uso", description: "Leia nossos termos" },
        { id: "privacy_policy", title: "Política de privacidade", description: "Leia nossa política" },
      ],
    },
  ]

  // Filter sections and items based on search query
  const filteredSections = searchQuery
    ? settingsSections(
        settings?.emailNotifications || false,
        (value) => updateSettings({ emailNotifications: value }),
        settings?.pushNotifications || false,
        (value) => updateSettings({ pushNotifications: value }),
        settings?.language || "pt-BR",
        (value) => updateSettings({ language: value }),
        settings?.twoFactorAuth || false,
        (value) => updateSettings({ twoFactorAuth: value }),
        settings?.darkMode || true,
        (value) => updateSettings({ darkMode: value }),
        settings?.autoDeleteItems || false,
        (value) => updateSettings({ autoDeleteItems: value }),
      )
        .map((section) => ({
          ...section,
          items: section.items.filter(
            (item) =>
              item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())),
          ),
        }))
        .filter((section) => section.items.length > 0)
    : settingsSections(
        settings?.emailNotifications || false,
        (value) => updateSettings({ emailNotifications: value }),
        settings?.pushNotifications || false,
        (value) => updateSettings({ pushNotifications: value }),
        settings?.language || "pt-BR",
        (value) => updateSettings({ language: value }),
        settings?.twoFactorAuth || false,
        (value) => updateSettings({ twoFactorAuth: value }),
        settings?.darkMode || true,
        (value) => updateSettings({ darkMode: value }),
        settings?.autoDeleteItems || false,
        (value) => updateSettings({ autoDeleteItems: value }),
      )

  const activeSettingsSection = settingsSections(
    settings?.emailNotifications || false,
    (value) => updateSettings({ emailNotifications: value }),
    settings?.pushNotifications || false,
    (value) => updateSettings({ pushNotifications: value }),
    settings?.language || "pt-BR",
    (value) => updateSettings({ language: value }),
    settings?.twoFactorAuth || false,
    (value) => updateSettings({ twoFactorAuth: value }),
    settings?.darkMode || true,
    (value) => updateSettings({ darkMode: value }),
    settings?.autoDeleteItems || false,
    (value) => updateSettings({ autoDeleteItems: value }),
  ).find((section) => section.id === activeSection)
  const activeItem = activeSettingsSection?.items.find((item) => item.id === activeSubSection)

  if (loading || loadingSettings) {
    return <PageLoading />
  }

  const renderSettingItem = (item: any) => (
    <div
      className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-[#1A1A2E] transition-colors cursor-pointer"
      onClick={() => {
        if (!item.toggle && !item.select) {
          openSubSection(item.id)
        }
      }}
    >
      <div className="flex-1">
        <h3 className="text-white font-medium">{item.title}</h3>
        {item.description && <p className="text-white/60 text-sm mt-0.5">{item.description}</p>}
      </div>
      {item.toggle && (
        <button
          onClick={() => item.setState(!item.state)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            item.state ? "bg-purple-600" : "bg-zinc-700"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              item.state ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      )}
      {item.select && (
        <select
          value={item.state}
          onChange={(e) => item.setState(e.target.value)}
          className="bg-[#1A1A2E] text-white border border-purple-500/20 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        >
          {item.options.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
      {!item.toggle && !item.select && <ChevronRight size={18} className="text-white/40" />}
    </div>
  )

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 p-4 bg-[#1A1A2E] rounded-lg">
        <div className="relative">
          <div className="h-24 w-24 rounded-full overflow-hidden bg-purple-500/20 border-2 border-purple-500/30">
            {profileData.profileImage ? (
              <Image
                src={profileData.profileImage || "/placeholder.svg"}
                alt="Foto de perfil"
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-3xl font-medium text-white">
                {profileData.name?.[0] || user?.name?.[0] || "U"}
              </div>
            )}
          </div>
          <button
            onClick={handleProfileImageUpload}
            className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 shadow-lg"
          >
            <Camera size={16} className="text-white" />
          </button>
          <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>

        <div className="flex-1 space-y-4 w-full">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Nome completo</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              className="w-full bg-[#151525] border border-purple-500/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              placeholder="Seu nome completo"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Telefone</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/70" />
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-[#151525] border border-purple-500/20 rounded-lg py-2 pl-9 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Data de nascimento</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/70" />
                <input
                  type="date"
                  name="birthdate"
                  value={profileData.birthdate}
                  onChange={handleInputChange}
                  className="w-full bg-[#151525] border border-purple-500/20 rounded-lg py-2 pl-9 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Endereço</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3 text-purple-400/70" />
              <textarea
                name="address"
                value={profileData.address}
                onChange={handleInputChange}
                className="w-full bg-[#151525] border border-purple-500/20 rounded-lg py-2 pl-9 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 min-h-[80px]"
                placeholder="Seu endereço completo"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Idioma preferido</label>
            <div className="relative">
              <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/70" />
              <select
                name="language"
                value={profileData.language}
                onChange={handleInputChange}
                className="w-full bg-[#151525] border border-purple-500/20 rounded-lg py-2 pl-9 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderEmailSection = () => (
    <div className="space-y-6">
      <div className="p-4 bg-[#1A1A2E] rounded-lg">
        <h3 className="text-lg font-medium text-white mb-4">Email principal</h3>
        <div className="relative mb-4">
          <AtSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/70" />
          <input
            type="email"
            name="primaryEmail"
            value={profileData.primaryEmail}
            onChange={handleInputChange}
            className="w-full bg-[#151525] border border-purple-500/20 rounded-lg py-2 pl-9 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            placeholder="seu.email@exemplo.com"
          />
        </div>
        <div className="flex items-center text-xs text-white/60 mb-2">
          <Check size={14} className="text-green-400 mr-1" />
          <span>Email verificado</span>
        </div>
        <p className="text-sm text-white/70">Este é seu email principal usado para login e recuperação de conta.</p>
      </div>

      <div className="p-4 bg-[#1A1A2E] rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Emails secundários</h3>
          <button
            onClick={addSecondaryEmail}
            className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <Plus size={14} />
            <span>Adicionar</span>
          </button>
        </div>

        {profileData.secondaryEmails.map((email, index) => (
          <div key={index} className="relative mb-3 flex items-center gap-2">
            <AtSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/70" />
            <input
              type="email"
              value={email}
              onChange={(e) => handleSecondaryEmailChange(index, e.target.value)}
              className="flex-1 bg-[#151525] border border-purple-500/20 rounded-lg py-2 pl-9 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              placeholder="email.secundario@exemplo.com"
            />
            <button
              onClick={() => removeSecondaryEmail(index)}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        <p className="text-sm text-white/70 mt-2">
          Emails secundários podem ser usados para receber notificações e como alternativa para recuperação de conta.
        </p>
      </div>
    </div>
  )

  const renderPasswordSection = () => (
    <div className="space-y-6">
      <div className="p-4 bg-[#1A1A2E] rounded-lg">
        <h3 className="text-lg font-medium text-white mb-4">Alterar senha</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Senha atual</label>
            <div className="relative">
              <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/70" />
              <input
                type="password"
                name="currentPassword"
                value={profileData.currentPassword}
                onChange={handleInputChange}
                className="w-full bg-[#151525] border border-purple-500/20 rounded-lg py-2 pl-9 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                placeholder="Digite sua senha atual"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Nova senha</label>
            <div className="relative">
              <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/70" />
              <input
                type="password"
                name="newPassword"
                value={profileData.newPassword}
                onChange={handleInputChange}
                className="w-full bg-[#151525] border border-purple-500/20 rounded-lg py-2 pl-9 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                placeholder="Digite sua nova senha"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Confirmar nova senha</label>
            <div className="relative">
              <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/70" />
              <input
                type="password"
                name="confirmPassword"
                value={profileData.confirmPassword}
                onChange={handleInputChange}
                className="w-full bg-[#151525] border border-purple-500/20 rounded-lg py-2 pl-9 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                placeholder="Confirme sua nova senha"
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-white/70 mb-2">Requisitos de senha:</p>
          <ul className="text-xs text-white/60 space-y-1 ml-4 list-disc">
            <li>Pelo menos 8 caracteres</li>
            <li>Pelo menos uma letra maiúscula</li>
            <li>Pelo menos um número</li>
            <li>Pelo menos um caractere especial</li>
          </ul>
        </div>
      </div>

      <div className="p-4 bg-[#1A1A2E] rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-white">Autenticação de dois fatores</h3>
            <p className="text-sm text-white/70 mt-1">Adicione uma camada extra de segurança à sua conta.</p>
          </div>
          <button
            onClick={() => updateSettings({ twoFactorAuth: !settings?.twoFactorAuth })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              settings?.twoFactorAuth ? "bg-purple-600" : "bg-zinc-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings?.twoFactorAuth ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  )

  const renderSubscriptionSection = () => (
    <div className="space-y-6">
      <div className="p-4 bg-[#1A1A2E] rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Plano atual</h3>
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">Premium</span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-white/70">Plano</span>
            <span className="text-white font-medium">NeoPDF Premium</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/70">Preço</span>
            <span className="text-white font-medium">R$ 29,90/mês</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/70">Próxima cobrança</span>
            <span className="text-white font-medium">15/05/2023</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/70">Status</span>
            <span className="text-green-400 font-medium">Ativo</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors">
            Gerenciar assinatura
          </button>
          <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-colors">
            Cancelar assinatura
          </button>
        </div>
      </div>

      <div className="p-4 bg-[#1A1A2E] rounded-lg">
        <h3 className="text-lg font-medium text-white mb-4">Método de pagamento</h3>

        <div className="flex items-center gap-3 p-3 bg-[#151525] rounded-lg mb-4">
          <div className="h-10 w-10 rounded-md bg-purple-500/20 flex items-center justify-center">
            <CreditCard size={20} className="text-purple-400" />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium">•••• •••• •••• 4242</p>
            <p className="text-sm text-white/60">Expira em 12/2025</p>
          </div>
          <button className="text-purple-400 hover:text-purple-300 text-sm">Editar</button>
        </div>

        <button className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1">
          <Plus size={14} />
          <span>Adicionar novo método de pagamento</span>
        </button>
      </div>
    </div>
  )

  const renderSubSectionContent = () => {
    switch (activeSubSection) {
      case "profile":
        return renderProfileSection()
      case "email":
        return renderEmailSection()
      case "password":
        return renderPasswordSection()
      case "subscription":
        return renderSubscriptionSection()
      default:
        return null
    }
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#0A0118]">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/5" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-repeat opacity-10" />
        <motion.div
          className="absolute top-20 -left-40 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 -right-40 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, -20, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Sidebar */}
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={user} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full relative z-10">
        {/* Header */}
        <Header
          user={user}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onUpload={() => router.push("/dashboard")}
        />

        {/* Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Title and search */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between mb-6"
            >
              <h1 className="text-2xl font-bold text-white mb-4 sm:mb-0">Configurações</h1>

              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/70" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar configurações..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 bg-[#151525] border border-purple-500/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </motion.div>

            {/* Settings content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Settings navigation - hidden on mobile when section is open */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className={`md:block ${showMobileSection ? "hidden" : "block"}`}
              >
                <div className="bg-[#151525] backdrop-blur-sm rounded-xl border border-purple-900/20 p-4 shadow-xl shadow-purple-900/5">
                  <div className="space-y-1">
                    {filteredSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => {
                          if (window.innerWidth < 768) {
                            openMobileSection(section.id, section.title)
                          } else {
                            setActiveSection(section.id)
                            setActiveSubSection(null)
                          }
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          activeSection === section.id
                            ? "bg-purple-500/20 text-purple-400"
                            : "text-white hover:bg-[#1A1A2E]"
                        }`}
                      >
                        <section.icon size={20} />
                        <span className="font-medium">{section.title}</span>
                        <ChevronRight size={18} className="ml-auto text-white/40" />
                      </button>
                    ))}

                    <div className="pt-4 mt-4 border-t border-purple-900/20">
                      <button
                        onClick={() => {
                          // Handle logout
                          router.push("/login")
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut size={20} />
                        <span className="font-medium">Sair</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Settings details - spans 2 columns on desktop, full width on mobile when section is open */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className={`md:col-span-2 ${showMobileSection ? "block" : "hidden md:block"}`}
              >
                {/* Mobile back button */}
                {showMobileSection && (
                  <button onClick={closeMobileSection} className="md:hidden flex items-center gap-2 text-white mb-4">
                    <ArrowLeft size={20} />
                    <span>Voltar</span>
                  </button>
                )}

                <div className="bg-[#151525] backdrop-blur-sm rounded-xl border border-purple-900/20 shadow-xl shadow-purple-900/5">
                  {/* Section header */}
                  <div className="p-4 border-b border-purple-900/20">
                    <div className="flex items-center gap-3">
                      {activeSettingsSection && <activeSettingsSection.icon size={20} className="text-purple-400" />}
                      <h2 className="text-xl font-bold text-white">
                        {activeSubSection && activeItem
                          ? activeItem.title
                          : showMobileSection
                            ? mobileSectionTitle
                            : activeSettingsSection?.title}
                      </h2>

                      {/* Back button for subsections */}
                      {activeSubSection && (
                        <button
                          onClick={closeSubSection}
                          className="ml-auto text-white/70 hover:text-white flex items-center gap-1"
                        >
                          <ArrowLeft size={16} />
                          <span className="text-sm">Voltar</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Section content */}
                  <div className="p-4">
                    {activeSubSection ? (
                      renderSubSectionContent()
                    ) : (
                      <div className="space-y-1">
                        {activeSettingsSection?.items.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {renderSettingItem(item)}
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Save button */}
                    <div className="mt-6 flex justify-end">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.preventDefault()
                          handleSaveChanges()
                        }}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-purple-500/20"
                      >
                        <Save size={18} />
                        <span>Salvar alterações</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast.show && (
          <ToastComponent
            title={toast.title}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

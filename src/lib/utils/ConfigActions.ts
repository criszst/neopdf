import { User, Bell, Eye, Lock, HelpCircle, Info } from "lucide-react"

export const settingsSections = (
  emailNotifications: boolean,
  setEmailNotifications: (emailNotifications: boolean) => void,
  pushNotifications: boolean,
  setPushNotifications: (pushNotifications: boolean) => void,
  language: string,
  setLanguage: (language: string) => void,
  twoFactorAuth: boolean,
  setTwoFactorAuth: (twoFactorAuth: boolean) => void,
  darkMode: boolean,
  setDarkMode: (darkMode: boolean) => void,
  autoDeleteItems: boolean,
  setAutoDeleteItems: (autoDeleteItems: boolean) => void,
): Array<any> => {
  return [
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
        { id: "version", title: "Versão", description: "NeoPDF v0.0.1" },
        // { id: "terms", title: "Termos de uso", description: "Leia nossos termos" },
        // { id: "privacy_policy", title: "Política de privacidade", description: "Leia nossa política" },
      ],
    },
  ]
}

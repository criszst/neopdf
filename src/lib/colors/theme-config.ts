// Configuração de tema para o NeoPDF
export const theme = {
  colors: {
    // Cores principais
    background: {
      primary: "#0A0118", // Fundo principal mais escuro
      secondary: "#0F0A1F", // Fundo secundário
      tertiary: "#151525", // Fundo de cards
      card: "#1A1A2E", // Fundo de cards com transparência
    },
    purple: {
      primary: "#0f0423", // Roxo principal mais vibrante
      light: "#A78BFA", // Roxo claro
      dark: "#7C3AED", // Roxo escuro
      gradient: {
        from: "#8B5CF6",
        to: "#6D28D9",
      },
    },
    text: {
      primary: "#FFFFFF",
      secondary: "rgba(255, 255, 255, 0.8)",
      muted: "rgba(255, 255, 255, 0.6)",
    },
    border: {
      primary: "rgba(139, 92, 246, 0.2)",
      hover: "rgba(139, 92, 246, 0.4)",
    },
  },
  animation: {
    transition: {
      fast: "all 0.2s ease",
      normal: "all 0.3s ease",
      slow: "all 0.5s ease",
    },
  },
}

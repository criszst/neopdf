export const theme = {
  colors: {
    // Cores principais
    background: {
      primary: "#0A0118", // Fundo principal mais escuro
      secondary: "#110627", // Fundo secundário
      tertiary: "#1A0F24", // Fundo de cards
      card: "#151823", // Fundo de cards com transparência
    },
    purple: {
      primary: "#9333EA", // Roxo principal
      light: "#A855F7", // Roxo claro
      dark: "#7E22CE", // Roxo escuro
      gradient: {
        from: "#9333EA",
        to: "#7928CA",
      },
    },
    text: {
      primary: "#FFFFFF",
      secondary: "rgba(255, 255, 255, 0.7)",
      muted: "rgba(255, 255, 255, 0.5)",
    },
    border: {
      primary: "rgba(147, 51, 234, 0.2)",
      hover: "rgba(147, 51, 234, 0.4)",
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

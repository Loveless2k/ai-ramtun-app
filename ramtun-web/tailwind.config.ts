import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ramtun Brand Colors
        ramtun: {
          primary: '#6366F1',      // Índigo confianza
          secondary: '#EC4899',    // Rosa energía
          accent: '#10B981',       // Verde éxito
          dark: '#1F2937',         // Gris elegante
          light: '#F9FAFB',        // Blanco suave
          gray: '#6B7280',         // Gris medio
        },
        // Estados
        success: '#059669',        // Verde confirmación
        warning: '#D97706',        // Naranja alerta
        error: '#DC2626',          // Rojo error
        // Sistema
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'card-hover': 'card-hover 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.6)' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            opacity: '1', 
            boxShadow: '0 0 20px var(--ramtun-primary)' 
          },
          '50%': { 
            opacity: '0.8', 
            boxShadow: '0 0 40px var(--ramtun-primary)' 
          },
        },
        'card-hover': {
          '0%': { transform: 'translateY(0px) rotateX(0deg)' },
          '100%': { transform: 'translateY(-8px) rotateX(5deg)' },
        },
      },
      boxShadow: {
        'ramtun': '0 20px 40px rgba(99, 102, 241, 0.15)',
        'ramtun-lg': '0 25px 50px rgba(99, 102, 241, 0.25)',
      },
    },
  },
  plugins: [],
} satisfies Config;

// Modern Design System - Centralized styling and component patterns

export const designTokens = {
  colors: {
    primary: {
      gradient: "from-rose-600 to-pink-600",
      main: "#e11d48",
      light: "#fda4af",
      dark: "#be123c",
    },
    secondary: {
      bg: "from-blue-50 to-indigo-50",
      border: "border-blue-200",
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
    },
  },
  spacing: {
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "3rem",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
  },
};

export const buttonStyles = {
  primary: "bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed",
  secondary: "border-2 border-rose-400 text-rose-600 hover:bg-rose-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300",
  ghost: "text-gray-700 hover:text-rose-600 font-medium transition-colors duration-300",
  danger: "bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 rounded-lg px-4 py-2",
};

export const formInputStyles = {
  base: "w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all duration-300",
  error: "w-full border-2 border-red-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200",
};

export const cardStyles = {
  base: "bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300",
  elevated: "bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:transform hover:-translate-y-1 transition-all duration-300",
  gradient: "bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100",
};

export const animations = {
  fadeIn: "animate-fadeIn",
  slideIn: "animate-slideIn",
  pulse: "animate-pulse",
};

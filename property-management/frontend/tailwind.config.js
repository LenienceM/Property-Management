/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
  colors: {
  primary: "#1F3A5F",     // softer navy (trustworthy)
  secondary: "#C89B3C",   // gold accent
  muted: "#F7F7F7",       // light grey background
  surface: "#FFFFFF",    // cards
  dark: "#111827",        // charcoal (not true black)
  textDark: "#1A1A1A",
  textMuted: "#6B7280",
},

    

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      
    },
  



  plugins: [],

  

},

}

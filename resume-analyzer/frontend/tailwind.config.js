/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: "#A7B2C7",
                secondary: "#6E7C98",
                tertiary: "#C7D2E3",
                dark: "#06080D",
                "dark-card": "#1A1A2E",
                "brand-dark": "#06080D",
                "brand-surface": "#0B0F16",
                "brand-surface-high": "#121823",
                "brand-surface-bright": "#1A2231",
            },
            fontFamily: {
                sans: ['"Manrope"', '"Plus Jakarta Sans"', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                pulseGlow: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '.5' }
                }
            }
        },
    },
    plugins: [],
}

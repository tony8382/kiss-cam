/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'kiss-pink': '#f472b6',
                'kiss-deep-pink': '#ec4899',
                'kiss-red': '#e11d48',
            },
            animation: {
                'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                'reel-spin': 'reel-spin 0.5s linear infinite',
                'fade-in': 'fade-in 0.5s ease-out',
                'zoom-in': 'zoom-in 0.3s ease-out',
                'bounce-in': 'bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            },
            keyframes: {
                'reel-spin': {
                    '0%': { transform: 'translateY(0)' },
                    '100%': { transform: 'translateY(-1600px)' }
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                'zoom-in': {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' }
                },
                'bounce-in': {
                    '0%': { opacity: '0', transform: 'scale(0.3)' },
                    '50%': { opacity: '1', transform: 'scale(1.05)' },
                    '70%': { transform: 'scale(0.9)' },
                    '100%': { transform: 'scale(1)' }
                }
            }
        },
    },
    plugins: [],
}

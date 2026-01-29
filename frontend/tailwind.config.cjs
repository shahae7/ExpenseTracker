/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#050505",
                surface: "#0F0F11",
                surfaceHighlight: "#1F1F22",
                primary: "#D4AF37",
                primaryDim: "#AA8C2C",
                secondary: "#E5E7EB",
                accent: "#C0A062",
                danger: "#991B1B",
                success: "#065F46",
                text: {
                    main: "#FAFAFA",
                    muted: "#A1A1AA",
                    gold: "#D4AF37"
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
            backgroundImage: {
                'luxury-gradient': 'linear-gradient(135deg, #0f0f11 0%, #050505 100%)',
                'gold-gradient': 'linear-gradient(to right, #D4AF37, #C0A062)',
            }
        },
    },
    plugins: [],
}

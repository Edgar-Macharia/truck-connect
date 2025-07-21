/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // New TruckConnect Color Palette
        primary: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#22333B', // Gunmetal - Primary
          900: '#1a252b',
        },
        secondary: {
          50: '#f9f7f5',
          100: '#f0ebe6',
          200: '#e6ddd4',
          300: '#d4c7b8',
          400: '#c0ad98',
          500: '#a89478',
          600: '#8a7862',
          700: '#5E503F', // Walnut Brown - Secondary
          800: '#4a3f32',
          900: '#3d3429',
        },
        accent: {
          // Soft Peach
          peach: {
            50: '#fef9f5',
            100: '#fef2e8',
            200: '#fde4cc',
            300: '#fbd0a5',
            400: '#F4A261', // Soft Peach - Accent 1
            500: '#f08a2e',
            600: '#e16d1a',
            700: '#bb5617',
            800: '#954519',
            900: '#783a18',
          },
          // Creamy Beige
          beige: {
            50: '#fdfcfa',
            100: '#faf8f4',
            200: '#f5f1e8',
            300: '#E8D6C1', // Creamy Beige - Accent 2
            400: '#dcc5a3',
            500: '#cfb485',
            600: '#c0a06b',
            700: '#a8875a',
            800: '#8a6f4d',
            900: '#715c41',
          },
          // Light Sage
          sage: {
            50: '#f7f8f7',
            100: '#f0f2ef',
            200: '#e1e5de',
            300: '#A9B8A6', // Light Sage - Accent 3
            400: '#8fa08b',
            500: '#758871',
            600: '#5f6f5c',
            700: '#4f5a4c',
            800: '#424a40',
            900: '#383e36',
          },
        },
        // Keep some utility colors
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
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
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
};
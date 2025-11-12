/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#01959F',
          surface: '#F3FBFC',
          border: '#4DB5BC',
          hover: '#01777F',
          pressed: '#01595F',
          focus: '#01959F, 20%',
        },
        secondary: {
          main: '#FBC037',
          surface: '#FFFCF5',
          border: '#FEEABC',
          hover: '#F8A92F',
          pressed: '#FA9810',
          focus: '#FBC037, 20%',
        },
        danger: {
          main: '#E01428',
          surface: '#FFF9FA',
          border: '#F5B1B7',
          hover: '#BC1121',
          pressed: '#700A14',
          focus: '#E01428, 20%',
        },
        warning: {
          main: '#CA7336',
          surface: '#FCF7F3',
          border: '#FEB17B',
          hover: '#B1652F',
          pressed: '#985628',
          focus: '#CA7336, 20%',
        },
        success: {
          main: '#43936C',
          surface: '#F7F7F7',
          border: '#B8DBCA',
          hover: '#367A59',
          pressed: '#20573D',
          focus: '#731912, 20%',
        },
        neutral: {
          10: '#FFFFFF',
          20: '#FAFAFA',
          30: '#EDEDED',
          40: '#E0E0E0',
          50: '#C2C2C2',
          60: '#9E9E9E',
          70: '#757575',
          80: '#616161',
          90: '#404040',
          100: '#1D1F20',
        }
      },
      fontSize: {
        xs: ['10px', '16px'],
        s: ['12px', '20px'],
        m: ['14px', '24px'],
        l: ['16px', '28px'],
        heading_s: ['20px', '32px'],
        heading_m: ['24px', '36px'],
        heading_l: ['32px', '44px'],
        display: ['40px', '64px'],
      },
      borderRadius: {
        'lg': '8px',
      },
      boxShadow: {
        input: '1px 2px 2px 0 rgba(0, 0, 0, 0.12)',
        button: '0 1px 2px 0 rgba(0, 0, 0, 0.12)',
        modal: '0 4px 8px 0 rgba(0, 0, 0, 0.10)'
      },
      spacing: {
        'icon-sm': '1rem',    
        'icon-md': '1.25rem', 
        'icon-lg': '1.5rem',  
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ]
  
}
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        notion: {
          bg: '#ffffff',
          text: '#37352f',
          gray: 'rgba(55, 53, 47, 0.65)',
          gray_bg: 'rgba(55, 53, 47, 0.08)',
          gray_border: 'rgba(55, 53, 47, 0.16)',
          brown: '#442a1e',
          brown_bg: '#f4eeee',
          orange: '#d9730d',
          orange_bg: '#fbe4e4',
          yellow: '#cb912f',
          yellow_bg: '#fbf3db',
          green: '#448361',
          green_bg: '#edf3ec',
          blue: '#337ea9',
          blue_bg: '#e7f3f8',
          purple: '#9065b0',
          purple_bg: '#f6f3f9',
          pink: '#c14c8a',
          pink_bg: '#faf1f5',
          red: '#d44c47',
          red_bg: '#fdebec',
        },
        primary: {
          50: '#f7f7f5',
          100: '#ebeced',
          200: '#e1e1de',
          300: '#cfcfca',
          400: '#a3a299',
          500: '#787774',
          600: '#5a5957',
          700: '#474644',
          800: '#37352f',
          900: '#262521',
          950: '#141412',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['Lora', 'ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      },
      boxShadow: {
        'notion': 'rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 2px 4px',
        'notion-floating': 'rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

export default config
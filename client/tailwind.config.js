import daisyui from "daisyui"

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {
    fontFamily: {
      head: ['Montserrat', 'sans-serif'],
      jetbrain: ["JetBrains Mono", 'monospace'],
      nunito: ['Nunito Sans', 'sans-serif'],
    },
    colors: {
      "primary-blue": "#3A76C5",
      "secondary-blue": "#443AC5",
      "background-blue": "#3976C5",
      "btn-colors": "#3ABCC5",
      "light-blue": "#398EC5",
      
    },
    backgroundImage: {
      'blue-gradient': 'linear-gradient(180deg, #39BCC5 48%, #3976C5 100%)',
      'dark-gradient-hover': 'linear-gradient(180deg, #a0d8dc 12%, #1a202c 91%)'
    }
    
  } },
  plugins: [
    daisyui,
  ],
};

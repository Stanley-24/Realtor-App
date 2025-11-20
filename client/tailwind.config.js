import daisyui from "daisyui"

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {
    fontFamily: {
      head: ['Montserrat', 'sans-serif'],
      jetbrain: ["JetBrains Mono", 'monospace'],
    },
    colors: {
      "primary-blue": "#3A76C5",
      "secondary-blue": "#443AC5",
      "background-blue": "#3976C5",
      "btn-colors": "#3ABCC5"
    }
    
  } },
  plugins: [
    daisyui,
  ],
};

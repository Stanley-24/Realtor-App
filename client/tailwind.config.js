import daisyui from "daisyui"

module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		fontFamily: {
  			head: [
  				'Montserrat',
  				'sans-serif'
  			],
  			jetbrain: [
  				'JetBrains Mono',
  				'monospace'
  			],
  			nunito: [
  				'Nunito Sans',
  				'sans-serif'
  			]
  		},
  		colors: {
  			'primary-blue': '#3A76C5',
  			'secondary-blue': '#443AC5',
  			'background-blue': '#3976C5',
  			'btn-colors': '#3ABCC5',
  			'light-blue': '#398EC5',
  			'lighty': '#74b0d7',
  			'pinky': '#ba3fc0',



				brandedC: {
					pri_blue: 'hsl(var(--primary-blue))',
					pinky: 'hsl(var(--pinky))'
				},
				'btn-col': 'hsl(var(--btn-colors))',
				'lighty-pk': 'hsl(var(--lighty-pk))',

  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--primary-blue))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		backgroundImage: {
  			'blue-gradient': 'linear-gradient(180deg, #39BCC5 48%, #3976C5 100%)',
  			'dark-gradient-hover': 'linear-gradient(180deg, #a0d8dc 12%, #1a202c 91%)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    daisyui,
      require("tailwindcss-animate")
],
};

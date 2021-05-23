module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
    	flex: {
    		'10': "10%",
    		'20': "20%",
    		'30': "30%",
    		'50': "50%",
    		'80': "80%",
    		'100': "100%",
    	},
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
    },
  },
  plugins: [],
}

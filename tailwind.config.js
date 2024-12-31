/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        RobotoBold: ['"RobotoBold"', 'serif'],
        RobotoMedium: ['"RobotoMedium"', 'serif'],
        RobotoRegular: ['"RobotoRegular"', 'serif'],
      },
      colors: {
        primary: '#3a965f',
        secondary: '#66ab82',
        green: '#bfdbcb',
        gray: '#455a64',
        grayWhite: '#ebebeb',
        grayBlack: '#37474f',
        success: '#38A169',
      },
    },
  },
  plugins: [],
};

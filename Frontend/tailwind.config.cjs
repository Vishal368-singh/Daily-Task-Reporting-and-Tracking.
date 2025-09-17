module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
  variants: {
    scrollbar: ["rounded"], 
  },
};

module.exports = {
    content: [
      "./src/*/.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          black: "#000000",
          white: "#ffffff",
          gray: {
            300: "#d1d5db",
          },
          green: {
            600: "#16a34a",
            700: "#15803d",
          },
        },
        boxShadow: {
          pixel: "4px 4px 0 #a94464",
        },
        fontFamily: {
          press: ['"Press Start 2P"', "cursive"],
        },
        cursor: {
          pixel: 'url("/cursor-pixel.cur"), auto',
        },
      },
    },
    plugins: [],
  };
require("@babel/register")({
  presets: ["@babel/preset-env"]
})
require('core-js/stable')
require('regenerator-runtime/runtime')



if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

// Import the rest of our application.
module.exports = require("./src/server")

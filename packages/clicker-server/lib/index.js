require('regenerator-runtime/runtime')

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

// Import the rest of our application.
module.exports = require("./server")

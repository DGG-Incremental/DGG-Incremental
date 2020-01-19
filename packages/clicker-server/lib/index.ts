import { config } from "dotenv"

if (process.env.NODE_ENV !== "production") {
  config()
}

// Import the rest of our application.
import "./server"

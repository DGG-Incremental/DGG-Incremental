import "reflect-metadata"
import 'module-alias/register' 

// import "regenerator-runtime/runtime.js";

import { config } from "dotenv"
config()

// Import the rest of our application.
import "./server"

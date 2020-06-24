const { createProxyMiddleware } = require("http-proxy-middleware");
const Bundler = require("parcel-bundler");
const path = require("path");
const express = require("express");

const bundler = new Bundler(path.join(__dirname, "index.html"), {
	// Don't cache anything in development
	cache: false,
});

const app = express();
const PORT = process.env.PORT || 3001;
console.log("\x1b[33m%s\x1b[0m", `Client running on port ${PORT}`);

// This route structure is specifc to Netlify functions, so
// if you're setting this up for a non-Netlify project, just use
// whatever values make sense to you.  Probably something like /api/**

// Pass the Parcel bundler into Express as middleware
app.use(bundler.middleware());

app.use(
	"*",
	createProxyMiddleware({
		// Your local server
		target: "http://localhost:3000",
		// Your production routes
	})
);

// Run your Express server
app.listen(PORT);

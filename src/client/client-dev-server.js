const { createProxyMiddleware } = require("http-proxy-middleware");
const Bundler = require("parcel-bundler");
const path = require("path");
const express = require("express");
const http = require("http");

const bundler = new Bundler(path.join(__dirname, "index.html"), {
	// Don't cache anything in development
	cache: false,
});

const app = express();
const PORT = process.env.PORT || 3001;

const apiProxy = createProxyMiddleware({
	target: "http://localhost:3000",
	autoRewrite: true,
	changeOrigin: true,
	ws: true,
});
app.use("/api", apiProxy);
app.use("/wss", apiProxy);

// Pass the Parcel bundler into Express as middleware
app.use(bundler.middleware());

// Run your Express server
app.listen(PORT, () =>
	console.log("\x1b[33m%s\x1b[0m", `Client running on http://localhost:${PORT}`)
);

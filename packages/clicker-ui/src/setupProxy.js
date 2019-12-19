const proxy = require("http-proxy-middleware")

// Setup localhost proxies for localhost oauth dev
module.exports = function(app) {
  app.use(
    "/oauth",
    proxy({
      target: "http://localhost:3001/"
    })
  )
  app.use(
    "/auth",
    proxy({
      target: "http://localhost:3001/"
    })
  )
}

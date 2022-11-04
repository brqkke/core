const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    if (req.url === "/") {
      res.setHeader("Link", '</api/config>; rel="preload"; as="fetch"');
    }
    next();
  });
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:3001",
      changeOrigin: true,
    })
  );
};

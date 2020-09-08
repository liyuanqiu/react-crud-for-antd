const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function expressMiddleware(router) {
  router.use(
    '/hadesconsole/',
    createProxyMiddleware({
      target: 'http://xxx.com',
      changeOrigin: true,
    })
  );
};

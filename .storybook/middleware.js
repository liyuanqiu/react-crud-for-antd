const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function expressMiddleware(router) {
  router.use(
    '/hadesconsole/',
    createProxyMiddleware({
      target: 'http://supervisor.virgo.wz-inc.com',
      changeOrigin: true,
    })
  );
};

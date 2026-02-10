import http from 'node:http'
import { json } from './middleware/json.js';
import { routes } from './routes.js';
import { extractRoutePath } from './utils/extract-route-path.js';

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res);

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  });

  if (route) {
    const routeParameters = req.url.match(route.path);
    const { query, ...params } = routeParameters.groups || {};

    req.params = params;
    req.query = query ? extractRoutePath(query) : {};
    
    return route.handler(req, res);
  }

  return res.writeHead(404).end()
})

server.listen(3333, () => {
  console.log('Servidor rodando na porta 3333')
});
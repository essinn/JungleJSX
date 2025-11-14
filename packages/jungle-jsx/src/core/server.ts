import http from "http";
import { buildRoutes } from "./jsx-router";
import { match as pathToRegexpMatch } from "path-to-regexp";

export async function createServer(port = 5000) {
  const routes = await buildRoutes();
  const server = http.createServer(async (req, res) => {
    const url = new URL(
      req.url || "",
      `http://${req.headers.host || "localhost"}`
    );
    const pathname = url.pathname;
    const method = (req.method || "GET").toUpperCase();
    for (const r of routes) {
      if (r.method !== method && r.method !== "ALL") continue;
      const matcher = pathToRegexpMatch(r.path, { decode: decodeURIComponent });
      const m = matcher(pathname);
      if (!m) continue;
      const ctx = {
        req,
        res,
        params: m.params,
        query: Object.fromEntries(url.searchParams.entries()),
      };
      try {
        const out = await r.handler(ctx);
        if (out && out.__rs_response) {
          if (out.type === "json") {
            res.setHeader("content-type", "application/json");
            res.statusCode = out.status || 200;
            res.end(JSON.stringify(out.body));
            return;
          }
          if (out.type === "text") {
            res.setHeader("content-type", "text/plain");
            res.statusCode = out.status || 200;
            res.end(String(out.body));
            return;
          }
          if (out.status) {
            res.statusCode = out.status || 200;
            res.end();
            return;
          }
        }
        res.end("ok");
      } catch (e) {
        res.statusCode = 500;
        res.end("Server error");
        return;
      }
    }
    res.statusCode = 404;
    res.end("Not found");
  });
  server.listen(port, () =>
    console.log(`React-Serve running at http://localhost:${port}`)
  );
  return server;
}

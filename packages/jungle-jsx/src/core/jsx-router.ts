import React from "react";
import { discoverRoutes } from "./file-discovery";
import { ResponseMarker } from "../components/http-methods";
import {
  PipelineMarker,
  AuthMarker,
  RateLimitMarker,
  JSONBodyMarker,
} from "../components/pipelines";

function isMethod(node: any) {
  return node?.type?.isRouteMethod === true;
}
function isResponse(node: any) {
  return node?.type?.isResponse === true;
}
function isPipeline(node: any) {
  return node?.type?.isPipeline === true;
}
function isAuth(node: any) {
  return node?.type?.isAuth === true;
}
function isRateLimit(node: any) {
  return node?.type?.isRateLimit === true;
}
function isJSONBody(node: any) {
  return node?.type?.isJSONBody === true;
}

function walk(node: any, middleware: any[], out: any[]) {
  if (!node) return;

  if (isMethod(node)) {
    out.push({
      method: node.props.method,
      handlerNode: node.props.children,
      middleware: [...middleware],
    });
    return;
  }

  if (
    isPipeline(node) ||
    isAuth(node) ||
    isRateLimit(node) ||
    isJSONBody(node)
  ) {
    const next = [...middleware, node];
    React.Children.forEach(node.props.children, child =>
      walk(child, next, out)
    );
    return;
  }

  React.Children.forEach(node.props?.children, child =>
    walk(child, middleware, out)
  );
}

export async function buildRoutes() {
  const discovered = discoverRoutes();
  const routes = [];

  for (const d of discovered) {
    const mod = require(d.file);
    if (!mod.default) continue;

    const root = React.createElement(mod.default);
    const collected: any[] = [];

    walk(root, [], collected);

    for (const h of collected) {
      const method = h.method.toUpperCase();
      const handlerNode = h.handlerNode;
      const middleware = h.middleware;

      const handler = async (ctx: any) => {
        let fn = async () => {
          const result =
            typeof handlerNode === "function"
              ? await handlerNode(ctx)
              : handlerNode;

          if (isResponse(result)) {
            const { status = 200, type = "json", children } = result.props;

            return {
              __rs_response: true,
              status,
              type,
              body: children,
            };
          }

          return result;
        };

        for (let i = middleware.length - 1; i >= 0; i--) {
          const m = middleware[i];
          const prev = fn;

          if (isAuth(m)) {
            fn = async () => {
              if (!ctx.req.headers["x-api-key"]) {
                return {
                  __rs_response: true,
                  status: 401,
                  type: "json",
                  body: { error: "Unauthorized" },
                };
              }
              return prev();
            };
          }

          if (isRateLimit(m)) {
            const limit = m.props.limit;
            const map =
              (global as any).__rl || ((global as any).__rl = new Map());

            fn = async () => {
              const ip =
                ctx.req.headers["x-forwarded-for"] ||
                ctx.req.socket.remoteAddress;

              const count = (map.get(ip) || 0) + 1;
              map.set(ip, count);

              if (count > limit) {
                return {
                  __rs_response: true,
                  status: 429,
                  type: "json",
                  body: { error: "Rate limit exceeded" },
                };
              }
              return prev();
            };
          }

          if (isJSONBody(m)) {
            fn = async () => {
              if (!ctx.body) {
                const raw = await new Promise<string>(resolve => {
                  let tmp = "";
                  ctx.req.on("data", (c: any) => (tmp += c.toString()));
                  ctx.req.on("end", () => resolve(tmp));
                });

                try {
                  ctx.body = JSON.parse(raw || "{}");
                } catch {
                  ctx.body = {};
                }
              }
              return prev();
            };
          }
        }

        return fn();
      };

      routes.push({
        method,
        path: d.routePath,
        handler,
      });
    }
  }

  return routes;
}

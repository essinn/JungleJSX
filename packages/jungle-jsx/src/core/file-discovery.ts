import fs from "fs";
import path from "path";

export interface DiscoveredRoute {
  file: string;
  routePath: string;
}

export function discoverRoutes(
  apiRoot: string = path.join(process.cwd(), "api")
): DiscoveredRoute[] {
  if (!fs.existsSync(apiRoot)) return [];
  const results: DiscoveredRoute[] = [];

  function walk(dir: string, parts: string[]) {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const full = path.join(dir, entry);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walk(full, parts.concat(entry));
        continue;
      }
      if (!/\.tsx?$/.test(entry)) continue;
      let fileParts = parts.slice();
      const name = path.basename(entry, path.extname(entry));
      if (name != "index") fileParts.push(name);
      const rawPath = "/" + fileParts.join("/");
      const routePath = rawPath.replace(/\[([^\]]+)\]/g, ":$1");
      results.push({
        file: full,
        routePath: routePath == "" ? "/" : routePath,
      });
    }
  }
  walk(apiRoot, []);
  return results;
}

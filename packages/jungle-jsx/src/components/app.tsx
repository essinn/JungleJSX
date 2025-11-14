import { createServer } from "../core/server";

export function App({ port = 5000 }: { port?: number }) {
  createServer(port);
  return null;
}

import { useContext } from "react";
import { ServerContext } from "../context/server-context";

export function useRoute() {
  return useContext(ServerContext);
}

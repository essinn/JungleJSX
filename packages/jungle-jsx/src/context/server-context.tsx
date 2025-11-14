import React from "react";

export interface RequestContext {
  req: any;
  res: any;
  params: Record<string, string>;
  query: Record<string, string | string[]>;
}

export const ServerContext = React.createContext<RequestContext | null>(null);

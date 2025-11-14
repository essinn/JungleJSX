export function PipelineMarker({ children }: any) {
  return children;
}
(PipelineMarker as any).isPipeline = true;

export function AuthMarker({ children }: any) {
  return children;
}
(AuthMarker as any).isAuth = true;

export function RateLimitMarker({ children, limit }: any) {
  return children;
}
(RateLimitMarker as any).isRateLimit = true;

export function JSONBodyMarker({ children }: any) {
  return children;
}
(JSONBodyMarker as any).isJSONBody = true;

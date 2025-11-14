import React from "react";

function PipelineTag(props: any) {
  return <>{props.children}</>;
}
(PipelineTag as any).isPipeline = true;

export function PipelineMarker({ children }: any) {
  return <PipelineTag>{children}</PipelineTag>;
}

function AuthTag(props: any) {
  return <>{props.children}</>;
}
(AuthTag as any).isAuth = true;

export function AuthMarker({ children }: any) {
  return <AuthTag>{children}</AuthTag>;
}

function RateLimitTag(props: any) {
  return <>{props.children}</>;
}
(RateLimitTag as any).isRateLimit = true;

export function RateLimitMarker({ children, limit }: any) {
  return <RateLimitTag limit={limit}>{children}</RateLimitTag>;
}

function JSONBodyTag(props: any) {
  return <>{props.children}</>;
}
(JSONBodyTag as any).isJSONBody = true;

export function JSONBodyMarker({ children }: any) {
  return <JSONBodyTag>{children}</JSONBodyTag>;
}

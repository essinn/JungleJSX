import React from "react";

export function GET({ children }: any) {
  return <Method method="GET">{children}</Method>;
}
export function POST({ children }: any) {
  return <Method method="POST">{children}</Method>;
}
export function PUT({ children }: any) {
  return <Method method="PUT">{children}</Method>;
}
export function DELETE({ children }: any) {
  return <Method method="DELETE">{children}</Method>;
}
export function ALL({ children }: any) {
  return <Method method="ALL">{children}</Method>;
}

export function Method({ method, children }: any) {
  return <MethodMarker method={method}>{children}</MethodMarker>;
}

export function MethodMarker(props: any) {
  return props.children;
}
(MethodMarker as any).isRouteMethod = true;

/* <Response> */
export function Response({ status = 200, type = "json", children }: any) {
  return (
    <ResponseMarker status={status} type={type}>
      {children}
    </ResponseMarker>
  );
}

export function ResponseMarker(props: any) {
  return props.children;
}
(ResponseMarker as any).isResponse = true;

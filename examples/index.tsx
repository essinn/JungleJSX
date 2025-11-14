import { App } from "../packages/jungle-jsx/src/components/app";
import {
  GET,
  Response,
} from "../packages/jungle-jsx/src/components/http-methods";

function HelloRoute() {
  return (
    <GET>{() => <Response>{{ message: "Hello from XServe!" }}</Response>}</GET>
  );
}

export default function Pipeline() {
  return <HelloRoute />;
}

App({ port: 5000 });

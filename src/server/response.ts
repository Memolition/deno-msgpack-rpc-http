import { pack } from "msgpackr";
import { ContentType } from "./rpc-nano.ts";

export default class NrgResponse extends Response {
  constructor(body?: BodyInit | null, init?: ResponseInit) {
    super(body, init);
  }

  send(body?: BodyInit | null) {
    return new NrgResponse(body, {
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
    });
  }

  msgpack(body?: BodyInit | null) {
    this.headers.set('content-type', ContentType.msgpack);

    return this.send(body === null ? pack(body) : null);
  }
}
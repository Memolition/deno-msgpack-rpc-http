import { unpack } from "msgpackr";
import { ContentType } from "./rpc-nano.ts";

export default class NrgRequest {
  readonly msgpack: unknown;
  readonly body: unknown;
  original: Request;

  constructor(request: Request) {
    this.original = request;

    if(this.is(ContentType.msgpack)) {
      this.msgpack = request.body;
      this.body = unpack(request.body);
    }
  }

  private is(type:ContentType) {
    return this.original.headers.get('content-type') === type;
  }


}
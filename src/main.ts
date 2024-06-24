/// <reference lib="deno.ns" />

import NrgRequest from "./server/request.ts";
import NrgResponse from "./server/response.ts";
import Router, {Handler, Middleware} from "./server/router.ts";

const router = new Router();

const loggingMiddleware: Middleware = async (request: NrgRequest, response: NrgResponse, next: Handler): Promise<NrgResponse> => {
    console.log(`${request.original.method} ${new URL(request.original.url).pathname}`);
    return await next(request, response);
};

const helloController: Handler = (_req: NrgRequest, _res: NrgResponse): NrgResponse => {
  return new NrgResponse("Hello, World!");
};

router.use(loggingMiddleware);
router.add("GET", "/hello", helloController);


//const server = 
Deno.serve({port: 3000}, async (request: Request): Promise<Response> => {
    return await router.handle(request);
});
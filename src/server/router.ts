import NrgRequest from "./request.ts";
import NrgResponse from "./response.ts";

export type Handler = (request: NrgRequest, response: NrgResponse) => Promise<NrgResponse> | NrgResponse;
export type Middleware = (request: NrgRequest, response: NrgResponse, next: Handler) => Promise<NrgResponse> | NrgResponse;

export default class Router {
  private routes: Map<string, Map<string, Handler>> = new Map();
  private middlewares: Middleware[] = [];

  use(middleware: Middleware) {
    this.middlewares.push(middleware);
  }

  add(method: string, path: string, handler: Handler) {
    if (!this.routes.has(path)) {
      this.routes.set(path, new Map());
    }
    this.routes.get(path)!.set(method, handler);
  }

  async handle(request: Request): Promise<NrgResponse> {
    const url = new URL(request.url);
    const handlers = this.routes.get(url.pathname);

    if (!handlers) {
      return new NrgResponse("Not Found", { status: 404 });
    }

    const handler = handlers.get(request.method);
    if (!handler) {
      return new NrgResponse("Method Not Allowed", { status: 405 });
    }

    const executeMiddlewares = async (req: NrgRequest, res:NrgResponse, mwIndex: number): Promise<NrgResponse> => {
      if (mwIndex < this.middlewares.length) {
        return await this.middlewares[mwIndex](
          req,
          res,
          (
            nextReq: NrgRequest,
            nextRes: NrgResponse
          ) => executeMiddlewares(
            nextReq,
            nextRes,
            mwIndex + 1
          )
        );
      }

      return handler(req, res);
    };

    const nrgResponse = new NrgResponse();
    const nrgRequest = new NrgRequest(request);

    return await executeMiddlewares(nrgRequest, nrgResponse, 0);
  }
}
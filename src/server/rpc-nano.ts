/// <reference lib="deno.ns" />

import { unpack, pack } from 'msgpackr';

export enum ContentType {
    msgpack = "application/vnd.msgpack",
    plainText = "text/plain",
}

export enum HttpStatus {
    Success = 200,
    Created = 201,
    Accepted = 202,
    NoContent = 204,

    BadRequest = 400,
    NotFound = 404,

    ServerError = 500,
}

const NoContentStatus = [
    HttpStatus.Success,
    HttpStatus.Created,
    HttpStatus.Accepted,
    HttpStatus.NoContent,
];

export interface RPCInstance {
    method: string;
    payload: unknown;
}

type ExecutableFunction = (...args: unknown[]) => unknown;
type ExecutableFunctionsObject = Record<string, ExecutableFunction>;

const sayHello:ExecutableFunction = (name:unknown) => `Hello, ${name as string}!`;

export default class RPCNano {
    rpcMethods: ExecutableFunctionsObject = {
        sayHello
    };

    async callRPC(
        method:string,
        payload:unknown,
        callback: (response?:unknown) => void
    ) {
        const serialized = pack({method, payload});
        const url = 'localhost';
    
        const response = await fetch(url, {
            headers: {
                'content-type': ContentType.msgpack,
            },
            body: serialized
        });
    
        const result = NoContentStatus.includes(response.status) ? null : unpack(response);
    
        if(callback) {
            callback(result);
        }
    }

    async handleRPC ({method, payload}: RPCInstance) {
        return await this.rpcMethods[method]
            ? { result: this.rpcMethods[method](payload) }
            : { error: "Method not found" };
    }
}
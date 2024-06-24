/// <reference lib="deno.ns" />

import { unpack, pack } from 'msgpackr';

export enum ContentType {
    msgpack = "application/vnd.msgpack",
    plainText = "text/plain",
}

export const makeRequest = async () => {
    const payloadData = {
        name: "Some dummy data packed from the client"
    };
    const payload = pack(payloadData);

    const response = await fetch('http://localhost:3000/', {
        method: 'POST',
        headers: {
            'content-type': ContentType.msgpack
        },
        body: payload,
    });

    const data = await response
                        .arrayBuffer()
                        .then(data => unpack(data));

    console.log(data);
};

makeRequest();
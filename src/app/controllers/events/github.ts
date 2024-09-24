import { Request, Response } from "express";

import { createUpdate } from "../../../services/update";

let encoder = new TextEncoder();

async function verify(secret: string, payload: string, header: string) {
  let parts = header.split("=");
  let sigHex = parts[1];

  let algorithm = { name: "HMAC", hash: { name: "SHA-256" } };

  let keyBytes = encoder.encode(secret);
  let extractable = false;
  let key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    algorithm,
    extractable,
    ["sign", "verify"]
  );

  let sigBytes = hexToBytes(sigHex);
  let dataBytes = encoder.encode(payload);
  let equal = await crypto.subtle.verify(
    algorithm.name,
    key,
    sigBytes,
    dataBytes
  );

  return equal;
}

function hexToBytes(hex: string) {
  let len = hex.length / 2;
  let bytes = new Uint8Array(len);

  let index = 0;
  for (let i = 0; i < hex.length; i += 2) {
    let c = hex.slice(i, i + 2);
    let b = parseInt(c, 16);
    bytes[index] = b;
    index += 1;
  }

  return bytes;
}

export async function handler(req: Request, res: Response) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET || "";
  const body = JSON.stringify(req.body);
  const signature = req.headers["x-hub-signature-256"];
  if (!(await verify(secret, body, signature as string))) {
    return res.status(401).send("Unauthorized");
  }

  res.status(202).send("Accepted");

  const githubEvent = req.headers["x-github-event"];
  if (githubEvent === "push") {
    const data = req.body;
    const commit = data?.head_commit || data.commits[0];
    const title = commit.message.split("\n")[0];
    const shortID = commit.id.substring(0, 7);

    console.log(
      `[GitHub] ${commit.timestamp} - push event received, sent by: ${data.repository.full_name}`
    );
    const note = `${title} [${shortID}]\n\nautomated-via: GitHub`;
    await createUpdate("RDoOqSJuer", note);
  } else if (githubEvent === "ping") {
    console.log(`[GitHub] ping event received`);
  } else {
    console.log(`[GitHub] unhandled event received: ${githubEvent}`);
  }
}

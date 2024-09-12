import { NextFunction, Request, Response } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Basic")) {
    res.setHeader("WWW-Authenticate", "Basic");
    return res
      .status(401)
      .json({ message: "Unauthorized: authentication required" });
  }

  const credentials = authorization.split(" ")[1];
  const [apiKey] = Buffer.from(credentials, "base64")
    .toString("ascii")
    .split(":");

  if (apiKey === process.env.API_KEY) {
    return next();
  }
  return res.status(403).json({ message: "Forbidden: invalid API key" });
}

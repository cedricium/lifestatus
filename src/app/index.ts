import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";

import baseRouter from "./routes";

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use("/v1", baseRouter);
// app.get("/", (_: Request, res: Response) => {
//   res.sendFile(path.join(__dirname, "..", "public", "/index.html"));
// });
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  const message =
    process.env.NODE_ENV === "production"
      ? "An internal server error occurred, please try again."
      : err?.message;
  console.error(err);
  res.status(500).json({ success: false, error: { message } });
});

export default app;

import { Request, Response } from "express";

import * as snapshotService from "../../services/snapshot";
import * as snapshotAdapter from "../adapters/snapshot";

export async function listSnapshots(req: Request, res: Response) {
  const snapshots = await snapshotService.findAll();
  const data = snapshotAdapter.toChartData(snapshots);
  res.status(200).json({ data });
}

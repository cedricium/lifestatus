import { Request, Response } from "express";

import * as updateService from "../../services/update";

export async function listUpdates(req: Request, res: Response) {
  const updates = await updateService.findAll();
  return res.status(200).json({ activity: updates });
}

export async function recordUpdate(req: Request, res: Response) {
  const { id } = req.params;
  const { notes } = req.body;
  const update = await updateService.createUpdate(id, notes);
  return res.status(201).json({ update });
}

import { Request, Response } from "express";

import * as updateService from "../../services/update";

export async function recordUpdate(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const update = await updateService.createUpdate(id, notes);
    return res.status(201).json({ update });
  } catch (err) {
    console.error("Error creating update: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

import { Request, Response } from "express";

import * as monitorService from "../../services/monitor";

export async function getAverageMonitorStatus(req: Request, res: Response) {
  const status = await monitorService.getCurrentAverageStatus();
  return res.status(200).json({
    status,
    ranges: monitorService.STATUS_RANGES,
    timestamp: new Date().toISOString(),
  });
}

export async function listMonitors(req: Request, res: Response) {
  const monitors = await monitorService.getMonitors();
  return res.status(200).json({
    monitors,
    ranges: monitorService.STATUS_RANGES,
  });
}

export async function createMonitor(req: Request, res: Response) {
  const { title, description, period, frequency } = req.body;
  if (!title) {
    return res.status(400).json({ message: "missing `title` attribute" });
  }
  const monitor = await monitorService.createMonitor({
    title,
    description,
    period,
    frequency,
  });
  return res.status(201).json({ monitor });
}

import { Request, Response } from "express";

import * as monitorService from "../../services/monitor";

export async function getAverageMonitorStatus(req: Request, res: Response) {
  try {
    const status = await monitorService.getCurrentAverageStatus();
    return res.status(200).json({
      status,
      ranges: monitorService.STATUS_RANGES,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error getting aggregate monitor status: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function listMonitors(req: Request, res: Response) {
  try {
    const monitors = await monitorService.getMonitors();
    return res.status(200).json({
      monitors,
      ranges: monitorService.STATUS_RANGES,
    });
  } catch (err) {
    console.error("Error getting monitors: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function createMonitor(req: Request, res: Response) {
  const { title, description, period, frequency } = req.body;
  if (!title) {
    return res.status(400).json({ message: "missing `title` attribute" });
  }

  try {
    const monitor = await monitorService.createMonitor({
      title,
      description,
      period,
      frequency,
    });
    return res.status(201).json({ monitor });
  } catch (err) {
    console.error("Error creating monitor: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

import { Snapshot } from "../services/types";

const PREV_DAYS_COUNT = 29;

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

type SnapshotChartData = { date: string; avg?: number; fill?: string };

export function toChartData(
  snapshots: Snapshot[],
  backCount: number = PREV_DAYS_COUNT
): SnapshotChartData[] {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - backCount);

  const result = [];
  const dataMap = new Map(
    snapshots.map((row) => [formatDate(new Date(row.created_at)), row])
  );

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = formatDate(d);
    const data = dataMap.get(dateStr);

    result.push({
      date: dateStr,
      avg: data && Math.round(data.value * 100),
      fill: data && data.color,
    });
  }

  return result;
}

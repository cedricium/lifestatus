import { Snapshot } from "../../services/types";

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

type SnapshotChartData = { date: string; avg?: number; fill?: string };

export function toChartData(
  snapshots: Snapshot[],
  backCount: number = 60
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

    if (data) {
      result.push({
        date: dateStr,
        avg: Math.round(data.value * 100),
        fill: data.color,
      });
    } else {
      result.push({
        date: dateStr,
        avg: undefined,
        fill: undefined,
      });
    }
  }

  return result;
}

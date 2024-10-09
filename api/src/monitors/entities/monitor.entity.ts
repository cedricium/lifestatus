import { Transform } from 'class-transformer';

export class MonitorEntity {
  id: string;
  created_at: number;
  title: string;
  description?: string;
  period: number;
  frequency: number;
  last_update_at: number;

  @Transform(({ value }) => getStatusRangeFromProgress(value))
  status: number;

  constructor(partial: Partial<MonitorEntity>) {
    Object.assign(this, partial);
  }
}

export class StatusEntity {
  value: number;
  label: string;
  color: string;

  constructor(partial: Partial<StatusEntity>) {
    Object.assign(this, partial);
  }
}

export const STATUS_RANGES = [
  { min: -Infinity, max: 0.0, label: 'Getting Started', color: '#FFC5E9' },
  { min: 0.01, max: 0.49, label: 'Unfocused', color: '#E95858' },
  { min: 0.5, max: 0.75, label: 'Refocusing', color: '#FFAF36' },
  { min: 0.76, max: 1.0, label: 'Making Progress', color: '#2BAC76' },
];

export function getStatusRangeFromProgress(progress: number): StatusEntity {
  const range = STATUS_RANGES.find(
    (range) => progress >= range.min && progress <= range.max,
  );
  if (!range) {
    throw new Error(`Invalid average: ${progress}`);
  }

  return new StatusEntity({
    value: progress,
    label: range.label,
    color: range.color,
  });
}

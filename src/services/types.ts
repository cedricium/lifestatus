export type Monitor = {
  id: string;
  title: string;
  description?: string;
  period: number;
  frequency: number;
  created_at: number;
  last_update_at: number | null;
  status: Status;
};

export type Update = {
  id: string;
  monitor_id: string;
  timestamp: number;
  notes?: string;
};

export type StatusRange = {
  min: number;
  max: number;
  label: string;
  color: string;
};

/**
 * e.g. "#2BAC76"
 */
type CSSHexColor = string;

export type Status = {
  value: number;
  label: string;
  color: CSSHexColor;
};

export type Snapshot = Pick<Status, "value" | "label" | "color"> & {
  id: string;
  created_at: Date;
};

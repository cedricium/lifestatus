export type Monitor = {
  id: string;
  title: string;
  description?: string;
  period: number;
  frequency: number;
  created_at: number;
  last_update_at?: number;
  status: number;
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

export type Status = {
  value: number;
  label: string;
  color: string;
};

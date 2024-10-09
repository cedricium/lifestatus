export class UpdateEntity {
  id: string;
  monitor_id: string;
  timestamp: number;
  notes?: string;
  monitor: string;

  constructor(partial: Partial<UpdateEntity>) {
    Object.assign(this, partial);
  }
}

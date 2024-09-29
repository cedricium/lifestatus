import LeetCodeAdapter from "./leetcode";
// import StravaAdapter from "../../app/adapters/external/strava";

export interface PollSource {
  fetchEvents(lastChecked: Date | number): Promise<PollResult>;
  createNote(events: Event[]): string;
}

export type PollResult = {
  events: Event[];
  latestEventDate: Date;
};

export type Event = {
  timestamp: Date | number;
  data: any;
};

export function getAdapterFromSource(source: string): PollSource {
  switch (source) {
    case "leetcode":
      return new LeetCodeAdapter();
    // case "strava":
    //   return new StravaAdapter();
    default:
      throw new Error(`Unknown source: ${source}`);
  }
}

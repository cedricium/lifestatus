import { calculateStatus } from "./monitor";
import { Monitor, Update } from "./types";

describe("monitor service", () => {
  describe("calculateStatus", () => {
    test("should return 1 when recent updates matches or exceeds monitor frequency for current period", () => {
      const monitor: Monitor = {
        id: "test-monitor",
        title: "testing",
        status: 0.0,
        period: 24,
        frequency: 3,
        created_at: Date.now() - 10 * 1000,
        last_update_at: Date.now() - 1000,
      };
      const updates: Update[] = [
        {
          id: "update1",
          monitor_id: "test-monitor",
          timestamp: Date.now() - 1000,
        },
        {
          id: "update2",
          monitor_id: "test-monitor",
          timestamp: Date.now() - 2000,
        },
        {
          id: "update3",
          monitor_id: "test-monitor",
          timestamp: Date.now() - 3000,
        },
      ];

      expect(calculateStatus(monitor, updates)).toBe(1);
    });

    test("should return 0.75 when some updates within current period but doesn't match frequency", () => {
      const monitor: Monitor = {
        id: "test-monitor",
        title: "testing",
        status: 0.0,
        period: 1,
        frequency: 2,
        created_at: Date.now() - 10 * 1000 * 60 * 60,
        last_update_at: Date.now() - 0.5 * 1000 * 60 * 60,
      };
      const updates: Update[] = [
        {
          id: "update1",
          monitor_id: "test-monitor",
          timestamp: Date.now() - 1.25 * 1000 * 60 * 60,
        },
        {
          id: "update2",
          monitor_id: "test-monitor",
          timestamp: Date.now() - 0.5 * 1000 * 60 * 60,
        },
      ];

      expect(calculateStatus(monitor, updates)).toBe(0.75);
    });

    test("should return 0.1 when no updates within current period but some in previous period", () => {
      const monitor: Monitor = {
        id: "test-monitor",
        title: "testing",
        status: 0.0,
        period: 1,
        frequency: 2,
        created_at: Date.now() - 10 * 1000 * 60 * 60,
        last_update_at: Date.now() - 1.25 * 1000 * 60 * 60,
      };
      const updates: Update[] = [
        {
          id: "update1",
          monitor_id: "test-monitor",
          timestamp: Date.now() - 2.5 * 1000 * 60 * 60,
        },
        {
          id: "update2",
          monitor_id: "test-monitor",
          timestamp: Date.now() - 1.25 * 1000 * 60 * 60,
        },
      ];

      expect(calculateStatus(monitor, updates)).toBe(0.1);
    });
  });

  describe("getStatusFromAverage", () => {
    test.todo("rename to something like `getStatusRange`");
    test.todo("negative number returns 'Getting Started'");
    test.todo("0.01 <= num >= 0.49 returns 'Unfocused'");
    test.todo("0.5 <= num >= 0.75 returns 'Refocusing'");
    test.todo("0.76 <= num >= 1.0 returns 'Making Progress'");
  });
});

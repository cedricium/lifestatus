import { getStatusRangeFromProgress } from "./monitor";

describe("monitor service", () => {
  describe("getStatusRangeFromProgress", () => {
    test.todo("rename to something like `getStatusRange`");
    test.todo("negative number returns 'Discontinued'");
    test.todo("0 returns 'Getting Started'");
    test.todo("0.01 <= num >= 0.49 returns 'Unfocused'");
    test.todo("0.5 <= num >= 0.75 returns 'Refocusing'");
    test.todo("0.76 <= num >= 1.0 returns 'Making Progress'");
  });
});

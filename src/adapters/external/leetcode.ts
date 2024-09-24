import { PollResult, PollSource, Event } from ".";

const LEETCODE_API_ENDPOINT = "https://leetcode.com/graphql";

const LEETCODE_QUESTION_QUERY = `
  query questionTitle($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      questionId
      difficulty
    }
  }
`;

const LEETCODE_ACCEPTED_SUBMISSIONS_QUERY = `
  query recentAcSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      id
      langName
      status
      statusDisplay
      timestamp
      title
    }
  }
`;

type LeetCodeAPIResponse = {
  data: RecentSubmissions;
  errors: any;
};

type RecentSubmissions = {
  recentAcSubmissionList: Submission[];
};

type Submission = {
  id: string;
  timestamp: string;
  langName?: string;
  statusDisplay?: string;
  title?: string;
};

export default class LeetCodeAdapter implements PollSource {
  async fetchEvents(lastChecked: number): Promise<PollResult> {
    const response = await fetch(LEETCODE_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com/u/cedricium",
      },
      body: JSON.stringify({
        query: LEETCODE_ACCEPTED_SUBMISSIONS_QUERY,
        variables: { username: "cedricium", limit: 5 },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `[LeetCode] failed to fetch recent submissions: ${response.status} ${response.statusText}`
      );
    }

    const { data, errors }: LeetCodeAPIResponse = await response.json();
    if (errors) throw errors;

    const submissions = data.recentAcSubmissionList.filter(
      (submission) =>
        parseSecondsUnixTimeString(submission.timestamp) > lastChecked
    );

    return {
      events: submissions.map((submission) => ({
        timestamp: parseSecondsUnixTimeString(submission.timestamp),
        data: submission,
      })),
      latestEventDate: new Date(
        parseSecondsUnixTimeString(submissions[0]?.timestamp) || Date.now()
      ),
    };
  }

  createNote(events: Event[]): string {
    const note = events.reduce((note, event) => {
      const { title, langName } = event.data;
      return (note += `solved "${title}" [${langName}]\n`);
    }, "");
    return note + `\nautomated-via: LeetCode`;
  }
}

function parseSecondsUnixTimeString(ts?: string): number {
  return Number.parseInt(ts || "", 10) * 1000;
}

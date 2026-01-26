export interface GithubRepo {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  created_at: string;
  topics: string[];
}

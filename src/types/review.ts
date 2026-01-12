export interface CodeReview {
  summary: string;
  issues: ReviewIssue[];
  suggestions: string[];
  securityConcerns: string[];
  overallQuality: 'good' | 'needs-improvement' | 'poor';
}

export interface ReviewIssue {
  type: 'bug' | 'performance' | 'security' | 'style' | 'suggestion';
  severity: 'low' | 'medium' | 'high';
  line?: number;
  message: string;
  suggestion?: string;
}

export type ProgrammingLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'java'
  | 'go'
  | 'rust'
  | 'cpp'
  | 'csharp'
  | 'php'
  | 'ruby'
  | 'swift'
  | 'kotlin';

export const languageLabels: Record<ProgrammingLanguage, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  go: 'Go',
  rust: 'Rust',
  cpp: 'C++',
  csharp: 'C#',
  php: 'PHP',
  ruby: 'Ruby',
  swift: 'Swift',
  kotlin: 'Kotlin',
};

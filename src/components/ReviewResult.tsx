'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface ReviewResultProps {
  content: string;
  isLoading: boolean;
}

export default function ReviewResult({ content, isLoading }: ReviewResultProps) {
  if (!content && !isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
        <svg
          className="mb-4 h-16 w-16 text-gray-300 dark:text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
        <h3 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
          코드 리뷰 대기 중
        </h3>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          왼쪽 에디터에 코드를 입력하고
          <br />
          &quot;코드 리뷰&quot; 버튼을 클릭하세요
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <svg
          className="h-5 w-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
        <h2 className="font-semibold text-gray-900 dark:text-white">리뷰 결과</h2>
        {isLoading && (
          <span className="ml-auto flex items-center gap-1 text-sm text-blue-500">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            분석 중...
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:rounded prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-pink-600 dark:prose-code:bg-gray-700 dark:prose-code:text-pink-400 prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-p:my-2 prose-ul:my-2 prose-h2:mt-6 prose-h2:mb-3 prose-h3:mt-4 prose-h3:mb-2"
        >
          <ReactMarkdown>{content}</ReactMarkdown>
          {isLoading && (
            <span className="inline-block h-4 w-1 animate-pulse bg-blue-500 ml-1" />
          )}
        </motion.div>
      </div>
    </div>
  );
}

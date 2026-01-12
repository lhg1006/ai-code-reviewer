'use client';

import { useState, useEffect, useCallback } from 'react';
import ApiKeyModal from '@/components/ApiKeyModal';
import CodeEditor from '@/components/CodeEditor';
import ReviewResult from '@/components/ReviewResult';
import { ProgrammingLanguage } from '@/types/review';
import { streamCodeReview } from '@/lib/openai';

const API_KEY_STORAGE_KEY = 'ai-code-reviewer-api-key';

export default function Home() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const [reviewContent, setReviewContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 초기화
  useEffect(() => {
    const savedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedKey) setApiKey(savedKey);

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  const handleSaveApiKey = (key: string) => {
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
    setApiKey(key);
    setIsModalOpen(false);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKey(null);
  };

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
  };

  // 코드 리뷰
  const handleReview = useCallback(
    async (code: string, language: ProgrammingLanguage) => {
      if (!apiKey) {
        setIsModalOpen(true);
        return;
      }

      setIsLoading(true);
      setReviewContent('');

      try {
        for await (const chunk of streamCodeReview(apiKey, code, language)) {
          setReviewContent((prev) => prev + chunk);
        }
      } catch (error) {
        console.error('Review failed:', error);
        setReviewContent('코드 리뷰 중 오류가 발생했습니다. API 키를 확인해주세요.');
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey]
  );

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="shrink-0 border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-900/80">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              AI 코드 리뷰어
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              버그, 성능, 보안 이슈 분석
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {isDark ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {apiKey ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  연결됨
                </span>
                <button
                  onClick={handleClearApiKey}
                  className="text-sm text-gray-500 hover:text-red-500"
                >
                  초기화
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
              >
                API 키 설정
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex min-h-0 flex-1 gap-4 p-4">
        {/* Code Editor */}
        <div className="flex-1">
          <CodeEditor
            onReview={handleReview}
            isLoading={isLoading}
            disabled={!apiKey}
          />
        </div>

        {/* Review Result */}
        <div className="flex-1">
          <ReviewResult content={reviewContent} isLoading={isLoading} />
        </div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 border-t border-gray-200 py-3 dark:border-gray-800">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Built with Next.js, Monaco Editor & OpenAI
          </p>
          <p className="mt-1 text-sm text-gray-400">
            <a href="https://github.com/lhg1006" target="_blank" className="hover:text-blue-500">
              @lhg1006
            </a>
          </p>
        </div>
      </footer>

      <ApiKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveApiKey}
      />
    </div>
  );
}

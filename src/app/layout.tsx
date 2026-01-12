import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 코드 리뷰어",
  description: "AI가 코드를 분석하고 버그, 성능, 보안 이슈를 찾아 개선점을 제안합니다.",
  keywords: ["코드 리뷰", "AI", "버그", "성능", "보안", "리팩토링"],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}

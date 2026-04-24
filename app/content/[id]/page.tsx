"use client";

import { useState } from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useLanguageStore } from "@/lib/stores/languageStore";
import { useUserStore } from "@/lib/stores/userStore";
import { MOCK_CONTENTS, MOCK_USER } from "@/lib/mock-data";

const SHARE_PLATFORMS = [
  {
    key: "x",
    label: "X",
    color: "#000",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    key: "facebook",
    label: "Facebook",
    color: "#1877f2",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    color: "#25d366",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    getUrl: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(title + "\n" + url)}`,
  },
  {
    key: "telegram",
    label: "Telegram",
    color: "#229ed9",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    getUrl: (url: string, title: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
];

const MAX_COMMENT_LENGTH = 500;

export default function ContentDetailPage() {
  // All hooks must be declared before any conditional returns
  const t = useTranslations("content");
  const router = useRouter();
  const { language } = useLanguageStore();
  const { user } = useUserStore();
  const { id } = useParams<{ id: string }>();

  const isKo = language === "ko";
  const content = MOCK_CONTENTS.find((c) => c.id === id);

  const [liked, setLiked] = useState(() => MOCK_USER.likedContentIds.includes(id));
  const [likeCount, setLikeCount] = useState(() => content?.likes ?? 0);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(() => content?.comments ?? []);
  const [copied, setCopied] = useState(false);

  if (!content) return notFound();

  // TypeScript cannot narrow `content` inside nested function closures,
  // so we capture the narrowed reference here.
  const article = content;

  function getPageUrl() {
    return typeof window !== "undefined" ? window.location.href : "";
  }

  function handleShare(platform: (typeof SHARE_PLATFORMS)[number]) {
    const url = getPageUrl();
    const title = isKo ? article.title : article.titleEs;
    window.open(
      platform.getUrl(url, title),
      "_blank",
      "noopener,noreferrer,width=600,height=500"
    );
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(getPageUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API not available
    }
  }

  function toggleLike() {
    setLiked((prev) => {
      setLikeCount((c) => (prev ? c - 1 : c + 1));
      return !prev;
    });
  }

  function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: `cm${Date.now()}`,
        userId: user?.name ?? MOCK_USER.id,
        userName: user?.name ?? MOCK_USER.name,
        body: commentText,
        createdAt: new Date().toISOString().slice(0, 10),
      },
    ]);
    setCommentText("");
  }

  return (
    <article className="py-4 sm:py-6 md:py-10">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors mb-5 sm:mb-6 cursor-pointer"
      >
        ← {t("back")}
      </button>

      {/* Cover image */}
      <div className="relative w-full h-44 sm:h-60 md:h-80 rounded-xl sm:rounded-2xl overflow-hidden mb-5 sm:mb-6">
        <Image
          src={`https://picsum.photos/seed/${content.id}/1200/600`}
          alt={isKo ? content.title : content.titleEs}
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-cover"
          priority
        />
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Meta */}
        <div className="flex items-center gap-2 sm:gap-3 mb-3">
          <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded">
            {content.category}
          </span>
          <span className="text-xs sm:text-sm text-gray-400">{content.publishedAt}</span>
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-black leading-snug mb-3">
          {isKo ? content.title : content.titleEs}
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mb-5 sm:mb-6 leading-relaxed">
          {isKo ? content.summary : content.summaryEs}
        </p>

        <hr className="border-gray-100 mb-5 sm:mb-6" />

        {/* Body */}
        <section className="text-sm sm:text-base leading-7 sm:leading-8 text-gray-700 whitespace-pre-wrap mb-7 sm:mb-8">
          {isKo ? content.body : content.bodyEs}
        </section>

        {/* Cultural note */}
        <section className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl sm:rounded-r-2xl px-4 sm:px-5 py-3 sm:py-4 mb-7 sm:mb-8">
          <strong className="block text-amber-700 text-sm sm:text-base font-bold mb-1.5 sm:mb-2">
            📚 {t("culturalNote")}
          </strong>
          <p className="text-xs sm:text-sm text-amber-800 leading-relaxed m-0">
            {isKo ? content.culturalNote : content.culturalNoteEs}
          </p>
        </section>

        {/* Sources */}
        <section className="mb-7 sm:mb-8">
          <strong className="block text-sm font-bold mb-2 sm:mb-3">{t("sources")}</strong>
          <ul className="list-disc list-inside space-y-1.5">
            {content.sources.map((s, i) => (
              <li key={i} className="text-xs sm:text-sm">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <hr className="border-gray-100 mb-5 sm:mb-6" />

        {/* Like */}
        <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-semibold text-sm transition-all cursor-pointer border ${
              liked
                ? "bg-red-500 text-white border-red-500"
                : "bg-red-50 text-red-500 border-red-100 hover:bg-red-100"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {likeCount}
          </button>
          <span className="text-xs sm:text-sm text-gray-400">
            {liked ? t("likedThis") : t("likePrompt")}
          </span>
        </div>

        {/* Share */}
        <div className="flex items-center gap-2 flex-wrap mb-8 sm:mb-10">
          <span className="text-xs sm:text-sm font-bold text-gray-600">{t("share")}</span>
          {SHARE_PLATFORMS.map((platform) => (
            <button
              key={platform.key}
              onClick={() => handleShare(platform)}
              aria-label={platform.label}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white cursor-pointer hover:opacity-80 hover:scale-110 transition-all flex-shrink-0"
              style={{ backgroundColor: platform.color }}
            >
              {platform.icon}
            </button>
          ))}
          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-1.5 px-3 sm:px-4 h-9 rounded-full border text-xs font-semibold transition-all cursor-pointer flex-shrink-0 ${
              copied
                ? "bg-green-50 text-green-600 border-green-200"
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {copied ? (
              <>
                <span>✓</span> {t("copied")}
              </>
            ) : (
              <>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                {t("copyLink")}
              </>
            )}
          </button>
        </div>

        {/* Comments */}
        <section>
          <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5">
            💬 {t("comments")} ({comments.length})
          </h3>

          {/* Comment input — stacked on mobile, row on sm+ */}
          <form onSubmit={submitComment} className="mb-5 sm:mb-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
                placeholder={t("commentPlaceholder")}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black transition-colors"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="sm:flex-shrink-0 px-5 py-2.5 bg-black text-white rounded-xl text-sm font-bold cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t("submit")}
              </button>
            </div>
            {commentText.length > 0 && (
              <p className="text-right text-xs text-gray-400 mt-1.5">
                {commentText.length} / {MAX_COMMENT_LENGTH}
              </p>
            )}
          </form>

          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="border-b border-gray-50 pb-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <strong className="text-sm">{c.userName}</strong>
                  <span className="text-xs text-gray-300">{c.createdAt}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed m-0">{c.body}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-center text-gray-300 py-8 sm:py-10 text-sm">
                {t("firstComment")}
              </p>
            )}
          </div>
        </section>
      </div>
    </article>
  );
}

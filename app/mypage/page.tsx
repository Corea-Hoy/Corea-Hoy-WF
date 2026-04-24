"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLanguageStore } from "@/lib/stores/languageStore";
import { useUserStore, AVATAR_PRESETS } from "@/lib/stores/userStore";
import Image from "next/image";
import { MOCK_CONTENTS, MOCK_USER } from "@/lib/mock-data";

function Avatar({ emoji, color, size = 72 }: { emoji: string; color: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.44 }}
    >
      {emoji}
    </div>
  );
}

export default function MyPage() {
  const router = useRouter();
  const t = useTranslations("mypage");
  const { language } = useLanguageStore();
  const { user, isLoggedIn, updateProfile, logout, deleteAccount } = useUserStore();
  const isKo = language === "ko";

  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [tempNickname, setTempNickname] = useState("");
  const [tempAvatar, setTempAvatar] = useState(AVATAR_PRESETS[0]);
  const [nicknameError, setNicknameError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn) router.replace("/login");
  }, [mounted, isLoggedIn, router]);

  if (!mounted || !user) return null;

  const likedContents = MOCK_CONTENTS.filter((c) => user.likedContentIds.includes(c.id));
  const myComments = MOCK_CONTENTS.flatMap((c) =>
    c.comments
      .filter((cm) => cm.userId === MOCK_USER.id)
      .map((cm) => ({ ...cm, contentTitle: isKo ? c.title : c.titleEs, contentId: c.id }))
  );

  function startEdit() {
    setTempNickname(user!.name);
    setTempAvatar(AVATAR_PRESETS.find((p) => p.emoji === user!.avatarEmoji) ?? AVATAR_PRESETS[0]);
    setNicknameError("");
    setEditing(true);
  }

  function handleSave() {
    const trimmed = tempNickname.trim();
    if (trimmed.length < 2 || trimmed.length > 20) {
      setNicknameError(t("nicknameError"));
      return;
    }
    updateProfile(trimmed, tempAvatar.emoji, tempAvatar.color);
    setEditing(false);
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  function handleDeleteAccount() {
    deleteAccount();
    router.push("/");
  }

  return (
    <div className="py-6 md:py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8">{t("title")}</h1>

      {/* Desktop: sidebar + content, Mobile: stacked */}
      <div className="lg:grid lg:grid-cols-[320px_1fr] lg:gap-10 lg:items-start">

        {/* ── Left: Profile card (sticky on desktop) ── */}
        <aside className="mb-8 lg:mb-0">
          <div className="lg:sticky lg:top-24">
            <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              {/* Avatar + name */}
              <div className="flex items-center gap-4 mb-5">
                <Avatar
                  emoji={editing ? tempAvatar.emoji : user.avatarEmoji}
                  color={editing ? tempAvatar.color : user.avatarColor}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-lg font-bold truncate">{user.name}</div>
                  <div className="text-sm text-gray-400 mt-0.5 truncate">{user.email}</div>
                </div>
              </div>

              {/* Stats */}
              {!editing && (
                <div className="flex gap-6 mb-5 pb-5 border-b border-gray-100">
                  <div className="text-center">
                    <div className="text-2xl font-black">{likedContents.length}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{t("likes")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black">{myComments.length}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{t("comments")}</div>
                  </div>
                </div>
              )}

              {!editing ? (
                <button
                  onClick={startEdit}
                  className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {t("editProfile")}
                </button>
              ) : (
                /* Edit form */
                <div>
                  <div className="mb-4">
                    <div className="text-sm font-bold mb-2">{t("avatarLabel")}</div>
                    <div className="grid grid-cols-6 gap-1.5">
                      {AVATAR_PRESETS.map((preset) => {
                        const isSelected = tempAvatar.emoji === preset.emoji;
                        return (
                          <button
                            key={preset.emoji}
                            type="button"
                            onClick={() => setTempAvatar(preset)}
                            className={`aspect-square rounded-full flex items-center justify-center text-xl transition-all cursor-pointer border-2 ${
                              isSelected ? "border-black scale-110" : "border-transparent hover:scale-105"
                            }`}
                            style={{ backgroundColor: preset.color }}
                          >
                            {preset.emoji}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-bold mb-2">{t("nicknameLabel")}</div>
                    <input
                      type="text"
                      value={tempNickname}
                      onChange={(e) => { setTempNickname(e.target.value); setNicknameError(""); }}
                      placeholder={t("nicknamePlaceholder")}
                      maxLength={20}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 outline-none transition-colors ${
                        nicknameError ? "border-red-400" : "border-gray-200 focus:border-black"
                      }`}
                    />
                    {nicknameError && <p className="text-red-500 text-xs mt-1">{nicknameError}</p>}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="flex-1 py-2.5 bg-black text-white rounded-xl text-sm font-bold cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      {t("save")}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="flex-1 py-2.5 border border-gray-200 bg-white text-gray-500 rounded-xl text-sm font-semibold cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Account actions */}
            <div className="mt-4 flex justify-between items-center px-2">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="text-sm text-red-500 font-semibold hover:text-red-600 transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                {t("deleteAccount")}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-gray-200 text-gray-500 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {t("logout")}
              </button>
            </div>
          </div>
        </aside>

        {/* ── Right: Content ── */}
        <main>
          {/* Liked content */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">♥ {t("likedTitle")}</h2>
            {likedContents.length === 0 ? (
              <p className="text-center text-gray-300 py-12 border border-dashed border-gray-200 rounded-2xl text-sm">
                {t("emptyLike")}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {likedContents.map((c) => (
                  <Link
                    key={c.id}
                    href={`/content/${c.id}`}
                    className="group flex gap-3 border border-gray-100 bg-white rounded-xl overflow-hidden hover:border-black transition-all duration-200"
                  >
                    <div className="relative w-24 h-20 flex-shrink-0">
                      <Image
                        src={`https://picsum.photos/seed/${c.id}/240/160`}
                        alt={isKo ? c.title : c.titleEs}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center gap-1 py-3 pr-3 min-w-0">
                      <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-semibold text-gray-500 self-start">
                        {c.category}
                      </span>
                      <p className="font-bold text-sm leading-snug group-hover:underline line-clamp-2">
                        {isKo ? c.title : c.titleEs}
                      </p>
                      <span className="text-xs text-gray-300">{c.publishedAt}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* My comments */}
          <section>
            <h2 className="text-xl font-bold mb-4">💬 {t("commentTitle")}</h2>
            {myComments.length === 0 ? (
              <p className="text-center text-gray-300 py-12 border border-dashed border-gray-200 rounded-2xl text-sm">
                {t("emptyComment")}
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {myComments.map((cm) => (
                  <div key={cm.id} className="border border-gray-100 bg-white rounded-xl p-4">
                    <Link
                      href={`/content/${cm.contentId}`}
                      className="text-sm text-blue-500 font-semibold hover:underline"
                    >
                      {cm.contentTitle}
                    </Link>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">{cm.body}</p>
                    <span className="text-xs text-gray-300 mt-1 block">{cm.createdAt}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-xl">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="font-black text-lg mb-2">{t("deleteConfirmTitle")}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">{t("deleteConfirmDesc")}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 border border-gray-200 bg-white rounded-xl font-semibold text-sm cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {t("deleteCancel")}
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-sm cursor-pointer hover:bg-red-600 transition-colors"
              >
                {t("deleteConfirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "craftigari.followed-artisans.v1";
const FOLLOW_EVENT = "craftigari:follow-change";

function getFollowedArtisans() {
  if (typeof window === "undefined") return [];
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function subscribe(callback) {
  const handleStorage = (event) => {
    if (event.key === STORAGE_KEY) callback();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(FOLLOW_EVENT, callback);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(FOLLOW_EVENT, callback);
  };
}

export function FollowArtisanButton({
  artisanId,
  baseFollowerCount = 0,
  showCount = true,
}) {
  const isFollowing = useSyncExternalStore(
    subscribe,
    () => getFollowedArtisans().includes(artisanId),
    () => false,
  );
  const followerCount = baseFollowerCount + (isFollowing ? 1 : 0);

  const toggleFollow = () => {
    const followed = new Set(getFollowedArtisans());
    if (followed.has(artisanId)) followed.delete(artisanId);
    else followed.add(artisanId);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...followed]));
    window.dispatchEvent(new Event(FOLLOW_EVENT));
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        aria-pressed={isFollowing}
        className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-full border px-4 text-[12px] font-semibold transition-colors ${isFollowing ? "border-primary bg-primary text-white" : "border-border bg-white text-primary hover:border-primary"}`}
        onClick={toggleFollow}
        type="button"
      >
        <span className="material-symbols-outlined text-[17px]">
          {isFollowing ? "person_check" : "person_add"}
        </span>
        {isFollowing ? "Following" : "Follow artisan"}
      </button>
      {showCount && (
        <span className="text-[12px] text-secondary">
          {followerCount.toLocaleString("en-IN")} followers
        </span>
      )}
    </div>
  );
}

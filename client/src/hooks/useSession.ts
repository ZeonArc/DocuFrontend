"use client";

import { useState, useEffect, useCallback } from "react";
import type { RepoInfo } from "@/lib/api";

const KEYS = {
  sessionId: "docugithub_session_id",
  repoInfo: "docugithub_repo_info",
  bannerUrl: "docugithub_banner_url",
} as const;

export function useSession() {
  const [sessionId, setSessionIdState] = useState<string | null>(null);
  const [repoInfo, setRepoInfoState] = useState<RepoInfo | null>(null);
  const [bannerUrl, setBannerUrlState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setSessionIdState(localStorage.getItem(KEYS.sessionId));
    const storedRepo = localStorage.getItem(KEYS.repoInfo);
    if (storedRepo) {
      try {
        setRepoInfoState(JSON.parse(storedRepo));
      } catch {
        // ignore parse errors
      }
    }
    setBannerUrlState(localStorage.getItem(KEYS.bannerUrl));
    setHydrated(true);
  }, []);

  const setSessionId = useCallback((id: string | null) => {
    setSessionIdState(id);
    if (id) {
      localStorage.setItem(KEYS.sessionId, id);
    } else {
      localStorage.removeItem(KEYS.sessionId);
    }
  }, []);

  const setRepoInfo = useCallback((info: RepoInfo | null) => {
    setRepoInfoState(info);
    if (info) {
      localStorage.setItem(KEYS.repoInfo, JSON.stringify(info));
    } else {
      localStorage.removeItem(KEYS.repoInfo);
    }
  }, []);

  const setBannerUrl = useCallback((url: string | null) => {
    setBannerUrlState(url);
    if (url) {
      localStorage.setItem(KEYS.bannerUrl, url);
    } else {
      localStorage.removeItem(KEYS.bannerUrl);
    }
  }, []);

  const clearSession = useCallback(() => {
    setSessionIdState(null);
    setRepoInfoState(null);
    setBannerUrlState(null);
    localStorage.removeItem(KEYS.sessionId);
    localStorage.removeItem(KEYS.repoInfo);
    localStorage.removeItem(KEYS.bannerUrl);
    localStorage.removeItem("docugithub_readme");
  }, []);

  return {
    sessionId,
    repoInfo,
    bannerUrl,
    hydrated,
    setSessionId,
    setRepoInfo,
    setBannerUrl,
    clearSession,
  };
}

"use client";

import { useEffect, useState } from "react";

export function usePublicUrl(path) {
  const [url, setUrl] = useState(path);

  useEffect(() => {
    const updateTimer = window.setTimeout(() => {
      setUrl(new URL(path, window.location.origin).toString());
    }, 0);
    return () => window.clearTimeout(updateTimer);
  }, [path]);

  return url;
}

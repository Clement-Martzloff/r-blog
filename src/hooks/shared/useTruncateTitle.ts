"use client";

import { useCallback } from "react";

export function useTruncateTitle() {
  const truncateTitle = useCallback((title: string, maxLength: number) => {
    if (title.length <= maxLength) {
      return title;
    }
    return title.substring(0, maxLength) + "...";
  }, []);

  return truncateTitle;
}

"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in the viewport based on a constant
 * list of section ids. Returns the id of the active section.
 */
export function useScrollSpy(ids: readonly string[], offset = 120): string {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const onScroll = () => {
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) {
          current = id;
        }
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids, offset]);

  return active;
}

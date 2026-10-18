"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

/** Legacy key from builds that persisted the unlock across reloads. It is
 *  cleared on mount so returning visitors start locked again. */
const LEGACY_UNLOCK_KEY = "ahdaverse-runner-unlocked";

type UnlockContextValue = {
  unlocked: boolean;
  unlock: () => void;
};

const UnlockContext = createContext<UnlockContextValue>({
  unlocked: false,
  unlock: () => {},
});

/**
 * Gate provider: About / Skills / Experience / Projects stay locked until the
 * visitor wins the Ahdaverse Runner minigame.
 *
 * The unlock is deliberately kept in memory only — it is NOT persisted. Every
 * refresh (or new visit) starts from the beginning, so the game has to be won
 * again before the rest of the site appears.
 */
export function UnlockProvider({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    // drop the unlock left behind by older builds; without this a returning
    // visitor would stay unlocked forever
    try {
      localStorage.removeItem(LEGACY_UNLOCK_KEY);
    } catch {
      /* private mode */
    }

    // a refresh is a fresh start: the browser would otherwise restore the old
    // scroll position and drop the visitor halfway down a page whose sections
    // are hidden again, with no obvious way back to the game
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  const unlock = useCallback(() => setUnlocked(true), []);

  return (
    <UnlockContext.Provider value={{ unlocked, unlock }}>
      {children}
    </UnlockContext.Provider>
  );
}

export function useUnlock() {
  return useContext(UnlockContext);
}

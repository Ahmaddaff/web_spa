"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const UNLOCK_KEY = "ahdaverse-runner-unlocked";

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
 * visitor wins the Ahdaverse Runner minigame. Persisted in localStorage so a
 * refresh keeps the site unlocked.
 */
export function UnlockProvider({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      setUnlocked(localStorage.getItem(UNLOCK_KEY) === "1");
    } catch {
      /* private mode */
    }
  }, []);

  const unlock = useCallback(() => {
    try {
      localStorage.setItem(UNLOCK_KEY, "1");
    } catch {
      /* ignore */
    }
    setUnlocked(true);
  }, []);

  return (
    <UnlockContext.Provider value={{ unlocked, unlock }}>
      {children}
    </UnlockContext.Provider>
  );
}

export function useUnlock() {
  return useContext(UnlockContext);
}

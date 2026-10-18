"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface PlaybackApi {
  activeId: string | null;
  modalOpen: boolean;
  /** Ask to play inline. Only one story holds the slot at a time. */
  claim: (id: string) => void;
  release: (id: string) => void;
  setModalOpen: (open: boolean) => void;
}

const PlaybackContext = createContext<PlaybackApi | null>(null);

/**
 * Single source of truth for which story video may play inline. Opening the
 * full-screen modal clears the slot so nothing plays behind it.
 */
export function PlaybackProvider({ children }: { children: React.ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [modalOpen, setModalOpenState] = useState(false);

  const claim = useCallback((id: string) => setActiveId(id), []);
  const release = useCallback((id: string) => setActiveId((cur) => (cur === id ? null : cur)), []);
  const setModalOpen = useCallback((open: boolean) => {
    setModalOpenState(open);
    if (open) setActiveId(null);
  }, []);

  const value = useMemo(
    () => ({ activeId, modalOpen, claim, release, setModalOpen }),
    [activeId, modalOpen, claim, release, setModalOpen],
  );
  return <PlaybackContext.Provider value={value}>{children}</PlaybackContext.Provider>;
}

export function usePlayback(): PlaybackApi {
  const ctx = useContext(PlaybackContext);
  if (!ctx) throw new Error("usePlayback must be used inside <PlaybackProvider>");
  return ctx;
}

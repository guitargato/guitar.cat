"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import AlphaTabPlayer from "@/components/tab-player";
import { useAlphaTab } from "./hooks/use-alpha-tab";

export default function Page() {
  const alphaTab = useAlphaTab();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const apiRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loadedTitle, setLoadedTitle] = useState<string | null>(null);
  const [volume, setVolume] = useState(80);
  const [speed, setSpeed] = useState(1);

  // Create/destroy AlphaTabApi here (page)
  useEffect(() => {
    if (!alphaTab || !containerRef.current) return;
    if (apiRef.current) return;

    const api = new alphaTab.AlphaTabApi(containerRef.current, {
      core: { fontDirectory: "/alphatab/font/", engine: "html5" },
      display: {
        staveProfile: "Default",
        resources: {
          // subtle cool-gray lines
          staffLineColor:      "#444b6a", // faint steel gray
          barSeparatorColor:   "#565f89", // gentle contrast

          // notes, rests, beams — brighter and crisp
          mainGlyphColor:      "#c0caf5", // light blue-white
          secondaryGlyphColor: "#a9b1d6", // muted indigo
          scoreInfoColor:      "#7aa2f7", // primary indigo
          barNumberColor:      "#9ece6a", // greenish for visibility
        }
      },
      player: {
        enablePlayer: true,
        enableCursor: true,
        enableUserInteraction: true,
        enableAnimatedBeatCursor: true,
        soundFont: "/alphatab/soundfont/sonivox.sf2",
        scrollOffsetY: -50,
        playerMode: alphaTab.PlayerMode.EnabledSynthesizer,
      },
    });
    apiRef.current = api;

    // Title updates from scoreLoaded (keep simple: hook once)
    api.scoreLoaded?.on?.((score: any) => setLoadedTitle(score?.title || "Untitled"));

    return () => {
      try { api.scoreLoaded?.off?.(); } catch {}
      apiRef.current?.destroy?.();
      apiRef.current = null;
      setLoadedTitle(null);
    };
  }, [alphaTab]);

  // File loading owned by page
  const openFilePicker = useCallback(() => fileInputRef.current?.click(), []);
  const loadArrayBuffer = useCallback(async (buf: ArrayBuffer) => apiRef.current?.load?.(buf), []);
  const loadFile = useCallback(async (file: File) => {
    const buf = await file.arrayBuffer();
    await loadArrayBuffer(buf);
  }, [loadArrayBuffer]);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".gp3,.gp4,.gp5,.gpx,.gp,.gp7,.xml,.mxl,.txt"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) await loadFile(f);
          e.target.value = "";
        }}
      />
      <AlphaTabPlayer
        ref={containerRef}
        api={apiRef.current}
        loadedTitle={loadedTitle}
        volume={volume}
        speed={speed}
        setVolume={setVolume}
        setSpeed={setSpeed}
        onOpenClick={openFilePicker}
        onCloseClick={() => {
          setLoadedTitle(null);
          const node = containerRef.current;
          if (node) node.innerHTML = "";
        }}
        showDropHint
      />
    </>
  );
}

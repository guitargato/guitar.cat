"use client";

import React, { forwardRef, useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Play, Pause, Square, Volume2, ChevronDown, FolderOpen, X, Music, Upload, RotateCcw } from "lucide-react";
import { Timeline } from "./timeline";
import { formatTime } from "@/lib/format";

type PlayerProps = {
  api?: any;                        // AlphaTabApi instance (from page)
  loadedTitle: string | null;
  volume: number;
  speed: number;
  setVolume: (v: number) => void;
  setSpeed: (v: number) => void;
  onOpenClick: () => void;
  onCloseClick: () => void;
  showDropHint?: boolean;
};

const AlphaTabPlayer = forwardRef<HTMLDivElement, PlayerProps>(({
  api,
  loadedTitle,
  volume,
  speed,
  setVolume,
  setSpeed,
  onOpenClick,
  onCloseClick,
  showDropHint,
}, ref) => {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  // Wire AlphaTab events (react to api changes)
  useEffect(() => {
    if (!api) return;

    const onPlayerReady = () => {
      setIsReady(true);
      try { api.scrollToCursor?.(); } catch {}
      try { api.masterVolume = volume / 100; } catch {}
      try { api.playbackSpeed = speed; } catch {}
    };
    const onScoreLoaded = (score: any) => {
      setPositionMs(0);
      try {
        const firstTrack = score?.tracks?.[0];
        if (firstTrack) api.renderTracks?.([firstTrack]);
      } catch {}
    };
    const onPlayerStateChanged = (e: any) => setIsPlaying(e.state === 1);
    const onPlayerPositionChanged = (e: any) => {
      setPositionMs(e.currentTime);
      setDurationMs((prev: number) => (!prev || prev < e.endTime ? e.endTime : prev));
    };

    api.isLooping = isLooping
    api.playerReady?.on(onPlayerReady);
    api.scoreLoaded?.on(onScoreLoaded);
    api.playerStateChanged?.on(onPlayerStateChanged);
    api.playerPositionChanged?.on(onPlayerPositionChanged);

    const handleResize = () => api.updateSettings?.();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      api.playerReady?.off(onPlayerReady);
      api.scoreLoaded?.off(onScoreLoaded);
      api.playerStateChanged?.off(onPlayerStateChanged);
      api.playerPositionChanged?.off(onPlayerPositionChanged);
      setIsReady(false);
      setIsPlaying(false);
      setPositionMs(0);
      setDurationMs(0);
    };
  }, [api, speed, volume]);

  useEffect(() => {
    if (api) api.isLooping = isLooping
  }, [isLooping])

  const percent = useMemo(
    () => (!durationMs ? 0 : Math.max(0, Math.min(100, Math.round((positionMs / durationMs) * 100)))),
    [positionMs, durationMs]
  );

  // Controls
  const togglePlay = useCallback(() => api?.playPause?.(), [api]);
  const stop = useCallback(() => { try { api?.stop?.(); } catch {} }, [api]);
  const onSeek = useCallback((value: number[]) => {
    if (!api || !durationMs) return;
    const ms = (value[0] / 100) * durationMs;
    try { api.seek?.(ms); } catch {}
  }, [api, durationMs]);
  const onVolume = useCallback((value: number[]) => {
    const v = value[0];
    setVolume(v);
    try { if (api) api.masterVolume = v / 100; } catch {}
  }, [api, setVolume]);
  const onSpeed = useCallback((value: number[]) => {
    const s = value[0] / 100;                // 0..1
    const mapped = Math.max(0.5, Math.min(2, Number((s * 1.5 + 0.5).toFixed(2))));
    setSpeed(mapped);
    try { if (api) api.playbackSpeed = mapped; } catch {}
  }, [api, setSpeed]);

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === "INPUT") return;
      if (e.code === "Space") { e.preventDefault(); togglePlay(); }
      else if (e.key === "ArrowLeft") { onSeek([Math.max(0, percent - 3)]); }
      else if (e.key === "ArrowRight") { onSeek([Math.min(100, percent + 3)]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePlay, onSeek, percent]);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-dvh flex flex-col bg-background text-foreground">
        {/* Top toolbar */}
        <div className="sticky top-0 z-10 h-12 flex items-center justify-between border-b px-3 bg-background/80 backdrop-blur">
          <div className="flex items-center gap-2 min-w-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="gap-1">
                  File <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                <DropdownMenuLabel>File</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onOpenClick} className="gap-2">
                  <FolderOpen className="h-4 w-4" /> Open…
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onCloseClick} disabled={!loadedTitle} className="gap-2">
                  <X className="h-4 w-4" /> Close
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Separator orientation="vertical" className="h-6" />
            <div className="text-sm opacity-70 truncate">{loadedTitle ?? "No file loaded"}</div>
          </div>

          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="end">
                <div className="text-xs mb-2">Volume</div>
                <Slider value={[volume]} onValueChange={onVolume} max={100} step={1} />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button size="sm" variant="secondary" className="h-8">
                  <Music className="h-4 w-4 mr-1" /> {speed.toFixed(2)}x
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72" align="end">
                <div className="text-xs mb-2">Playback speed</div>
                <Slider defaultValue={[67]} onValueChange={onSpeed} max={100} step={1} />
                <div className="mt-2 text-xs text-muted-foreground">Range 0.5×–2.0×</div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Score viewer container (ref from parent creates the API target) */}
        <div
          ref={ref}
          className={`min-h-full p-4 flex-1 overflow-auto ${dragActive ? "ring-2 ring-primary/60 rounded-lg" : ""}`}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
          onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); /* page handles file load */ }}
        >
          {/* Optional empty state overlay (controlled by page via loadedTitle/showDropHint) */}
          {showDropHint && !loadedTitle && (
            <div className="grid place-items-center h-full">
              <Card className="border-dashed shadow-sm">
                <CardContent className="p-10 flex items-center gap-3">
                  <Upload className="h-5 w-5" />
                  <div className="text-sm">
                    Drag & drop a Guitar Pro / MusicXML / AlphaTex file here, or{" "}
                    <button className="underline" onClick={onOpenClick}>browse</button>.
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Player bar */}
        <div className="sticky bottom-0 z-10 border-t bg-background/80 backdrop-blur">
          <div className="px-4 py-3 flex flex-col gap-3 max-w-5xl mx-auto w-full">
            {/* Transport */}
            <div className="flex items-center justify-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="default" className="h-10 w-10" onClick={togglePlay} disabled={!isReady || !loadedTitle}>
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Space</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-10 w-10" onClick={stop} disabled={!isReady || !loadedTitle}>
                    <Square className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Stop</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                    size="icon"
                    variant={isLooping ? "default" : "ghost"}
                    className={`h-10 w-10 transition-colors ${
                        isLooping
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => {
                        setIsLooping((v) => !v);
                    }}
                    disabled={!isReady || !loadedTitle}
                    >
                    <RotateCcw className="h-5 w-5" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    {isLooping ? "Replay: On" : "Replay: Off"}
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Time + Timeline */}
            <div className="flex items-center gap-3">
              <div className="text-xs tabular-nums opacity-70 w-14 text-right">{formatTime(positionMs)}</div>
              <Timeline percent={percent} durationMs={durationMs} onSeek={onSeek} disabled={!loadedTitle || !durationMs} />
              <div className="text-xs tabular-nums opacity-70 w-14">{formatTime(durationMs)}</div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
});

AlphaTabPlayer.displayName = "AlphaTabPlayer";
export default AlphaTabPlayer;

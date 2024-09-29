"use client";

import { MediaPlayer, MediaProvider } from "@vidstack/react";
import { useAnalysisStore } from "./store";

export function VideoPlayer() {
  const file = useAnalysisStore((state) => state.file);
  const player = useAnalysisStore((state) => state.player);

  if (!file) return null;

  return (
    <MediaPlayer
      className="w-[48%] aspect-video relative bg-slate-900 text-white shadow overflow-hidden rounded-lg ring-media-focus data-[focus]:ring-4"
      src={{
        src: URL.createObjectURL(file),
        type: "video/mp4",
      }}
      playsInline
      ref={player}
    >
      <MediaProvider></MediaProvider>
    </MediaPlayer>
  );
}

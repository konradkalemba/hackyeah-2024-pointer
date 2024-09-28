"use client";

import { MediaPlayer, MediaProvider } from "@vidstack/react";
import { useAnalysisStore } from "./store";

export function VideoPlayer() {
  const file = useAnalysisStore((state) => state.file);
  const player = useAnalysisStore((state) => state.player);

  if (!file) return null;

  return (
    <MediaPlayer
      className="w-1/2 aspect-video relative bg-slate-900 text-white shadow overflow-hidden rounded-lg ring-media-focus data-[focus]:ring-4"
      src={{
        src: URL.createObjectURL(file),
        type: "video/mp4",
      }}
      playsInline
      ref={player}
    >
      <MediaProvider>
        {/* <Poster
          className="absolute inset-0 block h-full w-full rounded-md opacity-0 transition-opacity data-[visible]:opacity-100 object-cover"
          src="https://files.vidstack.io/sprite-fight/poster.webp"
          alt="Girl walks into campfire with gnomes surrounding her friend ready for their next meal!"
        /> */}
      </MediaProvider>
    </MediaPlayer>
  );
}

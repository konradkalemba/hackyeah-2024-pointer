"use client";

import { useEffect, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import {
  formatTime,
  useMediaRemote,
  useMediaState,
  useSliderPreview,
} from "@vidstack/react";
import { useAnalysisStore } from "./store";

export function TimeSlider() {
  const player = useAnalysisStore((state) => state.player);
  const time = useMediaState("currentTime", player),
    canSeek = useMediaState("canSeek", player),
    duration = useMediaState("duration", player),
    seeking = useMediaState("seeking", player),
    remote = useMediaRemote(player),
    step = (1 / duration) * 100,
    [value, setValue] = useState(0),
    { previewRootRef, previewRef, previewValue } = useSliderPreview({
      clamp: true,
      offset: 6,
      orientation: "horizontal",
    }),
    previewTime = (previewValue / 100) * duration;

  // Keep slider value in-sync with playback.
  useEffect(() => {
    if (seeking) return;
    setValue((time / duration) * 100);
  }, [time, duration]);

  return (
    <Slider.Root
      className="group absolute bottom-0 px-3 inline-flex w-full cursor-pointer touch-none select-none items-center outline-none"
      value={[value]}
      disabled={!canSeek}
      step={Number.isFinite(step) ? step : 1}
      ref={previewRootRef}
      onValueChange={([value]) => {
        setValue(value);
        remote.seeking((value / 100) * duration);
      }}
      onValueCommit={([value]) => {
        remote.seek((value / 100) * duration);
      }}
    >
      <Slider.Track className="h-[5px] w-full rounded-sm bg-white/30 relative">
        <Slider.Range className="bg-blue-400 absolute h-full rounded-sm will-change-[width]" />
      </Slider.Track>

      {/* <Slider.Thumb
        aria-label="Current Time"
        className="block h-[15px] w-[15px] bottom-0 rounded-full border border-blue-200 bg-blue-400 outline-none opacity-0 ring-blue-400/40 transition-opacity group-hocus:opacity-100 focus:opacity-100 focus:ring-4 will-change-[left]"
      /> */}

      <div
        className="flex flex-col items-center justify-center absolute opacity-0 data-[visible]:opacity-100 transition-opacity duration-200 will-change-[left] pointer-events-none bg-neutral-900/50 h-6 tabular-nums rounded-full px-2 text-xs backdrop-blur-xl text-white/90 font-medium"
        ref={previewRef}
      >
        {formatTime(previewTime)}
      </div>
    </Slider.Root>
  );
}

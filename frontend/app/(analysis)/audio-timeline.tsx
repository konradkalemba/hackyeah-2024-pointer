"use client";

import { useAnalysisStore } from "./store";
import { AudioVisualizer } from "react-audio-visualize";
import { useMediaState } from "@vidstack/react";
import { motion } from "framer-motion";

const SECOND_WIDTH = 100;

export function AudioTimeline() {
  const file = useAnalysisStore((state) => state.file);
  const player = useAnalysisStore((state) => state.player);
  const results = useAnalysisStore((state) => state.results);
  const currentTime = useMediaState("currentTime", player);
  const duration = useMediaState("duration", player);

  if (!file) return null;

  return (
    <div className="relative overflow-hidden w-full h-full animate-fade-in">
      <motion.div
        className="h-[64px] relative left-1/2 transition-transform will-change-transform"
        style={{
          transform: `translateX(-${Math.round(currentTime * SECOND_WIDTH)}px)`,
        }}
      >
        <AudioVisualizer
          key={duration}
          blob={file}
          width={duration * SECOND_WIDTH}
          height={64}
          barWidth={2}
          gap={0}
          barColor={"#00000022"}
          style={{ position: "absolute", left: 0, top: 0 }}
        />
        {results.long_pauses.map((pause) => (
          <div
            key={pause.start_time}
            className="absolute top-[50%] -translate-y-[50%] h-2/3 bg-rose-400/20 border border-rose-300 rounded-md px-0.5 hover:bg-rose-200 transition-colors cursor-pointer before:absolute before:inset-0 before:pattern-diagonal-lines before:pattern-rose-400 before:pattern-bg-rose-100 before:pattern-size-8 before:pattern-opacity-10"
            style={{
              left: `${pause.start_time * SECOND_WIDTH}px`,
              width: `${pause.duration * SECOND_WIDTH}px`,
            }}
          >
            <div className="text-xs text-rose-600 font-medium z-20">
              Długa pauza
            </div>
          </div>
        ))}
        {results.quiet_segments.map((segment) => (
          <div
            key={segment.start_time}
            className="absolute top-[50%] -translate-y-[50%] h-2/3 bg-rose-400/20 border border-rose-300 rounded-md px-0.5 hover:bg-rose-200 transition-colors cursor-pointer before:absolute before:inset-0 before:pattern-diagonal-lines before:pattern-rose-400 before:pattern-bg-rose-100 before:pattern-size-8 before:pattern-opacity-10"
            style={{
              left: `${segment.start_time * SECOND_WIDTH}px`,
              width: `${segment.duration * SECOND_WIDTH}px`,
            }}
          >
            <div className="text-xs text-rose-600 font-medium z-20">
              Mówienie zbyt cicho
            </div>
          </div>
        ))}
        {results.loud_segments.map((segment) => (
          <div
            key={segment.start_time}
            className="absolute top-[50%] -translate-y-[50%] h-2/3 bg-rose-400/20 border border-rose-300 rounded-md px-0.5 hover:bg-rose-200 transition-colors cursor-pointer before:absolute before:inset-0 before:pattern-diagonal-lines before:pattern-rose-400 before:pattern-bg-rose-100 before:pattern-size-8 before:pattern-opacity-10"
            style={{
              left: `${segment.start_time * SECOND_WIDTH}px`,
              width: `${segment.duration * SECOND_WIDTH}px`,
            }}
          >
            <div className="text-xs text-rose-600 font-medium z-20">
              Mówienie zbyt głośno
            </div>
          </div>
        ))}
      </motion.div>
      {/* <div className="absolute bottom-0 left-0 h-full flex items-center space-x-2 bg-white/90 backdrop-blur-sm pr-4">
        <Select value="volume">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Wybierz cechę" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="pauses">Pauzy</SelectItem>
              <SelectItem value="volume">Głośność</SelectItem>
              <SelectItem value="pitch">Ton</SelectItem>
              <SelectItem value="speed">Szybkość</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div> */}
    </div>
  );
}

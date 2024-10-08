"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowLineLeft,
  Pause,
  Play,
  SpeakerSimpleHigh,
  SpeakerSimpleSlash,
} from "@phosphor-icons/react/dist/ssr";

import { TimeSlider } from "./time-slider";
import { formatTime, useMediaRemote, useMediaState } from "@vidstack/react";
import { useAnalysisStore } from "./store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ControlsBar() {
  const player = useAnalysisStore((state) => state.player);
  const time = useMediaState("currentTime", player);
  const duration = useMediaState("duration", player);
  const isPaused = useMediaState("paused", player);
  const isMuted = useMediaState("muted", player);
  const remote = useMediaRemote(player);

  return (
    <div className="grid grid-cols-3 gap-4 animate-fade-in h-[64px] bg-neutral-900/80 items-center justify-between rounded-full shadow border border-neutral-200 px-4 py-2 pb-3 relative overflow-hidden">
      <div className="text-accent/80 text-xs font-medium tabular-nums">
        {formatTime(time)} / {formatTime(duration)}
      </div>
      <div className="flex items-center justify-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full hover:bg-accent/10 hover:text-accent text-accent/70"
                onClick={() => remote.seek(0)}
                disabled={time === 0}
              >
                <ArrowLineLeft weight="bold" className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Przewiń do początku</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full"
                onClick={() => (isPaused ? remote.play() : remote.pause())}
              >
                {isPaused ? (
                  <Play weight="bold" className="w-5 h-5" />
                ) : (
                  <Pause weight="bold" className="w-5 h-5" />
                )}
              </Button>
            </TooltipTrigger>{" "}
            <TooltipContent>
              <p>{isPaused ? "Wznów" : "Wstrzymaj"}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full hover:bg-accent/10 hover:text-accent text-accent/70"
                onClick={() => (isMuted ? remote.unmute() : remote.mute())}
              >
                {isMuted ? (
                  <SpeakerSimpleSlash weight="bold" className="w-5 h-5" />
                ) : (
                  <SpeakerSimpleHigh weight="bold" className="w-5 h-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isMuted ? "Odcisz" : "Wycisz"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className=""></div>
      <TimeSlider />
    </div>
  );
}

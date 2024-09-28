"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { AudioVisualization } from "./audio-visualization";
import { ControlsBar } from "./controls-bar";
import { useAnalysisStore } from "./store";
import { VideoPlayer } from "./video-player";
import { SpinnerGap } from "@phosphor-icons/react/dist/ssr";
import { Captions } from "./captions";
import { ReadibilityScore } from "./readibility-score";

export default function Page() {
  const status = useAnalysisStore((state) => state.status);
  const setStatus = useAnalysisStore((state) => state.setStatus);

  useEffect(() => {
    setTimeout(() => {
      setStatus("ready");
    }, 2000);
  }, []);

  return (
    <div className="w-screen grid grid-cols-1 h-screen gap-4 p-6 grid-rows-[1fr_auto_auto_64px] relative">
      {/* <div className="absolute bg-white/90 backdrop-blur-lg left-6 top-6 z-20 w-[340px] shadow-sm border border-neutral-200 rounded-lg py-2 px-3 flex flex-col gap-1">
        <div className="text-accent-foreground/80 text-xs font-medium">
          Podsumowanie
        </div>
        <div className="text-sm">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facilis,
          atque vero voluptas nobis minus natus debitis reiciendis voluptatum
          earum commodi veniam voluptates? Repudiandae asperiores beatae,
          dolores id corrupti velit molestias.
        </div>
      </div> */}
      <div className="flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-radial animate-pulse from-blue-500/30 to-transparent blur-2xl"></div>
        <VideoPlayer />
      </div>
      {status === "ready" ? <Captions /> : null}
      {status === "ready" ? <AudioVisualization /> : null}
      {status === "ready" ? <ReadibilityScore /> : null}
      {status === "ready" ? <ControlsBar /> : null}
      {status === "uploading" && (
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="text-sm text-neutral-600 font-medium flex items-center gap-2">
            <SpinnerGap className="animate-spin w-4 h-4" weight="bold" />{" "}
            Wgrywanie pliku...(60%)
          </div>
          <Button variant="outline">Anuluj</Button>
        </div>
      )}
    </div>
  );
}

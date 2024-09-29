"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { AudioTimeline } from "./audio-timeline";
import { ControlsBar } from "./controls-bar";
import { useAnalysisStore } from "./store";
import { VideoPlayer } from "./video-player";
import { SpinnerGap } from "@phosphor-icons/react/dist/ssr";
import { Captions } from "./captions";
import { ReadibilityScore } from "./panels/readibility-score";
import { Summary } from "./panels/summary";
import { FilePicker } from "./file-picker";
import { Errors } from "./panels/errors";

export default function Page() {
  const status = useAnalysisStore((state) => state.status);
  const setStatus = useAnalysisStore((state) => state.setStatus);

  useEffect(() => {
    if (status === "uploading") {
      setTimeout(() => {
        setStatus("ready");
      }, 2000);
    }
  }, [status]);

  if (status === "empty") {
    return <FilePicker />;
  }

  return (
    <div className="w-screen grid grid-cols-1 h-screen gap-4 p-6 grid-rows-[1fr_auto_auto_64px] relative">
      <div className="flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-radial animate-pulse from-blue-500/30 to-transparent blur-2xl"></div>
        <VideoPlayer />
      </div>
      {status === "ready" ? (
        <>
          <div className="absolute animate-fade-in flex flex-col gap-4 left-6 top-6 z-20 w-[340px]">
            <Errors />
            <Summary />
          </div>
          <Captions />
          <AudioTimeline />
          <ReadibilityScore />
          <ControlsBar />
        </>
      ) : null}
      {status === "uploading" && (
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="text-sm text-neutral-600 font-medium flex items-center gap-2">
            <SpinnerGap className="animate-spin w-4 h-4" weight="bold" />{" "}
            Wgrywanie pliku...(60%)
          </div>
          <Button variant="outline" onClick={() => setStatus("empty")}>
            Anuluj
          </Button>
        </div>
      )}
    </div>
  );
}

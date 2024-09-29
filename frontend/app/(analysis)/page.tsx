"use client";

import { useRef, useState } from "react";
import axios, { AxiosProgressEvent } from "axios";
import { env } from "@/env";
import MotionNumber from "motion-number";
import { SpinnerGap } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { AudioTimeline } from "./audio-timeline";
import { ControlsBar } from "./controls-bar";
import { useAnalysisStore } from "./store";
import { VideoPlayer } from "./video-player";
import { Captions } from "./captions";
import { ReadibilityScore } from "./panels/readibility-score";
import { Summary } from "./panels/summary";
import { FilePicker } from "./file-picker";
import { Errors } from "./panels/errors";

export default function Page() {
  const status = useAnalysisStore((state) => state.status);
  const setStatus = useAnalysisStore((state) => state.setStatus);
  const setResults = useAnalysisStore((state) => state.setResults);
  const abortController = useRef<AbortController>();
  const [fileProgress, setFileProgress] = useState(0);

  useAnalysisStore.subscribe(async (state) => {
    if (state.status === "before-upload") {
      abortController.current = new AbortController();

      setStatus("uploading");

      const formData = new FormData();
      formData.append("file", state.file as Blob);

      const request = await axios.post(
        `${env.NEXT_PUBLIC_API_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            const newProgress =
              progressEvent.loaded / (progressEvent.total || 1);
            setFileProgress(newProgress);
            if (newProgress === 1) {
              setStatus("processing");
            }
          },
          signal: abortController.current.signal,
        }
      );

      const json = request.data;

      setResults(json);
      setStatus("ready");
    }
  });

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
          <div className="absolute animate-fade-in flex flex-col gap-4 right-6 top-6 z-20 w-[340px]">
            <ReadibilityScore />
          </div>
          <Captions />
          <AudioTimeline />
          <ControlsBar />
        </>
      ) : null}
      {(status === "uploading" || status === "processing") && (
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="text-sm text-neutral-600 font-medium flex items-center gap-2">
            <SpinnerGap className="animate-spin w-4 h-4" weight="bold" />{" "}
            {status === "uploading" ? (
              <>
                Wgrywanie pliku...{" "}
                <MotionNumber
                  value={fileProgress}
                  format={{
                    notation: "compact",
                    style: "percent",
                  }}
                />
              </>
            ) : (
              "Przetwarzanie wideo..."
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => {
              abortController.current?.abort();
              setStatus("empty");
            }}
          >
            Anuluj
          </Button>
        </div>
      )}
    </div>
  );
}

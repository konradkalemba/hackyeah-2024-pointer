import { MediaPlayerInstance } from "@vidstack/react";
import { createRef, RefObject } from "react";
import { create } from "zustand";

interface AnalysisState {
  status: "uploading" | "processing" | "ready";
  setStatus: (status: "uploading" | "processing" | "ready") => void;
  file?: File;
  setFile: (file: File) => void;
  player: RefObject<MediaPlayerInstance>;
}

export const useAnalysisStore = create<AnalysisState>()((set) => ({
  status: "uploading",
  player: createRef<MediaPlayerInstance>(),
  setFile: (file: File) => set({ file }),
  setStatus: (status: "uploading" | "processing" | "ready") => set({ status }),
}));

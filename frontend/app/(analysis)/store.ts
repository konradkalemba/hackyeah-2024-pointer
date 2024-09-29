import { MediaPlayerInstance } from "@vidstack/react";
import { createRef, RefObject } from "react";
import { create } from "zustand";

type Status = "empty" | "before-upload" | "uploading" | "processing" | "ready";

interface AnalysisState {
  status: Status;
  setStatus: (status: Status) => void;
  results?: {
    long_pauses: {
      start_time: number;
      end_time: number;
      duration: number;
    }[];
    quiet_segments: {
      start_time: number;
      end_time: number;
      duration: number;
    }[];
    loud_segments: {
      start_time: number;
      end_time: number;
      duration: number;
    }[];
    readability_score: number;
    words: {
      word: string;
      start_time: number;
      end_time: number;
      syllable_count: number;
    }[];
    repetitions: number[];
    topic_changes: number[];
    jargon: string[];
    nonexistent_words: string[];
    non_polish_language: string[];
    passive_voice: string[];
  };
  setResults: (results: AnalysisState["results"]) => void;
  file?: File;
  setFile: (file: File) => void;
  player: RefObject<MediaPlayerInstance>;
}

export const useAnalysisStore = create<AnalysisState>()((set) => ({
  status: "empty",
  player: createRef<MediaPlayerInstance>(),
  setFile: (file: File) => set({ file, status: "before-upload" }),
  setResults: (results: AnalysisState["results"]) => set({ results }),
  setStatus: (status: Status) => set({ status }),
}));

import { MediaPlayerInstance } from "@vidstack/react";
import { createRef, RefObject } from "react";
import { create } from "zustand";

type Status = "empty" | "before-upload" | "uploading" | "processing" | "ready";

interface AnalysisState {
  status: Status;
  setStatus: (status: Status) => void;
  results: {
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
  results: {
    long_pauses: [
      {
        start_time: 0.0,
        end_time: 11.517097505668934,
        duration: 11.517097505668934,
      },
    ],
    quiet_segments: [
      {
        start_time: 20.0,
        end_time: 25.0,
        duration: 5.0,
      },
    ],
    loud_segments: [],
    readability_score: 21.4,
    words: [
      {
        word: "Wydatkowaniu",
        start_time: 18.52,
        end_time: 19.84,
        syllable_count: 5,
      },
      {
        word: "środków",
        start_time: 19.84,
        end_time: 21.16,
        syllable_count: 2,
      },
      {
        word: "publicznych",
        start_time: 21.16,
        end_time: 23.42,
        syllable_count: 3,
      },
      {
        word: "udzielono",
        start_time: 23.42,
        end_time: 24.26,
        syllable_count: 3,
      },
      {
        word: "dotacji",
        start_time: 24.26,
        end_time: 24.66,
        syllable_count: 3,
      },
      {
        word: "podmiotów,",
        start_time: 24.66,
        end_time: 25.16,
        syllable_count: 4,
      },
      { word: "które", start_time: 25.24, end_time: 25.32, syllable_count: 2 },
      { word: "nie", start_time: 25.32, end_time: 25.58, syllable_count: 1 },
      {
        word: "spełniały",
        start_time: 25.58,
        end_time: 26.24,
        syllable_count: 3,
      },
      {
        word: "kryteriów",
        start_time: 26.24,
        end_time: 27.02,
        syllable_count: 3,
      },
      {
        word: "konkursowych,",
        start_time: 27.02,
        end_time: 28.52,
        syllable_count: 5,
      },
      { word: "które", start_time: 28.52, end_time: 29.52, syllable_count: 2 },
      { word: "nie", start_time: 29.52, end_time: 29.72, syllable_count: 1 },
      {
        word: "spełniały",
        start_time: 29.72,
        end_time: 30.12,
        syllable_count: 3,
      },
      {
        word: "kryteriów",
        start_time: 30.12,
        end_time: 30.58,
        syllable_count: 3,
      },
      {
        word: "konkursowych.",
        start_time: 30.58,
        end_time: 31.22,
        syllable_count: 4,
      },
    ],
    repetitions: [4],
    topic_changes: [2],
    jargon: ["blockchain"],
    nonexistent_words: ["nie"],
    non_polish_language: ["kryteriów"],
    passive_voice: ["udzielono"],
  },
  setResults: (results: AnalysisState["results"]) => set({ results }),
  setStatus: (status: Status) => set({ status }),
}));

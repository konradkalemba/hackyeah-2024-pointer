"use client";

import { Dropzone } from "@/components/dropzone";
import { useAnalysisStore } from "./store";

export function FilePicker() {
  const setFile = useAnalysisStore((state) => state.setFile);

  return (
    <div className="container mx-auto min-h-screen flex flex-col items-center justify-center gap-10 pt-16">
      <div className="flex flex-col items-center justify-center gap-3">
        <h1 className="text-4xl font-medium">Analizuj wideo</h1>
        <h2 className="text-lg text-neutral-600">
          Wybierz plik wideo do oceny jakości wypowiedzi
        </h2>
      </div>

      <Dropzone onFileSelect={(file) => setFile(file)} />
    </div>
  );
}

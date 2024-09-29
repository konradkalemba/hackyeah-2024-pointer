import { useMediaState } from "@vidstack/react";
import { useAnalysisStore } from "../store";
import MotionNumber from "motion-number";

export function ReadibilityScore() {
  const results = useAnalysisStore((state) => state.results);
  const player = useAnalysisStore((state) => state.player);
  const currentTime = useMediaState("currentTime", player);

  return (
    <div className="absolute animate-fade-in bg-white/90 backdrop-blur-lg right-6 top-6 z-20 w-[340px] shadow-sm border border-neutral-200 rounded-lg p-2 flex flex-col gap-1">
      <div className="text-accent-foreground/80 text-xs font-medium">
        Ocena prostości języka
      </div>
      <div className="text-5xl text-center text-yellow-500 my-2">
        {results.readability_score}
      </div>
      <div className="text-xs text-center text-neutral-600">
        Współczynnik mglistości Gunninga
      </div>
      <div className="mt-2 pt-2 border-t grid grid-cols-2 border-neutral-200">
        <div className="flex flex-col items-center gap-1">
          <div className="text-2xl text-center text-blue-500 my-1">
            <MotionNumber
              value={results.words.reduce(
                (acc, word) => acc + (currentTime > word.start_time ? 1 : 0),
                0
              )}
            />
          </div>
          <div className="text-neutral-600 text-xs">Liczba słów</div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="text-2xl text-center text-blue-500 my-1">2</div>
          <div className="text-neutral-600 text-xs">Liczba zdań</div>
        </div>
      </div>
    </div>
  );
}

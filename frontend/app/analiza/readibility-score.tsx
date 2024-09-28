import { useAnalysisStore } from "./store";

export function ReadibilityScore() {
  const results = useAnalysisStore((state) => state.results);

  return (
    <div className="absolute bg-white/90 backdrop-blur-lg right-6 top-6 z-20 w-[340px] shadow-sm border border-neutral-200 rounded-lg p-2 flex flex-col gap-1">
      <div className="text-accent-foreground/80 text-xs font-medium">
        Ocena prostości języka
      </div>
      <div className="text-5xl text-center text-yellow-500 my-2">
        {results.readability_score}
      </div>
      <div className="text-xs text-center text-neutral-600">
        Współczynnik mglistości Gunninga
      </div>
    </div>
  );
}

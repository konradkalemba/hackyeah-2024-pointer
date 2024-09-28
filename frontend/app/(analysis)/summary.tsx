import { useAnalysisStore } from "./store";

export function Summary() {
  const results = useAnalysisStore((state) => state.results);

  return (
    <div className="absolute animate-fade-in bg-white/90 backdrop-blur-lg left-6 top-6 z-20 w-[340px] shadow-sm border border-neutral-200 rounded-lg py-2 px-3 flex flex-col gap-1">
      <div className="text-accent-foreground/80 text-xs font-medium">
        Podsumowanie
      </div>
      <div className="text-sm">
        {results.words.map((word) => word.word).join(" ")}
      </div>
    </div>
  );
}

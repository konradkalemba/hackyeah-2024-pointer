import { useAnalysisStore } from "./store";

export function Errors() {
  const results = useAnalysisStore((state) => state.results);

  return (
    <div className="bg-white/90 backdrop-blur-lg shadow-sm border border-neutral-200 rounded-lg py-2 px-3 flex flex-col gap-1">
      <div className="text-accent-foreground/80 text-xs font-medium">
        Znalezione modyfikacje
      </div>
      <div className="flex">
        <div className="bg-neutral-200 px-2 py-1 shadow-sm rounded-full border border-neutral-300 text-sm">
          Mówienie zbyt głośno
        </div>
      </div>
    </div>
  );
}

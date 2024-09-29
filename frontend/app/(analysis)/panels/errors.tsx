import { Button } from "@/components/ui/button";
import { useAnalysisStore } from "../store";
import { formatTime, useMediaRemote } from "@vidstack/react";

function TimeMarker({ time }: { time: number }) {
  const player = useAnalysisStore((state) => state.player);
  const remote = useMediaRemote(player);

  return (
    <Button
      variant="ghost"
      className="px-1 h-auto py-0.5 text-blue-600 hover:bg-blue-600/10 hover:text-blue-600 rounded-full"
      size="sm"
      onClick={() => remote.seek(time)}
    >
      {formatTime(time)}
    </Button>
  );
}

export function Errors() {
  const results = useAnalysisStore((state) => state.results);

  return (
    <div className="bg-white/90 backdrop-blur-lg shadow-sm border border-neutral-200 rounded-lg py-2 px-3 flex flex-col gap-1">
      <div className="text-accent-foreground/80 text-xs font-medium">
        Znalezione modyfikacje
      </div>
      <div className="flex">
        <div className="bg-neutral-200 px-2 py-1 shadow-sm rounded-full border border-neutral-300 text-sm">
          Mówienie zbyt głośno <TimeMarker time={28} />
        </div>
      </div>
    </div>
  );
}

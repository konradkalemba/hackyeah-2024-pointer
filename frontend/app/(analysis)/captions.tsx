import { formatTime, useMediaState } from "@vidstack/react";
import { useAnalysisStore } from "./store";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Fragment, useState } from "react";
import { Swap } from "@phosphor-icons/react/dist/ssr";
import { SECOND_WIDTH } from "@/lib/config";

export function Captions() {
  const player = useAnalysisStore((state) => state.player);
  const results = useAnalysisStore((state) => state.results);
  const currentTime = useMediaState("currentTime", player);

  return (
    <div className="bg-neutral-100 animate-fade-in rounded-xl h-[64px] gap-1 flex flex-wrap items-center justify-center w-full relative shadow border border-neutral-200 text-center overflow-hidden">
      <motion.div
        className="relative w-full h-full left-1/2 transition-transform py-2 px-3 will-change-transform"
        style={{
          transform: `translateX(-${Math.round(currentTime * SECOND_WIDTH)}px)`,
        }}
      >
        {results?.words.map((word, index) => {
          const isJargon = results?.jargon?.includes(word.word.toLowerCase());
          const isNonPolishLanguage = results?.non_polish_language?.includes(
            word.word.toLowerCase()
          );
          const isPassiveVoice = results?.passive_voice?.includes(
            word.word.toLowerCase()
          );
          const isNonexistentWord = results?.nonexistent_words?.includes(
            word.word.toLowerCase()
          );
          const isRepetition = results?.repetitions?.includes(index);
          const isError =
            isJargon ||
            isNonPolishLanguage ||
            isPassiveVoice ||
            isNonexistentWord ||
            isRepetition;

          const component = (
            <div
              className={cn(
                "absolute border rounded-md px-0.5 top-1/2 overflow-hidden transition-opacity",
                isError
                  ? "bg-rose-100 border-rose-300 hover:bg-rose-200 text-rose-700 before:absolute before:inset-0 before:pattern-diagonal-lines before:pattern-rose-400 before:pattern-bg-rose-100 before:pattern-size-8 before:pattern-opacity-10"
                  : "bg-neutral-900/10 border-neutral-150"
              )}
              style={{
                transform: `translateX(${
                  word.start_time * SECOND_WIDTH
                }px) translateY(-50%)`,
                width: `${(word.end_time - word.start_time) * SECOND_WIDTH}px`,
                opacity: currentTime > word.start_time ? 1 : 0.5,
              }}
            >
              {word.word}
            </div>
          );

          if (isError) {
            return (
              <ErrorPopover
                key={index}
                time={word.start_time}
                currentTime={currentTime}
                description={[
                  isJargon && "Żargon",
                  isNonPolishLanguage && "Obcy język",
                  isPassiveVoice && "Strona bierna",
                  isNonexistentWord && "Nieistniejące słowo",
                  isRepetition && "Powtórzenie",
                ]
                  .filter(Boolean)
                  .join(", ")}
              >
                {component}
              </ErrorPopover>
            );
          }

          return <Fragment key={index}>{component}</Fragment>;
        })}
        {results?.topic_changes?.map((topicChange, index) => (
          <ErrorPopover
            key={index}
            time={results.words[topicChange]?.start_time}
            currentTime={currentTime}
            description={"Zmiana tematu"}
          >
            <div
              key={index}
              className="top-[1px] bg-rose-600 w-4 h-4 flex items-center transition-opacity justify-center rounded-full absolute"
              style={{
                transform: `translateX(${
                  results.words[topicChange]?.start_time * SECOND_WIDTH
                }px)`,
                opacity:
                  currentTime > results.words[topicChange]?.start_time
                    ? 1
                    : 0.5,
              }}
            >
              <Swap className="w-3 h-3 text-rose-50" weight="bold" />
            </div>
          </ErrorPopover>
        ))}
      </motion.div>
    </div>
  );
}

function ErrorPopover({
  time,
  currentTime,
  description,
  children,
}: {
  time: number;
  currentTime: number;
  description: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover
      open={isOpen || (currentTime > time && currentTime < time + 1)}
      onOpenChange={setIsOpen}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent side="top" className="w-[200px] flex flex-col gap-1">
        <p className="text-xs font-medium text-rose-600">Błąd</p>
        <p className="text-sm">{description}</p>
        <p className="text-xs text-neutral-500 tabular-nums">
          {formatTime(time)}
        </p>
      </PopoverContent>
    </Popover>
  );
}

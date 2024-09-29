import { formatTime, useMediaRemote, useMediaState } from "@vidstack/react";
import { useAnalysisStore } from "./store";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Fragment, useState } from "react";

const SECOND_WIDTH = 100;

export function Captions() {
  const player = useAnalysisStore((state) => state.player);
  const results = useAnalysisStore((state) => state.results);
  const currentTime = useMediaState("currentTime", player);

  return (
    <div className="bg-neutral-100 animate-fade-in rounded-xl h-[64px] gap-1 flex flex-wrap py-2 px-3 items-center justify-center w-full relative shadow border border-neutral-200 text-center overflow-hidden">
      {/* <div className="absolute left-1/2 -translate-x-full w-[100px] h-full bg-gradient-to-r from-transparent to-blue-400/20 border-r-2 border-blue-400 z-20"></div> */}
      <motion.div
        className="relative w-full h-5 left-1/2 transition-transform will-change-transform"
        style={{
          transform: `translateX(-${Math.round(currentTime * SECOND_WIDTH)}px)`,
        }}
      >
        {results.words.map((word, index) => {
          const isJargon = results.jargon.includes(word.word.toLowerCase());
          const isNonPolishLanguage = results.non_polish_language.includes(
            word.word.toLowerCase()
          );
          const isPassiveVoice = results.passive_voice.includes(
            word.word.toLowerCase()
          );
          const isNonexistentWord = results.nonexistent_words.includes(
            word.word.toLowerCase()
          );
          const isError =
            isJargon ||
            isNonPolishLanguage ||
            isPassiveVoice ||
            isNonexistentWord;

          const component = (
            <div
              className={cn(
                "absolute border rounded-md px-0.5 overflow-hidden transition-opacity",
                isError
                  ? "bg-rose-100 border-rose-300 hover:bg-rose-200 text-rose-700 before:absolute before:inset-0 before:pattern-diagonal-lines before:pattern-rose-400 before:pattern-bg-rose-100 before:pattern-size-8 before:pattern-opacity-10"
                  : "bg-neutral-900/10 border-neutral-150"
              )}
              style={{
                transform: `translateX(${word.start_time * SECOND_WIDTH}px)`,
                width: `${(word.end_time - word.start_time) * SECOND_WIDTH}px`,
                opacity: currentTime > word.start_time ? 1 : 0.5,
              }}
            >
              {word.word}
            </div>
          );

          if (isError) {
            return (
              <ErrorCaption
                key={index}
                word={word}
                currentTime={currentTime}
                isJargon={isJargon}
                isNonPolishLanguage={isNonPolishLanguage}
                isPassiveVoice={isPassiveVoice}
                isNonexistentWord={isNonexistentWord}
              >
                {component}
              </ErrorCaption>
            );
          }

          return <Fragment key={index}>{component}</Fragment>;
        })}
      </motion.div>
    </div>
  );
}

function ErrorCaption({
  word,
  currentTime,
  isJargon,
  isNonPolishLanguage,
  isPassiveVoice,
  isNonexistentWord,
  children,
}: {
  word: {
    start_time: number;
    end_time: number;
    word: string;
  };
  currentTime: number;
  isJargon: boolean;
  isNonPolishLanguage: boolean;
  isPassiveVoice: boolean;
  isNonexistentWord: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover
      open={
        isOpen ||
        (currentTime > word.start_time && currentTime < word.start_time + 1)
      }
      onOpenChange={setIsOpen}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent side="top" className="w-[200px] flex flex-col gap-1">
        <p className="text-xs font-medium text-rose-600">Błąd</p>
        <p className="text-sm">
          {[
            isJargon && "Żargon",
            isNonPolishLanguage && "Obcy język",
            isPassiveVoice && "Strona bierna",
            isNonexistentWord && "Nieistniejące słowo",
          ]
            .filter(Boolean)
            .join(", ")}
        </p>
        <p className="text-xs text-neutral-500 tabular-nums">
          {formatTime(word.start_time)}
        </p>
      </PopoverContent>
    </Popover>
  );
}

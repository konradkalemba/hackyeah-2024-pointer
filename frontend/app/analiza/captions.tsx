import { useMediaState } from "@vidstack/react";
import { useAnalysisStore } from "./store";
import { motion } from "framer-motion";

const SECOND_WIDTH = 100;

export function Captions() {
  const player = useAnalysisStore((state) => state.player);
  const words = useAnalysisStore((state) => state.results.words);
  const currentTime = useMediaState("currentTime", player);

  return (
    <div className="bg-neutral-100 rounded-xl h-[80px] gap-1 flex flex-wrap py-2 px-3 items-center justify-center w-full relative shadow border border-neutral-200 text-center overflow-hidden">
      {/* <div className="absolute left-1/2 -translate-x-full w-[100px] h-full bg-gradient-to-r from-transparent to-blue-400/20 border-r-2 border-blue-400"></div> */}
      <motion.div
        className="relative w-full h-5 left-1/2 transition-transform will-change-transform"
        style={{
          transform: `translateX(-${Math.round(currentTime * SECOND_WIDTH)}px)`,
        }}
      >
        {words.map((word, index) => {
          return (
            <div
              key={index}
              className="absolute bg-neutral-900/10 border border-neutral-150 rounded-md px-0.5 overflow-hidden transition-opacity"
              style={{
                transform: `translateX(${word.start_time * SECOND_WIDTH}px)`,
                width: `${(word.end_time - word.start_time) * SECOND_WIDTH}px`,
                opacity: currentTime > word.start_time ? 1 : 0.5,
              }}
            >
              {word.word}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

{
  /* <span>Komisarz</span> <span>Unii</span> <span>Europejskiej</span>{" "}
<span>ds.</span>{" "}
<span className="bg-rose-100 border border-rose-300 rounded-md px-0.5 hover:bg-rose-200 transition-colors cursor-pointer text-rose-700">
  stabilności
</span>{" "}
<span className="opacity-75">finansowej</span>
<span className="opacity-50">usług</span>
<span className="opacity-25">finansowych</span> */
}

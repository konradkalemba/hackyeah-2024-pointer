import { useMediaState } from "@vidstack/react";
import { useAnalysisStore } from "./store";

const CAPTIONS = [
  {
    time: 0,
    text: "Komisarz",
  },
  {
    time: 1,
    text: "Unii",
  },
  {
    time: 2,
    text: "Europejskiej",
  },
  {
    time: 3,
    text: "ds.",
  },
  {
    time: 4,
    text: "stabilności",
  },
  {
    time: 5,
    text: "finansowej",
  },
  {
    time: 6,
    text: "usług",
  },
  {
    time: 7,
    text: "finansowych",
  },
];

export function Captions() {
  const player = useAnalysisStore((state) => state.player);
  const currentTime = useMediaState("currentTime", player);

  return (
    <div className="bg-neutral-100 rounded-xl h-[80px] gap-1 flex flex-wrap py-2 px-3 items-center justify-center w-full relative shadow border border-neutral-200 text-center">
      {CAPTIONS.map((caption, index) => {
        if (currentTime < caption.time) return null;
        return (
          <span key={index} className="animate-fade-in">
            {caption.text}
          </span>
        );
      })}
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

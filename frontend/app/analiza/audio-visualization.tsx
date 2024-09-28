"use client";

import { useAnalysisStore } from "./store";
import { AudioVisualizer } from "react-audio-visualize";
import { useRef, useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AudioVisualization() {
  const file = useAnalysisStore((state) => state.file);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          setDimensions({ width, height });
        }
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  if (!file) return null;

  return (
    <div
      // className="w-full h-20 bg-neutral-100 rounded-xl overflow-hidden"
      className="relative"
    >
      <div ref={containerRef} className="h-[64px]">
        <AudioVisualizer
          key={dimensions.width}
          blob={file}
          width={dimensions.width}
          height={dimensions.height}
          barWidth={2}
          gap={0}
          barColor={"#00000022"}
        />
      </div>

      <div className="absolute bottom-0 left-0 h-full flex items-center space-x-2">
        <Select value="volume">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Wybierz cechę" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="pauses">Pauzy</SelectItem>
              <SelectItem value="volume">Głośność</SelectItem>
              <SelectItem value="pitch">Ton</SelectItem>
              <SelectItem value="speed">Szybkość</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

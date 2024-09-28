"use client";

import { useCallback } from "react";

export function VideoThumbnail({ file }: { file: File }) {
  const setTime = useCallback((node: HTMLVideoElement) => {
    if (node) {
      try {
        // Set time for better thumbnail
        node.currentTime = 10;
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <video
      className="w-full aspect-square object-cover rounded-xl"
      src={URL.createObjectURL(file)}
      ref={setTime}
    />
  );
}

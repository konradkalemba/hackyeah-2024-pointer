"use client";

import { useDropzone } from "react-dropzone";
import { BorderBeam } from "./ui/border-beam";
import { VideoThumbnail } from "./video-thumbnail";

export function Dropzone({ children }: { children: React.ReactNode }) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  return (
    <div
      {...getRootProps({
        className:
          "bg-neutral-100 rounded-xl h-[200px] flex flex-col items-center justify-center w-2/3 relative shadow border border-neutral-200",
      })}
    >
      <BorderBeam />
      <input {...getInputProps()} />

      <div className="absolute left-2 top-2 grid grid-cols-6 gap-2">
        {acceptedFiles.map((file) => (
          <div
            key={file.name}
            className="bg-neutral-200 rounded-2xl flex items-center shadow-sm relative"
          >
            <VideoThumbnail file={file} />
            <div className="absolute top-1 max-w-[80%] left-1/2 -translate-x-1/2 bg-neutral-900/60 rounded-full px-3 text-xs backdrop-blur-lg text-white/90 font-medium h-5 flex items-center line-clamp-1 justify-center text-ellipsis overflow-hidden">
              {file.name}
            </div>
          </div>
        ))}
      </div>

      <p className="text-neutral-500 text-sm font-medium">
        Przeciągnij i upuść plik wideo, lub kliknij, aby wybrać plik
      </p>

      {children}
    </div>
  );
}

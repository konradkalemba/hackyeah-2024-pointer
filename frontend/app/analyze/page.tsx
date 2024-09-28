import { Dropzone } from "@/components/dropzone";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export default function Page() {
  return (
    <div className="container mx-auto min-h-screen flex flex-col items-center justify-center gap-10 pt-16">
      <div className="flex flex-col items-center justify-center gap-3">
        <h1 className="text-4xl font-medium">Analizuj wideo</h1>
        <h2 className="text-lg text-neutral-600">
          Wybierz plik wideo do oceny jakości wypowiedzi
        </h2>
      </div>
      <Dropzone>
        <Button size="lg" className="absolute right-1.5 bottom-1.5 gap-2 px-5">
          Analizuj <ArrowRight weight="bold" className="w-4 h-4" />
        </Button>
      </Dropzone>
    </div>
  );
}

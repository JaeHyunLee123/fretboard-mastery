"use client";

import { Tuner } from "@/components/Tuner";
import { TrainingArea } from "@/components/TrainingArea";
import { AdsPlaceholder } from "@/components/AdsPlaceholder";
import { Toggle } from "@/components/commons/Toggle";
import { AudioProvider } from "@/hooks/useAudio";
import { DeviceConnector } from "@/components/DeviceConnector";
import { usePracticeStore } from "@/store/usePracticeStore";
import { PlayingNoteCard } from "@/components/PlayingNoteCard";

export default function Home() {
  const { instrument, setInstrument } = usePracticeStore();

  return (
    <AudioProvider>
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8">
        {/* Header & Main Toggles */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-on-surface text-3xl font-bold tracking-tight">
            Fretboard Master
          </h1>
          <div className="flex items-center gap-4">
            <DeviceConnector />
            <div className="bg-surface-container-highest inline-flex rounded-full p-1">
              <Toggle
                pressed={instrument === "guitar"}
                onPressedChange={() => setInstrument("guitar")}
              >
                Guitar
              </Toggle>
              <Toggle
                pressed={instrument === "bass"}
                onPressedChange={() => setInstrument("bass")}
              >
                Bass
              </Toggle>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col gap-8 lg:flex-row">
          {/* Left Column: Tuner & Ads */}
          <div className="flex shrink-0 flex-col gap-8 lg:w-1/3">
            <Tuner />
            <PlayingNoteCard />
            <AdsPlaceholder adSlot="4048945896" />
          </div>

          {/* Right Column: Training Area */}
          <div className="flex h-full flex-1 flex-col">
            <TrainingArea />
          </div>
        </div>
      </main>
    </AudioProvider>
  );
}

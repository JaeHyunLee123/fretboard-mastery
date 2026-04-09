"use client";

import { usePracticeStore } from "@/store/usePracticeStore";
import { cn } from "@/libs/utils";

export function PlayingNoteCard() {
  const { currentPitchNote, currentPitchOctave, isIncorrect, status } = usePracticeStore();

  return (
    <div className="bg-surface-container-low flex flex-col items-center justify-center rounded-3xl p-6 transition-all duration-300">
      <span className="text-on-surface-variant font-label mb-2 text-xs font-bold uppercase tracking-widest">
        Live Pitch
      </span>
      {currentPitchNote ? (
        <div
          className={cn(
            "font-display flex items-baseline gap-1 text-6xl font-black transition-colors duration-300",
            isIncorrect ? "text-error drop-shadow-[0_0_8px_rgba(244,67,54,0.4)]" : "text-primary"
          )}
        >
          {currentPitchNote}
          <sub className="text-on-surface-variant text-2xl font-bold opacity-70">
            {currentPitchOctave}
          </sub>
        </div>
      ) : (
        <div className="text-on-surface-variant font-body animate-pulse py-4 text-sm italic">
          Waiting for sound...
        </div>
      )}
      {isIncorrect && (
        <span className="text-error font-label mt-2 text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2">
          Incorrect Note
        </span>
      )}
    </div>
  );
}

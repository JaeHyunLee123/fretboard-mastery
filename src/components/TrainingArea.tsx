"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/commons/Card";
import { Toggle } from "@/components/commons/Toggle";
import { NoteDisplay } from "@/components/NoteDisplay";
import { usePracticeStore } from "@/store/usePracticeStore";
import { cn } from "@/libs/utils";

type DisplayMode = "alphabet" | "tab" | "staff";

export function TrainingArea() {
  const [displayModes, setDisplayModes] = useState<DisplayMode[]>(["alphabet"]);
  const {
    targetNote,
    status,
    setStatus,
    generateNextNote,
    currentPitchNote,
    currentPitchOctave,
    setIsIncorrect,
  } = usePracticeStore();
  const [successAnim, setSuccessAnim] = useState(false);
  const [errorAnim, setErrorAnim] = useState(false);

  // 1. Match Detection Effect
  useEffect(() => {
    if (status !== "listening" || !targetNote) return;

    // Correct match
    if (currentPitchNote === targetNote.noteName && currentPitchOctave === targetNote.octave) {
      setStatus("success");
      setSuccessAnim(true);
      setErrorAnim(false);
      setIsIncorrect(false);
      return;
    }

    // Incorrect note (only trigger if there's an actual detected note)
    if (
      currentPitchNote &&
      (currentPitchNote !== targetNote.noteName || currentPitchOctave !== targetNote.octave)
    ) {
      setErrorAnim(true);
      setIsIncorrect(true);
      const timer = setTimeout(() => {
        setErrorAnim(false);
        setIsIncorrect(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPitchNote, currentPitchOctave, targetNote, status, setStatus, setIsIncorrect]);

  // 2. Success Transition Effect (Handles automatic progression)
  useEffect(() => {
    if (status !== "success") return;

    const timer = setTimeout(() => {
      setSuccessAnim(false);
      generateNextNote(); // This sets status back to "listening"
    }, 1000); // 1.0s for a snappier rhythm

    return () => clearTimeout(timer);
  }, [status, generateNextNote]);

  return (
    <Card
      className={cn(
        "relative flex h-full flex-col overflow-hidden transition-all duration-500",
        successAnim ? "bg-primary/20 border-primary/50 shadow-[0_0_32px_rgba(74,222,128,0.3)]" : "",
        errorAnim ? "bg-error/10 border-error/50 shadow-[0_0_32px_rgba(244,67,54,0.2)]" : ""
      )}
    >
      <div className="border-outline-variant/30 relative z-20 flex items-center justify-between border-b p-6">
        <h2 className="font-display text-on-surface text-xl font-bold tracking-tight">
          Single Note Practice
        </h2>

        {/* Toggle options for Alphabet / Tab / Staff */}
        <div className="bg-surface-container-highest inline-flex items-center gap-1 rounded-full p-1">
          <Toggle
            pressed={displayModes.includes("alphabet")}
            onPressedChange={(p) =>
              setDisplayModes((prev) =>
                p ? [...prev, "alphabet"] : prev.filter((m) => m !== "alphabet")
              )
            }
          >
            Alpha
          </Toggle>
          <Toggle
            pressed={displayModes.includes("tab")}
            onPressedChange={(p) =>
              setDisplayModes((prev) => (p ? [...prev, "tab"] : prev.filter((m) => m !== "tab")))
            }
          >
            Tab
          </Toggle>
          <Toggle
            pressed={displayModes.includes("staff")}
            onPressedChange={(p) =>
              setDisplayModes((prev) =>
                p ? [...prev, "staff"] : prev.filter((m) => m !== "staff")
              )
            }
          >
            Staff
          </Toggle>
        </div>
      </div>

      <div className="relative z-10 flex min-h-[300px] flex-1 flex-col items-center justify-center">
        {status === "idle" ? (
          <div className="flex flex-col items-center gap-6">
            <p className="text-on-surface-variant font-body mb-4 text-center">
              Connect your instrument and press start <br /> to begin practice.
            </p>
            <button
              onClick={generateNextNote}
              className="bg-primary text-on-primary font-label rounded-full px-8 py-3 text-lg font-bold shadow-sm transition-transform hover:scale-105 active:scale-95"
            >
              Start Practice
            </button>
          </div>
        ) : (
          <NoteDisplay
            displayModes={displayModes}
            status={successAnim ? "success" : errorAnim ? "error" : "idle"}
          />
        )}
      </div>

      {/* Visual Feedback Overlay */}
      {successAnim && (
        <div className="bg-primary/5 animate-in fade-in pointer-events-none absolute inset-0 z-0 flex items-center justify-center duration-300">
          <div className="text-primary font-display animate-in slide-in-from-bottom-4 text-4xl font-bold tracking-widest drop-shadow-md">
            CORRECT!
          </div>
        </div>
      )}

    </Card>
  );
}

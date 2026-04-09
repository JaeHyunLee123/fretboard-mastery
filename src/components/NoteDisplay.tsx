"use client";

import { useEffect, useRef } from "react";
import {
  Renderer,
  Stave,
  StaveNote,
  Voice,
  Formatter,
  TabStave,
  TabNote,
  Accidental,
} from "vexflow";
import { usePracticeStore } from "@/store/usePracticeStore";
import { cn } from "@/libs/utils";

type DisplayMode = "alphabet" | "tab" | "staff";

interface NoteDisplayProps {
  displayModes: DisplayMode[];
  status?: "success" | "error" | "idle";
}

export function NoteDisplay({ displayModes, status = "idle" }: NoteDisplayProps) {
  const { targetNote, instrument } = usePracticeStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous render
    containerRef.current.innerHTML = "";

    if (!targetNote) return;

    // 고정 크기 (추후 ResizeObserver 등으로 변경 기틀 마련)
    const width = 340;
    const height =
      (displayModes.includes("staff") ? 130 : 0) + (displayModes.includes("tab") ? 130 : 0);

    if (height === 0) return; // Vexflow를 그릴 요소가 없음

    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(width, height);

    const context = renderer.getContext();

    const showStaff = displayModes.includes("staff");
    const showTab = displayModes.includes("tab");

    const key = `${targetNote.noteName.toLowerCase()}/${targetNote.octave}`;
    const clef = instrument === "bass" ? "bass" : "treble";

    let staffStave: Stave | null = null;
    let tabStave: TabStave | null = null;

    let yOffset = 10;

    if (showStaff) {
      staffStave = new Stave(10, yOffset, width - 20);
      staffStave.addClef(clef).setContext(context).draw();
      yOffset += 110;
    }

    if (showTab) {
      const tabOptions = instrument === "bass" ? { num_lines: 4 } : { num_lines: 6 };
      tabStave = new TabStave(10, yOffset, width - 20, tabOptions as any);
      tabStave.addClef("tab").setContext(context);
      tabStave.draw();
    }

    if (showStaff && staffStave) {
      const staveNote = new StaveNote({ clef, keys: [key], duration: "w" });
      if (targetNote.noteName.includes("#")) {
        staveNote.addModifier(new Accidental("#"), 0);
      } else if (targetNote.noteName.includes("b")) {
        staveNote.addModifier(new Accidental("b"), 0);
      }

      const staffVoice = new Voice({ numBeats: 4, beatValue: 4 });
      staffVoice.addTickables([staveNote]);

      new Formatter().joinVoices([staffVoice]).format([staffVoice], width - 80);
      staffVoice.draw(context, staffStave);
    }

    if (showTab && tabStave) {
      const tabNote = new TabNote({
        positions: [{ str: targetNote.stringNumber, fret: targetNote.fretNumber }],
        duration: "w",
      });

      const tabVoice = new Voice({ numBeats: 4, beatValue: 4 });
      tabVoice.addTickables([tabNote]);

      new Formatter().joinVoices([tabVoice]).format([tabVoice], width - 80);
      tabVoice.draw(context, tabStave);
    }

    // Light theme override for Dark Mode App
    const svg = containerRef.current.querySelector("svg");
    if (svg) {
      if (status === "success") {
        svg.style.filter = "invert(1) sepia(1) saturate(5) hue-rotate(90deg)"; // Green highlight
      } else if (status === "error") {
        svg.style.filter = "invert(1) sepia(1) saturate(5) hue-rotate(-30deg)"; // Red highlight
      } else {
        svg.style.filter = "invert(1) hue-rotate(180deg)";
      }
    }
  }, [targetNote, displayModes, instrument, status]);

  const showAlphabet = displayModes.includes("alphabet");

  if (!targetNote) {
    return (
      <div className="text-on-surface-variant flex flex-1 items-center justify-center pb-8">
        Press Play to start practice
      </div>
    );
  }

  return (
    <div className="flex min-h-[300px] w-full flex-col items-center justify-center">
      {showAlphabet && (
        <div
          className={cn(
            "font-display animate-in fade-in zoom-in-95 mb-4 text-[8rem] leading-none font-bold transition-colors duration-300",
            status === "success" ? "text-primary" : status === "error" ? "text-error" : "text-primary"
          )}
        >
          {targetNote.noteName}
          <span className="text-on-surface-variant ml-2 text-4xl font-medium">
            {targetNote.octave}
          </span>
        </div>
      )}

      <div
        ref={containerRef}
        className={cn(
          "mt-4 flex w-[340px] max-w-full justify-center overflow-hidden px-4",
          !displayModes.includes("staff") && !displayModes.includes("tab") && "hidden"
        )}
      />
    </div>
  );
}

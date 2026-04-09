import { create } from "zustand";

export type Instrument = "guitar" | "bass";

export interface NoteInfo {
  noteName: string; // e.g., "C", "C#", "D"
  octave: number; // e.g., 2, 3, 4
  stringNumber: number; // 1 to 6 (or 4 for bass)
  fretNumber: number; // 0 to 12
}

// All standard chromatic notes using #
export const CHROMATIC_SCALE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Base open string note indices (C0 = 0, C1 = 12, etc.)
const TUNING = {
  guitar: [
    // 1st to 6th string
    4 * 12 + 4, // E4 (52)
    3 * 12 + 11, // B3 (47)
    3 * 12 + 7, // G3 (43)
    3 * 12 + 2, // D3 (38)
    2 * 12 + 9, // A2 (33)
    2 * 12 + 4, // E2 (28)
  ],
  bass: [
    // 1st to 4th string (Target range E1 to G3)
    2 * 12 + 7, // G2 (31) -> 12th fret: G3 (43)
    2 * 12 + 2, // D2 (26) -> 12th fret: D3 (38)
    1 * 12 + 9, // A1 (21) -> 12th fret: A2 (33)
    1 * 12 + 4, // E1 (16) -> 12th fret: E2 (28)
  ],
};

interface PracticeState {
  instrument: Instrument;
  setInstrument: (inst: Instrument) => void;

  targetNote: NoteInfo | null;
  generateNextNote: () => void;

  status: "idle" | "listening" | "success";
  setStatus: (status: "idle" | "listening" | "success") => void;
 
  isIncorrect: boolean;
  setIsIncorrect: (isIncorrect: boolean) => void;

  currentPitchHz: number | null;
  currentPitchNote: string | null;
  currentPitchOctave: number | null;
  cents: number;
  setCurrentPitch: (
    hz: number | null,
    note: string | null,
    octave: number | null,
    cents: number
  ) => void;
}

export const usePracticeStore = create<PracticeState>((set, get) => ({
  instrument: "guitar",
  setInstrument: (instrument) => {
    set({ instrument });
    get().generateNextNote();
  },

  targetNote: null,
  generateNextNote: () => {
    const { instrument } = get();
    const strings = TUNING[instrument];

    // Pick random string (1-indexed)
    const stringIdx = Math.floor(Math.random() * strings.length);
    const stringNumber = stringIdx + 1;

    // Pick random fret (0 to 12)
    const fretNumber = Math.floor(Math.random() * 13);

    // Calculate final note
    const absoluteNoteNumber = strings[stringIdx] + fretNumber;

    const octave = Math.floor(absoluteNoteNumber / 12);
    const noteIndex = absoluteNoteNumber % 12;

    set({
      targetNote: {
        noteName: CHROMATIC_SCALE[noteIndex],
        octave,
        stringNumber,
        fretNumber,
      },
      status: "listening",
    });
  },

  status: "idle",
  setStatus: (status) => set({ status }),
 
  isIncorrect: false,
  setIsIncorrect: (isIncorrect) => set({ isIncorrect }),

  currentPitchHz: null,
  currentPitchNote: null,
  currentPitchOctave: null,
  cents: 0,
  setCurrentPitch: (hz, note, octave, cents) =>
    set({ currentPitchHz: hz, currentPitchNote: note, currentPitchOctave: octave, cents }),
}));

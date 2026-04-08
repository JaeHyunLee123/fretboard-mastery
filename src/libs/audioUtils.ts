import { CHROMATIC_SCALE } from "@/store/usePracticeStore";

const A4_FREQ = 440;
export const CLARITY_THRESHOLD = 0.9; // Recommend threshold for pitchy

export function freqToNote(
  freq: number
): { noteName: string; octave: number; cents: number; exactFreq: number } | null {
  if (freq === 0 || isNaN(freq)) return null;

  // Calculate the number of half steps from A4
  const halfStepsFromA4 = Math.round(12 * Math.log2(freq / A4_FREQ));

  // Calculate the exact frequency of the closest ideal note
  const exactFreq = A4_FREQ * Math.pow(2, halfStepsFromA4 / 12);

  // Calculate cents off
  const cents = Math.round(1200 * Math.log2(freq / exactFreq));

  // A4 is octave 4. A4 is index 9 in CHROMATIC_SCALE.
  // totalSteps = 4 * 12 + 9 (but let's calculate relative to C0)
  // C0 is 12 * 4 + 9 = 57 half steps below A4.
  const noteNumber = halfStepsFromA4 + 57;

  const octave = Math.floor(noteNumber / 12);
  const noteIndex = ((noteNumber % 12) + 12) % 12; // Handle negatives just in case

  return {
    noteName: CHROMATIC_SCALE[noteIndex],
    octave,
    cents,
    exactFreq,
  };
}

import { Modal, ModalContent, ModalTrigger } from "./commons/Modal";
import { Mic } from "lucide-react";
import { useAudio } from "@/hooks/useAudio";
import { cn } from "@/libs/utils";

export function Tuner() {
  return (
    <div className="bg-surface-container-low flex flex-col gap-4 rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-on-surface text-xl font-bold tracking-tight">Tuner</h2>
        <Modal>
          <ModalTrigger className="bg-surface-bright text-on-surface hover:bg-surface-container-highest inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors">
            <Mic className="h-4 w-4" />
            Open Tuner
          </ModalTrigger>
          <ModalContent>
            <TunerUI />
          </ModalContent>
        </Modal>
      </div>
      <p className="font-body text-on-surface-variant text-sm">
        Connect your instrument or microphone to start practice.
      </p>
    </div>
  );
}

function TunerUI() {
  const { tunerOutput, isRecording } = useAudio();
  const { pitchHz, noteName, cents } = tunerOutput;

  const gaugePercent = Math.max(0, Math.min(100, cents + 50));

  return (
    <div className="flex flex-col items-center">
      <h3 className="font-display text-on-surface mb-8 text-2xl font-bold">Instrument Tuner</h3>

      {!isRecording ? (
        <div className="text-on-surface-variant flex h-40 flex-col items-center justify-center p-8 text-center text-sm">
          Please click "Connect Instrument" in the header to start.
        </div>
      ) : (
        <>
          {/* Note Display */}
          <div className="mb-4 text-center">
            <div className="font-display text-primary mb-1 text-7xl font-bold">
              {noteName || "-"}
            </div>
            <div className="font-label text-on-surface-variant text-lg">
              {pitchHz ? `${pitchHz.toFixed(1)} Hz` : "Waiting for sound..."}
            </div>
          </div>

          {/* Tuning Gauge */}
          <div className="bg-surface-variant relative mt-8 h-2 w-full max-w-xs overflow-hidden rounded-full">
            <div
              className={cn(
                "absolute top-0 bottom-0 w-2 -translate-x-1/2 transform rounded-full transition-all duration-75",
                Math.abs(cents) < 5 ? "bg-primary" : "bg-error"
              )}
              style={{ left: `${gaugePercent}%` }}
            />
            <div className="bg-outline absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2 opacity-50" />
            <div className="bg-outline absolute top-0 bottom-0 left-1/4 w-1 -translate-x-1/2 opacity-20" />
            <div className="bg-outline absolute top-0 bottom-0 left-3/4 w-1 -translate-x-1/2 opacity-20" />
          </div>

          {/* Status Text */}
          <div
            className={cn(
              "font-label mt-6 text-sm font-medium",
              Math.abs(cents) < 5 ? "text-primary" : "text-error"
            )}
          >
            {Math.abs(cents) < 5 ? "In Tune" : cents < 0 ? "Too Flat" : "Too Sharp"}
          </div>
        </>
      )}
    </div>
  );
}

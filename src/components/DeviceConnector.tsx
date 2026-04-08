"use client";

import { useEffect } from "react";
import { Mic, CheckCircle2, ChevronDown } from "lucide-react";
import { useAudio } from "@/hooks/useAudio";
import { cn } from "@/libs/utils";

export function DeviceConnector() {
  const {
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    fetchDevices,
    isRecording,
    startTuner,
    stopTuner,
  } = useAudio();

  useEffect(() => {
    if (selectedDeviceId) {
      // 기기가 선택되거나 변경되면 기존 연결을 끊고 새로 자동으로 시작합니다.
      stopTuner();
      const timer = setTimeout(() => {
        startTuner();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedDeviceId, startTuner, stopTuner]);

  return (
    <div className="bg-surface-container-low border-outline-variant/30 flex flex-col items-center gap-4 rounded-xl border p-4 sm:flex-row">
      <div className="flex w-full flex-1 flex-col items-center gap-4 sm:flex-row">
        {devices.length === 0 ? (
          <button
            onClick={fetchDevices}
            className="bg-primary text-on-primary hover:bg-primary-container flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 font-medium transition-colors sm:w-auto"
          >
            <Mic className="h-4 w-4" />
            Connect Instrument
          </button>
        ) : (
          <div className="relative w-full sm:w-64">
            <select
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="bg-surface-container-highest border-outline-variant text-on-surface focus:border-primary font-body w-full appearance-none rounded-full border py-2 pr-10 pl-4 text-sm focus:outline-none"
            >
              {devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || `Device ${d.deviceId.slice(0, 5)}...`}
                </option>
              ))}
            </select>
            <ChevronDown className="text-on-surface-variant pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
          </div>
        )}

        {devices.length > 0 && (
          <button
            onClick={isRecording ? stopTuner : startTuner}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 font-medium transition-colors sm:w-auto",
              isRecording
                ? "bg-surface-container-highest text-primary border-primary/50 border"
                : "bg-surface-bright text-on-surface hover:bg-surface-container-highest"
            )}
          >
            {isRecording ? <CheckCircle2 className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isRecording ? "Listening..." : "Enable Mic"}
          </button>
        )}
      </div>
    </div>
  );
}

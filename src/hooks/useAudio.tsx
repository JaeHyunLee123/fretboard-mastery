"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { PitchDetector } from "pitchy";
import { freqToNote, CLARITY_THRESHOLD } from "@/libs/audioUtils";
import { usePracticeStore } from "@/store/usePracticeStore";

interface TunerOutput {
  pitchHz: number | null;
  noteName: string | null;
  octave: number | null;
  cents: number;
}

interface AudioContextType {
  devices: MediaDeviceInfo[];
  selectedDeviceId: string;
  setSelectedDeviceId: (id: string) => void;
  fetchDevices: () => Promise<void>;
  startTuner: () => Promise<void>;
  stopTuner: () => void;
  isRecording: boolean;
  tunerOutput: TunerOutput;
}

const AudioContextData = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);

  const [tunerOutput, setTunerOutput] = useState<TunerOutput>({
    pitchHz: null,
    noteName: null,
    octave: null,
    cents: 0,
  });

  // ==========================================
  // 오디오 상태 및 객체를 관리하는 Ref 모음
  // ==========================================

  // audioContextRef: 브라우저가 제공하는 Web Audio API의 핵심 객체(AudioContext)를 담아둡니다.
  // 이 객체가 있어야 소리 입력/출력을 처리하거나 샘플레이트(sampleRate) 등에 접근할 수 있습니다.
  // 컴포넌트 생명주기가 유지되는 동안 재사용하고, 튜너가 꺼질 때 메모리 누수를 막기 위해 close() 처리를 할 때 활용됩니다.
  const audioContextRef = useRef<AudioContext | null>(null);

  // mediaStreamRef: 마이크에서 들어오는 실시간 오디오 데이터 스트림입니다.
  // 나중에 마이크 사용을 중지(stopTuner)할 때 스트림의 트랙들을 수동으로 정지시켜주기 위해 접근해야 하므로 저장해둡니다.
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // analyserRef: 오디오 데이터의 주파수나 파형(Waveform)을 분석할 수 있게 해주는 노드입니다.
  // 실시간으로 마이크에서 들어오는 음파 데이터를 배열 형태로 뽑아낼 때 핵심적인 역할을 합니다.
  const analyserRef = useRef<AnalyserNode | null>(null);

  // dataArrayRef: analyser가 추출한 오디오 파형(오실로스코프 형태) 데이터를 매 프레임마다 이 배열에 덮어씌웁니다.
  // requestAnimationFrame 안에서 매 반복마다 새 배열을 만들면 메모리 낭비가 심하므로(가비지 컬렉션 오버헤드),
  // 처음에 필요한 크기만큼 만들어 두고 Ref를 통해 계속 재사용합니다.
  const dataArrayRef = useRef<Float32Array | null>(null);

  // animationFrameRef: requestAnimationFrame이 반환하는 ID를 저장합니다.
  // 튜너가 꺼질 때(stopTuner), 무한히 반복되는 피치 탐지 루프를 멈추기 위해(cancelAnimationFrame) 사용합니다.
  const animationFrameRef = useRef<number | null>(null);

  const fetchDevices = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = allDevices.filter((d) => d.kind === "audioinput");
      setDevices(audioInputs);
      if (audioInputs.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(audioInputs[0].deviceId);
      }
    } catch (err) {
      console.error("Error fetching devices", err);
    }
  }, [selectedDeviceId]);

  const startTuner = useCallback(async () => {
    if (!selectedDeviceId) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: { exact: selectedDeviceId },
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
        },
      });

      mediaStreamRef.current = stream;
      const audioCtx = new window.AudioContext();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 4096;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      dataArrayRef.current = new Float32Array(analyser.fftSize);
      const float32Array = dataArrayRef.current;

      // 1. 피치(Pitch) 감지 알고리즘 초기화 (pitchy 라이브러리 사용)
      // pitchy는 McLeod Pitch Method(MPM)를 사용하여 빠르고 정확한 피치 검출을 제공합니다.
      const detector = PitchDetector.forFloat32Array(analyser.fftSize);

      setIsRecording(true);

      const updatePitch = () => {
        if (!analyserRef.current || !dataArrayRef.current) return;

        // 2. 오디오 데이터(단일 채널의 소리 데이터) 가져오기
        analyserRef.current.getFloatTimeDomainData(float32Array as Float32Array<ArrayBuffer>);

        // 3. 음높이(피치) 및 신뢰도(Clarity) 추출하기
        // pitchy 라이브러리의 findPitch는 [주파수, 신뢰도] 배열을 반환합니다.
        const [pitch, clarity] = detector.findPitch(
          float32Array as Float32Array<ArrayBuffer>,
          audioCtx.sampleRate
        );

        // 4. 추출된 피치값이 유효하고 신뢰도가 높다면(CLARITY_THRESHOLD 이상), 스토어에 상태 저장 및 UI 업데이트를 진행합니다.
        if (pitch && clarity > CLARITY_THRESHOLD && pitch > 20 && pitch < 2000) {
          const noteInfo = freqToNote(pitch);
          if (noteInfo) {
            setTunerOutput({
              pitchHz: pitch,
              noteName: noteInfo.noteName,
              octave: noteInfo.octave,
              cents: noteInfo.cents,
            });
            usePracticeStore
              .getState()
              .setCurrentPitch(pitch, noteInfo.noteName, noteInfo.octave, noteInfo.cents);
          }
        } else {
          setTunerOutput({ pitchHz: null, noteName: null, octave: null, cents: 0 });
          usePracticeStore.getState().setCurrentPitch(null, null, null, 0);
        }

        animationFrameRef.current = requestAnimationFrame(updatePitch);
      };

      updatePitch();
    } catch (error) {
      console.error("Failed to start tuner:", error);
    }
  }, [selectedDeviceId]);

  const stopTuner = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsRecording(false);
    setTunerOutput({ pitchHz: null, noteName: null, octave: null, cents: 0 });
    usePracticeStore.getState().setCurrentPitch(null, null, null, 0);
  }, []);

  useEffect(() => {
    return () => stopTuner();
  }, [stopTuner]);

  return (
    <AudioContextData.Provider
      value={{
        devices,
        selectedDeviceId,
        setSelectedDeviceId,
        fetchDevices,
        startTuner,
        stopTuner,
        isRecording,
        tunerOutput,
      }}
    >
      {children}
    </AudioContextData.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContextData);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}

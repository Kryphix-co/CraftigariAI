"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useVoiceRecorder({ onRecorded } = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState("");
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const discardNextRecordingRef = useRef(false);

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  }, []);

  const cancelRecording = useCallback(() => {
    discardNextRecordingRef.current = true;
    stopRecording();
  }, [stopRecording]);

  const startRecording = useCallback(async () => {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError("इस ब्राउज़र में वॉयस रिकॉर्डिंग उपलब्ध नहीं है।");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          autoGainControl: true,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      const preferredMimeType = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
      ].find((type) => MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(
        stream,
        preferredMimeType ? { mimeType: preferredMimeType } : undefined,
      );
      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];
      discardNextRecordingRef.current = false;
      setDuration(0);

      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      });
      recorder.addEventListener("stop", () => {
        const mimeType = recorder.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const extension = mimeType.includes("ogg") ? "ogg" : "webm";
        const file = new File([blob], `product-voice.${extension}`, {
          type: mimeType,
          lastModified: Date.now(),
        });
        if (!discardNextRecordingRef.current && blob.size > 0) {
          onRecorded?.(file);
        }
        discardNextRecordingRef.current = false;
        setIsRecording(false);
        if (timerRef.current) window.clearInterval(timerRef.current);
        stopTracks();
      });

      // Emit regular chunks instead of relying only on the browser's final
      // dataavailable event. This avoids empty/truncated blobs on some Chromium
      // and mobile browser builds when the user stops the recording.
      recorder.start(1000);
      setIsRecording(true);
      timerRef.current = window.setInterval(
        () => setDuration((current) => current + 1),
        1000,
      );
    } catch {
      setError("माइक्रोफ़ोन की अनुमति नहीं मिली।");
      stopTracks();
    }
  }, [onRecorded, stopTracks]);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (recorderRef.current?.state === "recording") {
        discardNextRecordingRef.current = true;
        recorderRef.current.stop();
      }
      stopTracks();
    },
    [stopTracks],
  );

  return {
    cancelRecording,
    duration,
    error,
    isRecording,
    startRecording,
    stopRecording,
    toggleRecording: isRecording ? stopRecording : startRecording,
  };
}

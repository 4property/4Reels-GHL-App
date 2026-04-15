import VideoPlayer from "./VideoPlayer";
import AudioRecorder from "./AudioRecorder";
import { useAudioRecorder } from "../../hooks/useAudioRecorder";

import { useEffect, useState } from "react";

export default function ReelRecorder() {
  const [isStartRequested, setIsStartRequested] = useState(false);
  const {
    audioExtension,
    audioUrl,
    error,
    isPreparing,
    isRecording,
    startRecording,
    stopRecording,
  } = useAudioRecorder();

  useEffect(() => {
    if (isStartRequested) {
      startRecording();
      return;
    }

    stopRecording();
  }, [isStartRequested, startRecording, stopRecording]);

  function handleToggle() {
    setIsStartRequested((currentValue) => !currentValue);
  }

  return (
    <>
      <h1 className="text-5xl text-blue-950 self-start">Reel Recorder</h1>
      <div className="flex flex-col items-center w-fit">
        <VideoPlayer isRunning={isStartRequested && isRecording} />
        <AudioRecorder
          audioExtension={audioExtension}
          audioUrl={audioUrl}
          error={error}
          isPreparing={isPreparing}
          isRecording={isRecording}
        />
        <button
          onClick={handleToggle}
          className={
            isStartRequested
              ? "bg-red-500 text-white px-4 py-2 rounded"
              : "bg-green-500 text-white px-4 py-2 rounded"
          }
        >
          {isStartRequested ? "Stop" : "Start"}
        </button>
      </div>
    </>
  );
}

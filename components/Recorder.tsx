"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";

import activeAssistantIcon from "@/img/active.gif";
import notActiveAssistantIcon from "@/img/notactive.png";

export const mimeType = "audio/webm";

type Props = {
  uploadAudio: (blob: Blob) => void;
};

function Recorder({ uploadAudio }: Props) {
  const { pending } = useFormStatus();

  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  useEffect(() => {
    getMicPermission();
  }, []);

  const getMicPermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (err: any) {
        alert(err.message);
      }
    } else {
      alert("Your browser does not support the MediaRecorder APi");
    }
  };

  const startRecording = async () => {
    if (stream === null || pending) return;

    setRecordingStatus("recording");

    //  Create new media recorder using the stream
    const media = new MediaRecorder(stream, { mimeType });
    mediaRecorder.current = media;
    mediaRecorder.current.start();

    let localAudioChunks: Blob[] = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;

      localAudioChunks.push(event.data);
    };

    setAudioChunks(localAudioChunks);
  };

  const stopRecording = async () => {
    if (mediaRecorder.current === null || pending) return;

    setRecordingStatus("inactive");
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      uploadAudio(audioBlob);
      setAudioChunks([]);
    };
  };

  return (
    <div className="flex items-center justify-center text-white">
      {!permission && (
        <button onClick={getMicPermission}>Get Microphone</button>
      )}

      {pending && (
        <Image
          src={activeAssistantIcon}
          alt="Recording"
          height={350}
          width={350}
          priority
          className="assistant grayscale"
        />
      )}

      {permission && recordingStatus === "inactive" && !pending && (
        <Image
          src={notActiveAssistantIcon}
          alt="Not Recording"
          height={350}
          width={350}
          onClick={startRecording}
          priority={true}
          className="assistant cursor-pointer hover:scale-110 duration-150 transition-all ease-in-out"
        />
      )}

      {recordingStatus === "recording" && (
        <Image
          src={activeAssistantIcon}
          alt="Recording"
          height={350}
          width={350}
          onClick={stopRecording}
          priority={true}
          className="assistant cursor-pointer hover:scale-110 duration-150 transition-all ease-in-out"
        />
      )}
    </div>
  );
}

export default Recorder;

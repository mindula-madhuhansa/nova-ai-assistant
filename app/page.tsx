"use client";

import { SettingsIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";

import Messages from "@/components/Messages";
import Recorder, { mimeType } from "@/components/Recorder";
import transcript from "@/actions/transcript";
import VoiceSynthesizer from "@/components/VoiceSynthesizer";
import { Message } from "@/types";

const initialState = {
  sender: "",
  response: "",
  id: "",
};

export default function Home() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  const [state, formAction] = useFormState(transcript, initialState);
  const [displaySettings, setDisplaySettings] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);

  // Responsible for updating the messages when the Server Action completes
  useEffect(() => {
    if (state.response && state.sender) {
      setMessages((messages) => [
        {
          sender: state.sender || "",
          response: state.response || "",
          id: state.id || "",
        },
        ...messages,
      ]);
    }
  }, [state]);

  const uploadAudio = (blob: Blob) => {
    const file = new File([blob], "audio.webm", { type: mimeType });

    // set the file as the value of the hidden file input field
    if (fileRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileRef.current.files = dataTransfer.files;

      // simulate a click & submit the form
      if (submitButtonRef.current) {
        submitButtonRef.current.click();
      }
    }
  };

  // console.log(messages);

  return (
    <main className="bg-black h-screen overflow-y-scroll scrollbar-thin scrollbar-thumb-indigo-700 scrollbar-track-indigo-300">
      {/* Header */}
      <header className="flex justify-between items-center fixed top-0 text-white w-full p-5">
        <h1 className="text-3xl font-bold">NOVA AI Assistant</h1>

        <SettingsIcon
          size={40}
          className="p-2 m-2 rounded-full cursor-pointer bg-indigo-600 text-black transition-all ease-in-out duration-150 hover:bg-indigo-700 hover:text-white"
          onClick={() => setDisplaySettings(!displaySettings)}
        />
      </header>

      <form action={formAction} className="flex flex-col bg-black">
        <div className="flex-1 bg-gradient-to-b from-indigo-500 to-black">
          <Messages messages={messages} />
        </div>

        {/* Hidden Fields*/}
        <input type="file" name="audio" hidden ref={fileRef} />
        <button type="submit" hidden ref={submitButtonRef}>
          Submit Audio
        </button>

        <div className="fixed bottom-0 w-full overflow-hidden bg-black">
          <Recorder uploadAudio={uploadAudio} />

          <div>
            <VoiceSynthesizer state={state} displaySettings={displaySettings} />
          </div>
        </div>
      </form>
    </main>
  );
}

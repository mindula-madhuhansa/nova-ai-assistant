"use client";

import { ChangeEvent, useEffect, useState } from "react";

import { State } from "@/types";

type Props = {
  state: State;
  displaySettings: boolean;
};

function VoiceSynthesizer({ state, displaySettings }: Props) {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    setSynth(window.speechSynthesis);
  }, []);

  useEffect(() => {
    if (!state.response || !synth) return;

    const wordsToSay = new SpeechSynthesisUtterance(state.response);

    wordsToSay.voice = voice;
    wordsToSay.pitch = pitch;
    wordsToSay.rate = rate;
    wordsToSay.volume = volume;

    synth.speak(wordsToSay);

    return () => {
      synth.cancel();
    };
  }, [state, synth, voice, pitch, rate, volume]);

  const handleVoiceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.name === e.target.value);

    if (!voice) return;

    setVoice(voice);
  };

  const handlePitchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPitch(parseFloat(e.target.value));
  };

  const handleRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRate(parseFloat(e.target.value));
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div className="flex flex-col items-center justify-center text-white">
      {displaySettings && (
        <>
          <div className="w-fit">
            <p className="text-xs text-gray-500 p-2">Voice:</p>
            <select
              value={voice?.name}
              onChange={handleVoiceChange}
              className="flex-1 bg-indigo-500 text-white borde text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-indigo-500 dark:focus:border-indigo-500 outline-none"
            >
              {window.speechSynthesis.getVoices().map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex pb-5">
            <div className="p-2">
              <p className="text-xs font-bold text-gray-500">Pitch:</p>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={handlePitchChange}
                className="accent-indigo-500"
              />
            </div>

            <div className="p-2">
              <p className="text-xs font-bold text-gray-500">Speed:</p>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={handleRateChange}
                className="accent-indigo-500"
              />
            </div>

            <div className="p-2">
              <p className="text-xs font-bold text-gray-500">Volume:</p>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="accent-indigo-500"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default VoiceSynthesizer;

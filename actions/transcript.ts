"use server";

import {
  AzureKeyCredential,
  ChatRequestMessage,
  OpenAIClient,
} from "@azure/openai";
import { v4 as uuidv4 } from "uuid";

async function transcript(prevState: any, formData: FormData) {
  console.log("PREVIOUS STATE:", prevState);

  const id = uuidv4();

  if (
    process.env.AZURE_API_KEY === undefined ||
    process.env.AZURE_ENDPOINT === undefined ||
    process.env.AZURE_DEPLOYMENT_NAME === undefined ||
    process.env.AZURE_DEPLOYMENT_COMPLETIONS_NAME === undefined
  ) {
    console.log("Azure credentials not set");
    return {
      sender: "",
      response: "Azure credentials not set",
    };
  }

  const file = formData.get("audio") as File;

  if (file.size === 0) {
    return {
      sender: "",
      response: "No audio file provided",
    };
  }

  console.log(">>", file);

  const arrayBuffer = await file.arrayBuffer();
  const audio = new Uint8Array(arrayBuffer);

  //  --- get audio transcription from Azure Whisper AI service ---

  console.log("*** Transcribe Audio Sample ***");

  const client = new OpenAIClient(
    process.env.AZURE_ENDPOINT,
    new AzureKeyCredential(process.env.AZURE_API_KEY)
  );

  const result = await client.getAudioTranscription(
    process.env.AZURE_DEPLOYMENT_NAME,
    audio
  );

  console.log(`Transcription: ${result.text}`);

  //  --- get chat completion from Azure OpenAI ---

  const messages: ChatRequestMessage[] = [
    {
      role: "system",
      content:
        "You are Nova, a helpful AI assistant. You will answer questions and reply 'I cannot answer that' if you don't know the answer.",
    },
    {
      role: "user",
      content: result.text,
    },
  ];

  const completions = await client.getChatCompletions(
    process.env.AZURE_DEPLOYMENT_COMPLETIONS_NAME,
    messages,
    { maxTokens: 128 }
  );

  const response = completions.choices[0].message?.content;

  console.log(prevState.sender, "***", result.text);

  return {
    sender: result.text,
    response: response,
    id: id,
  };
}

export default transcript;

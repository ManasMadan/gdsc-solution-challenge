"use client";
import { Button } from "@tremor/react";
import { Card } from "@tremor/react";
import React, { useEffect, useState } from "react";
import { getResponse, initialPrompt, markDownPrompt } from "@/lib/gemini";
import { TextInput } from "@tremor/react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import Markdown from "react-markdown";
import { Divider } from "@tremor/react";
import { useAuth } from "@/lib/AuthContext";

export default function GeminiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  useEffect(() => {
    const f = async () => {
      const reponse = await getResponse(initialPrompt + markDownPrompt);
      setChatHistory((chats) => {
        if (chatHistory.length === 0) {
          chats.push({ sent_by: "Vanrakshak", message: reponse });
        }
        return chats;
      });
      setLoading(false);
    };
    f();
  }, []);

  const askGemini = async () => {
    setLoading(true);
    const message = document.getElementById("prompt").value;
    const response = await getResponse(message + markDownPrompt);
    chatHistory.push({ sent_by: user.name, message: response });
    setChatHistory(chatHistory);
    setLoading(false);
  };

  return (
    <>
      <Card
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-0 grid place-items-center left-[90%] z-50 w-[50px] rounded-t-full"
        style={{ backgroundColor: "white" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          width="20px"
          className="absolute"
        >
          <path d="M241 130.5l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9l-22.7 22.7c-9.4 9.4-24.5 9.4-33.9 0L224 227.5 69.3 381.5c-9.4 9.3-24.5 9.3-33.9 0l-22.7-22.7c-9.4-9.4-9.4-24.6 0-33.9L207 130.5c9.4-9.4 24.6-9.4 33.9 0z" />
        </svg>
      </Card>
      <Card
        className={`bottom-0 z-[200] border-t-[2px] left-0 w-screen h-[80vh] flex gap-12 flex-col ${
          isOpen ? "fixed" : "hidden"
        }`}
      >
        <Button color="red" className="w-fit" onClick={() => setIsOpen(false)}>
          Close
        </Button>
        <div className="grow flex flex-col gap-4 overflow-y-scroll text-white">
          {chatHistory.map((chatMessage, i) => (
            <div key={i}>
              <h1 className="text-[#5EA5F7] text-2xl">{chatMessage.sent_by}</h1>
              <Divider />
              <Markdown>{chatMessage.message}</Markdown>
            </div>
          ))}
        </div>
        <div className="flex justify-between gap-4">
          <TextInput placeholder="Ask Vanrakshak" id="prompt" />
          <Button
            variant="secondary"
            icon={PaperAirplaneIcon}
            onClick={askGemini}
            disabled={loading}
          />
        </div>
      </Card>
    </>
  );
}

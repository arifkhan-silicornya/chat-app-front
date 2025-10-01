"use client";
import dynamic from "next/dynamic";
import { useEffect } from "react";

const ChatWindow = dynamic(() => import("../components/ChatWindow"), {
  ssr: false,
});

export default function Chat() {
  useEffect(() => {
    const token = localStorage.getItem("chat_token");
    if (!token) {
      window.location.href = "/";
    }
  }, []);
  return (
    <div>
      <ChatWindow roomId="room_general" />
    </div>
  );
}

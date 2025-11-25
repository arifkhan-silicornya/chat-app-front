"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import PushNotification from "./PushNotification/PushNotification";

export default function ChatWindow({ roomId = "room_general" }) {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);
  const socketRef = useRef(null);

  const [notification, setNotification] = useState({
    title: "",
    message: "",
    isVisible: false,
  });

  // Function to show the notification with new data
  const triggerNotification = (newTitle, newMessage) => {
    setNotification({
      title: newTitle,
      message: newMessage,
      isVisible: true,
    });
  };

  // Function to handle closing (passed to the component)
  const handleClose = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };

  useEffect(() => {
    const token = localStorage.getItem("chat_token");
    const chat_user = localStorage.getItem("chat_user");
    const user = JSON.parse(chat_user);

    setUser(user);

    const socket = io("http://localhost:3001", { auth: { token } });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("joinRoom", roomId);
    });

    socket.on("history", (msgs) => {
      setMessages(msgs || []);
    });
    socket.on("message", (m) => {
      setMessages((prev) => [...prev, m]);
      if (user.username !== m.username) {
        triggerNotification("New Message!", "You have a new unread chat.");
      }
    });

    return () => socket.disconnect();
  }, [roomId]);

  function send() {
    if (!text) return;
    socketRef.current.emit("message", { roomId, text });
    setText("");
  }

  function LogoutUser() {
    localStorage.removeItem("chat_token");
    localStorage.removeItem("chat_user");
    router.push("/");
    setUser(null);
  }

  const getDate = (date) => {
    return new Date(date).toLocaleTimeString();
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-900 text-gray-100 shadow-lg rounded-lg">
      <div className="flex justify-between gap-2">
        <h2 className="text-xl font-bold mb-4">Room: {roomId}</h2>
        <h2 className="text-xl font-bold mb-4 capitalize">{user?.firstName}</h2>
        <button
          onClick={LogoutUser}
          className="btn border border-cyan-300 p-2 text-xl font-bold mb-4"
        >
          Logout
        </button>
      </div>

      {/* Messages Area */}
      <div className="h-80 overflow-y-auto border border-gray-700 p-4 rounded-lg mb-4 bg-gray-800">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`mb-2 flex ${
              m.username === user?.username ? " justify-end" : ""
            }`}
          >
            <div className="flex flex-col gap-0">
              <div>
                <span className="font-semibold text-blue-400">
                  {m.username === user?.username ? "me" : m.firstName}:
                </span>{" "}
                <span>{m.text}</span>
              </div>
              <div>
                {" "}
                <small className="text-gray-400 text-xs w-full">
                  {getDate(m.ts)}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex space-x-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message..."
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={send}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>

      <PushNotification
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={handleClose} // Pass the state update function
      />
    </div>
  );
}

"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import PushNotification from "../components/PushNotification/PushNotification";

const ChatWindow = dynamic(() => import("../components/ChatWindow"), {
  ssr: false,
});

export default function Chat() {
  const [notification, setNotification] = useState({
    title: "",
    message: "",
    isVisible: false,
  });
  useEffect(() => {
    const token = localStorage.getItem("chat_token");
    if (!token) {
      window.location.href = "/";
    }
  }, []);

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

  return (
    <div>
      <button
        onClick={() =>
          triggerNotification("New Message!", "You have a new unread chat.")
        }
        style={{ margin: "10px", padding: "10px" }}
      >
        Show Chat Alert
      </button>

      <button
        onClick={() =>
          triggerNotification(
            "System Update",
            "The database connection was restored."
          )
        }
        style={{ margin: "10px", padding: "10px" }}
      >
        Show System Alert
      </button>
      <ChatWindow roomId="room_general" />

      <PushNotification
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={handleClose} // Pass the state update function
      />
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import NotificationSystem from "browser-push-notification";

export default function Page() {
  const notifierRef = useRef(null);

  // Initialize only on client mount
  useEffect(() => {
    notifierRef.current = new NotificationSystem({
      icon: "/notification-icon.jpg",
      defaultLink: "https://yourapp.com",
      autoClose: 4000,
    });

    // Ask permission on load
    notifierRef.current.requestPermission();
  }, []);

  const send = () => {
    notifierRef.current.send({
      title: "New Message!",
      body: "Someone sent you a message.",
      link: "https://yourapp.com/message/123",
    });
  };

  return (
    <div className="h-screen w-full bg-amber-100 text-black flex flex-col gap-4 justify-center items-center">
      <button className="border py-2 px-4" onClick={send}>
        Trigger Notification
      </button>
    </div>
  );
}

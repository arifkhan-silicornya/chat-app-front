import React, { useState, useEffect } from "react";

// Fallback Custom UI Notification (retains your original styling, slightly modified)
const CustomNotificationUI = ({
  title,
  message,
  iconUrl,
  displayTime,
  isVisible,
  onClose,
}) => {
  // ... (Your original style definitions would go here, or ideally, in a CSS file)
  // For brevity, we'll keep the styles inline and update the structure.
  const notificationStyle = {
    position: "fixed",
    top: isVisible ? "20px" : "-100px",
    right: "20px",
    backgroundColor: "#333",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
    zIndex: 1000,
    maxWidth: "300px",
    transition: "top 0.5s ease-in-out, opacity 0.5s ease-in-out",
    opacity: isVisible ? 1 : 0,
    display: "flex",
    gap: "10px", // Spacing for the icon
    fontFamily: "Arial, sans-serif",
  };
  const contentStyle = {
    display: "flex",
    flexDirection: "column",
  };
  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };
  const titleStyle = { fontWeight: "bold", fontSize: "1.1em" };
  const messageStyle = { fontSize: "0.95em", color: "#ccc" };
  const iconStyle = {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    objectFit: "cover",
  };
  const closeButtonStyle = {
    background: "none",
    border: "none",
    color: "#999",
    fontSize: "1.2em",
    cursor: "pointer",
    marginLeft: "10px",
  };
  const timeStyle = { fontSize: "0.8em", color: "#888" };

  useEffect(() => {
    let timer;
    if (isVisible) {
      timer = setTimeout(onClose, 5000);
    }
    return () => clearTimeout(timer);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div style={notificationStyle}>
      <img src={iconUrl} alt="Icon" style={iconStyle} />
      <div style={contentStyle}>
        <div style={headerStyle}>
          <div style={titleStyle}>{title}</div>
          <button style={closeButtonStyle} onClick={onClose}>
            &times;
          </button>
        </div>
        <div style={messageStyle}>{message}</div>
        <div style={timeStyle}>{displayTime}</div>
      </div>
    </div>
  );
};

// --- Main Notification Handler Component ---

/**
 * 🔔 Native/Custom Push Notification Component
 * @param {object} props
 * @param {string} props.title - The title of the notification.
 * @param {string} props.message - The body message.
 * @param {string} props.iconUrl - URL for the notification icon.
 * @param {boolean} props.trigger - A boolean that triggers the notification when it becomes true.
 * @param {function} props.onComplete - Function to call after the notification has been shown/handled.
 */
const NotificationHandler = ({
  title,
  message,
  iconUrl,
  trigger,
  onComplete,
}) => {
  const [showCustom, setShowCustom] = useState(false);
  const displayTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // 1. Logic to request permission and display native notification
  const showNativeNotification = () => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support desktop notification.");
      return false;
    }

    if (Notification.permission === "granted") {
      new Notification(title, {
        body: `${message} (${displayTime})`, // Add time to the body for native
        icon: iconUrl,
        tag: "unique-notification-id", // Optional: groups notifications
      });
      return true;
    } else if (Notification.permission !== "denied") {
      // Request permission
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, {
            body: `${message} (${displayTime})`,
            icon: iconUrl,
          });
        } else {
          // If permission is denied or not granted after request, fall back to custom UI
          setShowCustom(true);
        }
      });
      return true; // The async request is underway
    } else {
      // Permission is denied, fall back to custom UI
      return false;
    }
  };

  // 2. Effect to trigger the notification
  useEffect(() => {
    if (trigger) {
      const nativeShown = showNativeNotification();

      if (!nativeShown) {
        // If the native notification failed to show (e.g., permission denied immediately)
        // or if the browser doesn't support it, show the custom UI.
        setShowCustom(true);
      }

      // Call onComplete after handling
      // For native, the notification is handled immediately.
      // For custom, it will be handled when the custom UI closes.
      if (nativeShown) {
        onComplete();
      }
    }
  }, [trigger]); // Re-run effect when 'trigger' changes

  const handleCustomClose = () => {
    setShowCustom(false);
    // Call onComplete when the custom UI fully closes
    onComplete();
  };

  // Render the Custom UI as a fallback
  return (
    <CustomNotificationUI
      title={title}
      message={message}
      iconUrl={iconUrl}
      displayTime={displayTime}
      isVisible={showCustom}
      onClose={handleCustomClose}
    />
  );
};

export default NotificationHandler;

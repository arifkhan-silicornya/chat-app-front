import React, { useState, useEffect } from "react";

/**
 * 🔔 Custom Push Notification Component
 * @param {object} props
 * @param {string} props.title - The title of the notification.
 * @param {string} props.message - The body message of the notification.
 * @param {boolean} props.isVisible - Controls the visibility of the notification.
 * @param {function} props.onClose - Function to call when the notification is closed (or times out).
 */
const PushNotification = ({ title, message, isVisible, onClose }) => {
  // Styles for the component (often moved to a CSS file)
  const notificationStyle = {
    position: "fixed",
    top: isVisible ? "20px" : "-100px", // Slide in from the top
    right: "20px",
    backgroundColor: "#333333", // Dark background
    color: "#ffffff",
    padding: "15px 20px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
    zIndex: 1000,
    maxWidth: "300px",
    transition: "top 0.5s ease-in-out, opacity 0.5s ease-in-out",
    opacity: isVisible ? 1 : 0,
    display: "flex",
    flexDirection: "column",
    fontFamily: "Arial, sans-serif",
  };

  const titleStyle = {
    fontWeight: "bold",
    fontSize: "1.1em",
    marginBottom: "5px",
    borderBottom: "1px solid #444",
    paddingBottom: "3px",
  };

  const messageStyle = {
    fontSize: "0.95em",
    color: "#ccc",
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "5px",
    right: "10px",
    background: "none",
    border: "none",
    color: "#999",
    fontSize: "1.2em",
    cursor: "pointer",
  };

  // --- Auto-Hide Logic ---
  useEffect(() => {
    let timer;
    if (isVisible) {
      // Set a timer to close the notification after 5 seconds
      timer = setTimeout(() => {
        onClose();
      }, 5000);
    }

    // Cleanup function to clear the timeout if component unmounts or state changes
    return () => {
      clearTimeout(timer);
    };
  }, [isVisible, onClose]); // Re-run effect when visibility or onClose changes

  if (!isVisible) {
    return null;
  }

  return (
    <div style={notificationStyle}>
      <button style={closeButtonStyle} onClick={onClose}>
        &times;
      </button>
      <div style={titleStyle}>{title}</div>
      <div style={messageStyle}>{message}</div>
    </div>
  );
};

export default PushNotification;

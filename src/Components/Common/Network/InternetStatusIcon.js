import React, { useEffect, useState } from "react";
import { FaWifi } from "react-icons/fa";
import { FiWifiOff } from "react-icons/fi";

const InternetStatusIcon = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div
      className="d-flex align-items-center justify-content-center me-3"
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        backgroundColor: "#ffffff",
        boxShadow: "0 0 5px rgba(0,0,0,0.1)",
      }}
    >
      {isOnline ? (
        <FaWifi size={20} color="green" />
      ) : (
        <FiWifiOff size={20} color="red" />
      )}
    </div>
  );
};

export default InternetStatusIcon;

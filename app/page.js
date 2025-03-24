"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("Checking Telegram...");

  useEffect(() => {
    console.log("Loading Telegram script...");
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-web-app.js";
    script.async = true;
    script.onload = () => {
      console.log("Script loaded!");
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        setMessage(
          `Telegram Web App detected! User: ${
            tg.initDataUnsafe?.user?.username || "Unknown"
          }`
        );
      } else {
        setMessage("Telegram Web App not detected after script load.");
      }
    };
    script.onerror = () => {
      console.error("Script failed to load!");
      setMessage("Failed to load Telegram script.");
    };
    document.head.appendChild(script);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{message}</h1>
    </div>
  );
}
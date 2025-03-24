"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("Checking Telegram...");

  useEffect(() => {
    console.log("Page loaded, window object:", window);
    console.log("Telegram object:", window.Telegram);
    console.log("User Agent:", navigator.userAgent);

    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      console.log("WebApp detected, initDataUnsafe:", tg.initDataUnsafe);
      setMessage(
        `Telegram Web App detected! User: ${
          tg.initDataUnsafe?.user?.username || "Unknown"
        }`
      );
    } else {
      setMessage("Telegram Web App not detected.");
      console.log("Retrying in 1 second...");
      setTimeout(() => {
        if (window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;
          tg.ready();
          setMessage(
            `Telegram Web App detected after delay! User: ${
              tg.initDataUnsafe?.user?.username || "Unknown"
            }`
          );
        } else {
          setMessage("Telegram Web App still not detected after delay.");
        }
      }, 1000);
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{message}</h1>
    </div>
  );
}
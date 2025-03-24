"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("Checking Telegram...");

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      setMessage(
        `Telegram Web App detected! User: ${
          tg.initDataUnsafe?.user?.username || "Unknown"
        }`
      );
    } else {
      setMessage("Telegram Web App not detected.");
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{message}</h1>
    </div>
  );
}
"use client"; // This makes it a Client Component

import { useEffect, useState } from "react";
import { loadTelegramScript } from "../lib/telegram";

export default function Home() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadTelegramScript();

    const initTelegram = async () => {
      // Wait for Telegram script to load
      if (window.Telegram && window.Telegram.WebApp) {
        const webApp = window.Telegram.WebApp;
        webApp.ready();

        const initData = webApp.initData;

        // Send initData to our API
        const response = await fetch("/api/auth/telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData }),
        });

        const data = await response.json();
        setUserData(data);
      }
    };

    initTelegram();
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Welcome to My Telegram Mini App!</h1>
      <p>
        <strong>Telegram ID:</strong> {userData.telegramId}
      </p>
      {userData.username && (
        <p>
          <strong>Username:</strong> {userData.username}
        </p>
      )}
      {userData.firstName && (
        <p>
          <strong>First Name:</strong> {userData.firstName}
        </p>
      )}
      {userData.lastName && (
        <p>
          <strong>Last Name:</strong> {userData.lastName}
        </p>
      )}
      {userData.photoUrl && (
        <p>
          <strong>Photo:</strong>{" "}
          <img src={userData.photoUrl} alt="Profile" width="100" />
        </p>
      )}
      {userData.languageCode && (
        <p>
          <strong>Language:</strong> {userData.languageCode}
        </p>
      )}
    </div>
  );
}
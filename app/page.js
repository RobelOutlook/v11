"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      const initDataUnsafe = tg.initDataUnsafe || {};

      if (initDataUnsafe.user) {
        fetch("/api/telegramUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(initDataUnsafe.user),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              setError(data.error);
            } else {
              setUser(data);
            }
          })
          .catch((err) => {
            setError("Failed to fetch user data");
          });
      } else {
        setError("No user data available");
      }
    } else {
      setError("This app should be opened in Telegram");
    }
  }, []);

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  if (!user) return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Welcome Back, {user.firstName} {user.lastName}!
      </h1>
      <p>
        <strong>Telegram ID:</strong> {user.telegramId}
      </p>
      {user.username && (
        <p>
          <strong>Username:</strong> @{user.username}
        </p>
      )}
      {user.firstName && (
        <p>
          <strong>First Name:</strong> {user.firstName}
        </p>
      )}
      {user.lastName && (
        <p>
          <strong>Last Name:</strong> {user.lastName}
        </p>
      )}
      {user.photoUrl && (
        <p>
          <strong>Photo:</strong>{" "}
          <img src={user.photoUrl} alt="Profile" width="100" />
        </p>
      )}
      {user.languageCode && (
        <p>
          <strong>Language:</strong> {user.languageCode}
        </p>
      )}
    </div>
  );
}
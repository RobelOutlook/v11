"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

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
              console.log("API response:", data);
              if (data.error) {
                setError(data.error);
              } else {
                setUser(data);
              }
            })
            .catch((err) => {
              console.error("Fetch error:", err);
              setError("Failed to fetch user data");
            });
        } else {
          setError("No user data available from Telegram");
        }
      } else {
        setError("Telegram Web App not detected after script load");
      }
    };
    script.onerror = () => {
      console.error("Script failed to load!");
      setError("Failed to load Telegram script");
    };
    document.head.appendChild(script);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-md">
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  // Logic to determine if buttons are active based on wallet balance
  const walletBalance = parseFloat(user.walletBalance) || 0;
  const is10BirrActive = walletBalance >= 10;
  const is30BirrActive = walletBalance >= 30;
  const is50BirrActive = walletBalance >= 50;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
        {/* User Info Section */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back, {user.firstName} {user.lastName}!
          </h1>
          {user.photoUrl && (
            <img
              src={user.photoUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-gray-200"
            />
          )}
          <div className="text-gray-600 space-y-1">
            <p>
              <strong>ID:</strong> {user.telegramId}
            </p>
            {user.username && (
              <p>
                <strong>Username:</strong> @{user.username}
              </p>
            )}
            {user.languageCode && (
              <p>
                <strong>Language:</strong> {user.languageCode}
              </p>
            )}
            {user.phoneNumber && (
              <p>
                <strong>Phone:</strong> {user.phoneNumber}
              </p>
            )}
            <p className="text-lg font-semibold text-green-600">
              <strong>Wallet Balance:</strong> {user.walletBalance} Birr
            </p>
          </div>
        </div>

        {/* Bingo Bet Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <a
            href="/bingo/free"
            className="bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg text-center hover:bg-blue-600 transition-colors"
          >
            Free Play
          </a>
          <a
            href={is10BirrActive ? "/bingo/10birr" : undefined}
            className={`${
              is10BirrActive
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-300 cursor-not-allowed"
            } text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors`}
          >
            10 Birr
          </a>
          <a
            href={is30BirrActive ? "/bingo/30birr" : undefined}
            className={`${
              is30BirrActive
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-gray-300 cursor-not-allowed"
            } text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors`}
          >
            30 Birr
          </a>
          <a
            href={is50BirrActive ? "/bingo/50birr" : undefined}
            className={`${
              is50BirrActive
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gray-300 cursor-not-allowed"
            } text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors`}
          >
            50 Birr
          </a>
        </div>
      </div>
    </div>
  );
}
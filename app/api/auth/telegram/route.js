import { PrismaClient } from "@prisma/client";
import { validate } from "@telegram-apps/init-data-node";

const prisma = new PrismaClient();
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(request) {
  const { initData } = await request.json();

  if (!initData) {
    return new Response(JSON.stringify({ error: "No initData sent" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Check if Telegram data is real
    validate(initData, BOT_TOKEN);

    // Get user info from initData
    const data = new URLSearchParams(initData);
    const user = JSON.parse(decodeURIComponent(data.get("user") || "{}"));

    const { id, username, first_name, last_name, photo_url, language_code } = user;

    // Save or update user in the database
    const savedUser = await prisma.user.upsert({
      where: { telegramId: id.toString() },
      update: {
        username,
        firstName: first_name,
        lastName: last_name,
        photoUrl: photo_url,
        languageCode: language_code,
      },
      create: {
        telegramId: id.toString(),
        username,
        firstName: first_name,
        lastName: last_name,
        photoUrl: photo_url,
        languageCode: language_code,
      },
    });

    return new Response(JSON.stringify(savedUser), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Bad Telegram data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
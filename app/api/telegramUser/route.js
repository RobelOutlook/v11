import { prisma } from "../../../lib/prisma";

export async function POST(request) {
  try {
    const userData = await request.json();

    if (!userData || !userData.id) {
      return new Response(JSON.stringify({ error: "invalid user data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let user = await prisma.user.findUnique({
      where: { telegramId: userData.id.toString() },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          telegramId: userData.id.toString(),
          username: userData.username || "",
          firstName: userData.first_name || "",
          lastName: userData.last_name || "",
          photoUrl: userData.photo_url || "",
          languageCode: userData.language_code || "",
        },
      });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing the user data", error);
    return new Response(JSON.stringify({ error: "internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
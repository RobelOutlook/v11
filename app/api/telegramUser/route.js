import { prisma } from "../../../lib/prisma";

export async function POST(request) {
  try {
    const userData = await request.json();

    // Validate incoming user data
    if (!userData || !userData.id) {
      return new Response(JSON.stringify({ error: "invalid user data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if user already exists, if not create them
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

    // Return user data
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
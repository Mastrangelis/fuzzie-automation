import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import type { UserJSON, WebhookEvent } from "@clerk/nextjs/server";

import { Webhook } from "svix";

const validateRequest = async (
  req: Request
): Promise<WebhookEvent | undefined> => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("CLERK_WEBHOOK_SECRET is not defined");
  }

  const payloadString = await req.text();
  const headerPayload = req.headers;
  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  };

  const wh = new Webhook(webhookSecret);
  const event = wh.verify(payloadString, svixHeaders);
  return event as WebhookEvent;
};

export async function POST(req: Request) {
  try {
    const event = await validateRequest(req);

    if (!event) {
      return new Response("Invalid request", { status: 400 });
    }

    const { id, email_addresses, first_name, image_url } =
      event?.data as UserJSON;

    const email = email_addresses[0]?.email_address;
    console.log("✅", event.data);

    await db.user.upsert({
      where: { clerkId: id },
      update: {
        email,
        name: first_name,
        profileImage: image_url,
      },
      create: {
        clerkId: id,
        email,
        name: first_name || "",
        profileImage: image_url || "",
      },
    });
    return new NextResponse("User updated in database successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating database:", error);
    return new NextResponse("Error updating user in database", { status: 500 });
  }
}

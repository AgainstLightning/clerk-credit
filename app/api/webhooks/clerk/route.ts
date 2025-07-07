/* eslint-disable camelcase */
import { clerkClient } from "@clerk/nextjs";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";

export async function POST(req: Request) {
  try {
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      console.error("Missing WEBHOOK_SECRET");
      return new Response("Missing WEBHOOK_SECRET", {
        status: 500,
      });
    }

    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error("Missing svix headers:", {
        svix_id,
        svix_timestamp,
        svix_signature,
      });
      return new Response("Error occurred -- no svix headers", {
        status: 400,
      });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    console.log("Received webhook payload:", payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error verifying webhook signature", {
        status: 400,
      });
    }

    // Get the ID and type
    const { id } = evt.data;
    const eventType = evt.type;

    console.log(`Processing webhook: ${eventType} for ID: ${id}`);

    // CREATE
    if (eventType === "user.created") {
      try {
        const {
          id,
          email_addresses,
          image_url,
          first_name,
          last_name,
          username,
        } = evt.data;

        console.log("Creating user with data:", {
          id,
          email: email_addresses?.[0]?.email_address,
          username,
          firstName: first_name,
          lastName: last_name,
          photo: image_url,
        });

        const user = {
          clerkId: id,
          email: email_addresses[0].email_address,
          username: username!,
          firstName: first_name,
          lastName: last_name,
          photo: image_url,
        };

        const newUser = await createUser(user);
        console.log("User created:", newUser);

        // Set public metadata
        if (newUser) {
          await clerkClient.users.updateUserMetadata(id, {
            publicMetadata: {
              userId: newUser._id,
            },
          });
          console.log("Updated Clerk metadata with userId:", newUser._id);
        }

        return NextResponse.json({ message: "OK", user: newUser });
      } catch (error: any) {
        console.error("Error in user.created handler:", error);
        return new Response(
          JSON.stringify({
            error: "Error creating user",
            details: error.message,
          }),
          {
            status: 500,
          }
        );
      }
    }

    // UPDATE
    if (eventType === "user.updated") {
      try {
        const { id, image_url, first_name, last_name, username } = evt.data;

        const user = {
          firstName: first_name,
          lastName: last_name,
          username: username!,
          photo: image_url,
        };

        const updatedUser = await updateUser(id, user);
        return NextResponse.json({ message: "OK", user: updatedUser });
      } catch (error: any) {
        console.error("Error in user.updated handler:", error);
        return new Response(
          JSON.stringify({
            error: "Error updating user",
            details: error.message,
          }),
          {
            status: 500,
          }
        );
      }
    }

    // DELETE
    if (eventType === "user.deleted") {
      try {
        const { id } = evt.data;
        const deletedUser = await deleteUser(id!);
        return NextResponse.json({ message: "OK", user: deletedUser });
      } catch (error: any) {
        console.error("Error in user.deleted handler:", error);
        return new Response(
          JSON.stringify({
            error: "Error deleting user",
            details: error.message,
          }),
          {
            status: 500,
          }
        );
      }
    }

    console.log(`Webhook processed: ${eventType} for ID: ${id}`);
    return new Response("OK", { status: 200 });
  } catch (error: any) {
    console.error("Unhandled webhook error:", error);
    return new Response(
      JSON.stringify({
        error: "Unhandled webhook error",
        details: error.message,
      }),
      {
        status: 500,
      }
    );
  }
}

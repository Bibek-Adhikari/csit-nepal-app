import { NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/admin-auth";

const HUB_URL = "https://pubsubhubbub.appspot.com/subscribe";
const CHANNEL_ID = "UCBvTTBLD1wD1jTQs0OeBZ4Q";
const TOPIC = `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

export async function POST(request: Request) {
  if (!validateAdminRequest(request)) {
    return NextResponse.json({ error: "Invalid or missing admin key" }, { status: 401 });
  }

  const body = await request.json();
  const mode = (body.mode as string) || "subscribe";

  if (!process.env.PUBSUB_CALLBACK_URL) {
    return NextResponse.json(
      { error: "PUBSUB_CALLBACK_URL env var not set (e.g. https://bcanepal.netlify.app/api/youtube/pubsub)" },
      { status: 400 }
    );
  }

  const res = await fetch(HUB_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      "hub.callback": process.env.PUBSUB_CALLBACK_URL,
      "hub.mode": mode,
      "hub.topic": TOPIC,
      "hub.verify": "sync",
      "hub.lease_seconds": "864000",
      "hub.secret": process.env.PUBSUB_SECRET || "",
    }),
  });

  const text = await res.text();
  console.log("[pubsub] subscribe response", res.status, text);

  if (res.ok) {
    return NextResponse.json({ ok: true, message: `YouTube PubSubHubbub ${mode}d. Expect a GET verification request shortly.` });
  }

  return NextResponse.json({ error: text }, { status: 500 });
}

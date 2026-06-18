import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const CHANNEL_ID = "UCBvTTBLD1wD1jTQs0OeBZ4Q";

const HUB_URL = "https://pubsubhubbub.appspot.com/subscribe";
const TOPIC = `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

const CALLBACK_SECRET = process.env.PUBSUB_SECRET || "";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const challenge = searchParams.get("hub.challenge");
  const topic = searchParams.get("hub.topic");

  if (mode === "subscribe" && topic === TOPIC && challenge) {
    console.log("[pubsub] subscription verified for", topic);
    return new Response(challenge, { status: 200 });
  }

  if (mode === "unsubscribe" && topic === TOPIC) {
    console.log("[pubsub] unsubscribed from", topic);
    return new Response(challenge || "ok", { status: 200 });
  }

  return new Response("Bad request", { status: 400 });
}

export async function POST(request: Request) {
  const text = await request.text();

  const videoId = text.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
  const title = text.match(/<title[^>]*>([^<]+)<\/title>/)?.[1];

  console.log("[pubsub] new video:", videoId, title);

  revalidatePath("/lectures");
  revalidatePath("/api/lectures");

  return NextResponse.json({ ok: true });
}

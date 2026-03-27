import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const dc = apiKey?.split("-").pop(); // e.g. "us1" from "abc123-us1"

  if (!apiKey || !audienceId || !dc) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const res = await fetch(
    `https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
      },
      body: JSON.stringify({ email_address: email, status: "subscribed" }),
    }
  );

  if (!res.ok) {
    const body = await res.json();
    // 400 with "Member Exists" is fine — treat as success
    if (body.title === "Member Exists") {
      return NextResponse.json({ success: true });
    }
    console.error("Mailchimp error:", body);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (webhookUrl) {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `New signup: **${email}** at ${new Date().toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short", timeZone: "UTC" })} UTC`,
      }),
    }).catch((err) => console.error("Discord webhook error:", err));
  }

  return NextResponse.json({ success: true });
}

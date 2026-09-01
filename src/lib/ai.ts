import { createServerFn } from "@tanstack/react-start";
import { TEMPLATES } from "@/lib/templates";

const XAI = "https://api.x.ai/v1";
const TEMPLATE_FILES = new Set(
  TEMPLATES.filter((t) => t.file.startsWith("/templates/")).map((t) => t.file),
);

function apiKey() {
  return process.env.XAI_API_KEY ?? "";
}

async function xaiFetch(path: string, init: RequestInit & { timeoutMs?: number }) {
  const key = apiKey();
  if (!key) {
    return { ok: false as const, status: 0, error: "AI is not available in this environment" };
  }
  const { timeoutMs = 90_000, ...rest } = init;
  const res = await fetch(`${XAI}${path}`, {
    ...rest,
    signal: rest.signal ?? AbortSignal.timeout(timeoutMs),
    headers: {
      Authorization: `Bearer ${key}`,
      ...(rest.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(rest.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return {
      ok: false as const,
      status: res.status,
      error: parseXaiError(text, res.status),
    };
  }
  return { ok: true as const, res };
}

function parseXaiError(text: string, status: number) {
  try {
    const json = JSON.parse(text) as { error?: { message?: string } | string };
    if (typeof json.error === "string") return json.error;
    if (json.error?.message) return json.error.message;
  } catch {
    /* ignore */
  }
  return `xAI API error ${status}`;
}

function extractJson<T>(text: string): T | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}

export const getAiStatus = createServerFn({ method: "GET" }).handler(async () => {
  return { available: Boolean(apiKey()) };
});

export type DirectorResult = {
  actions: Array<"hook" | "script" | "image" | "video" | "voice">;
  hook: string;
  script: string;
  caption: string;
  imagePrompt: string;
  videoPrompt: string;
  voiceText: string;
};

export const directReel = createServerFn({ method: "POST" })
  .validator((input: { prompt: string; context: string }) => input)
  .handler(async ({ data }): Promise<{ ok: true; result: DirectorResult } | { ok: false; error: string }> => {
    const prompt = data.prompt.trim().slice(0, 400);
    if (!prompt) return { ok: false, error: "Say what you want on this take." };

    const call = await xaiFetch("/chat/completions", {
      method: "POST",
      timeoutMs: 45_000,
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.7,
        max_tokens: 900,
        messages: [
          {
            role: "system",
            content: `You are the director for SLATE, a vertical Instagram Reel / YouTube Shorts studio.
Return ONLY JSON with this shape:
{
  "actions": ["hook"|"script"|"image"|"video"|"voice"],
  "hook": "max 6 words, no hashtags, no emoji, stop-the-scroll overlay text",
  "script": "spoken-word script 12-35 seconds, no stage directions, no hashtags, no emoji",
  "caption": "one-line IG caption, no hashtags unless essential, no emoji",
  "imagePrompt": "photoreal 9:16 cinematic still, no people faces, no text in the image, dark lower third",
  "videoPrompt": "photoreal 9:16 motion, no people faces, no text in frame",
  "voiceText": "the exact words to speak, usually the script"
}
Rules:
- Only include actions the user clearly asked for, plus hook+script when they ask for a reel, topic, or idea.
- Never add "video" unless they said video, clip, animate, footage, motion, or film.
- Prefer "image" for scene, background, thumbnail, photo, still, generate media.
- Add "voice" only if they mentioned voice, VO, narrate, speak, or read.
- hook is overlay thumbnail text, punchy, uppercase-friendly.
- Never invent brand logos or celebrity likenesses.`,
          },
          {
            role: "user",
            content: `Current reel:\n${data.context.slice(0, 800)}\n\nRequest:\n${prompt}`,
          },
        ],
      }),
    });
    if (!call.ok) return { ok: false, error: call.error };
    const body = (await call.res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content ?? "";
    const parsed = extractJson<DirectorResult>(text);
    if (!parsed) return { ok: false, error: "Director could not read that prompt." };
    const actions = Array.isArray(parsed.actions) ? parsed.actions : [];
    return {
      ok: true,
      result: {
        actions: actions.filter((a) =>
          ["hook", "script", "image", "video", "voice"].includes(a),
        ) as DirectorResult["actions"],
        hook: String(parsed.hook ?? "").slice(0, 80),
        script: String(parsed.script ?? "").slice(0, 1600),
        caption: String(parsed.caption ?? "").slice(0, 220),
        imagePrompt: String(parsed.imagePrompt ?? "").slice(0, 700),
        videoPrompt: String(parsed.videoPrompt ?? "").slice(0, 700),
        voiceText: String(parsed.voiceText ?? parsed.script ?? "").slice(0, 1200),
      },
    };
  });

export const writeScript = createServerFn({ method: "POST" })
  .validator((input: { topic: string; tone: string }) => input)
  .handler(async ({ data }): Promise<
    | { ok: true; hook: string; script: string; caption: string }
    | { ok: false; error: string }
  > => {
    const topic = data.topic.trim().slice(0, 280);
    if (!topic) return { ok: false, error: "Give the script a topic." };
    const call = await xaiFetch("/chat/completions", {
      method: "POST",
      timeoutMs: 45_000,
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.8,
        max_tokens: 700,
        messages: [
          {
            role: "system",
            content:
              "Write short-form vertical video scripts. Return ONLY JSON {hook, script, caption}. No emoji, no hashtags, no stage directions. Hook is max 6 words. Script is 12-30 seconds spoken.",
          },
          {
            role: "user",
            content: `Tone: ${data.tone}\nTopic: ${topic}`,
          },
        ],
      }),
    });
    if (!call.ok) return { ok: false, error: call.error };
    const body = (await call.res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const parsed = extractJson<{ hook?: string; script?: string; caption?: string }>(
      body.choices?.[0]?.message?.content ?? "",
    );
    if (!parsed?.script) return { ok: false, error: "Could not write that script." };
    return {
      ok: true,
      hook: String(parsed.hook ?? "").slice(0, 80),
      script: String(parsed.script).slice(0, 1600),
      caption: String(parsed.caption ?? "").slice(0, 220),
    };
  });

export const writeHook = createServerFn({ method: "POST" })
  .validator((input: { topic: string }) => input)
  .handler(async ({ data }): Promise<{ ok: true; hook: string } | { ok: false; error: string }> => {
    const topic = data.topic.trim().slice(0, 280);
    if (!topic) return { ok: false, error: "Need a topic for the hook." };
    const call = await xaiFetch("/chat/completions", {
      method: "POST",
      timeoutMs: 30_000,
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.9,
        max_tokens: 80,
        messages: [
          {
            role: "system",
            content:
              "Write one stop-the-scroll overlay line for a 9:16 reel. Max 6 words. No emoji, no hashtags, no quotes. Return plain text only.",
          },
          { role: "user", content: topic },
        ],
      }),
    });
    if (!call.ok) return { ok: false, error: call.error };
    const body = (await call.res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const hook = (body.choices?.[0]?.message?.content ?? "")
      .replace(/["']/g, "")
      .trim()
      .slice(0, 80);
    if (!hook) return { ok: false, error: "Could not write a hook." };
    return { ok: true, hook };
  });

async function bufferToDataUrl(res: Response, fallbackMime: string) {
  const mime = res.headers.get("content-type") || fallbackMime;
  const buf = Buffer.from(await res.arrayBuffer());
  return `data:${mime.split(";")[0]};base64,${buf.toString("base64")}`;
}

async function urlToDataUrl(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Could not fetch generated media");
  return bufferToDataUrl(res, "image/jpeg");
}

export const generateStill = createServerFn({ method: "POST" })
  .validator((input: { prompt: string }) => input)
  .handler(async ({ data }): Promise<{ ok: true; url: string } | { ok: false; error: string }> => {
    const prompt = data.prompt.trim().slice(0, 700);
    if (!prompt) return { ok: false, error: "Describe the still." };
    const full = `${prompt}. Vertical 9:16 composition, cinematic lighting, photoreal, no text, no watermark, no logos, no readable signage, dark lower third.`;
    const models = ["grok-imagine-image-2.0", "grok-imagine-image-quality", "grok-imagine-image"];
    let lastError = "Image generation failed";
    for (const model of models) {
      const call = await xaiFetch("/images/generations", {
        method: "POST",
        timeoutMs: 90_000,
        body: JSON.stringify({
          model,
          prompt: full,
          n: 1,
          resolution: "1k",
          aspect_ratio: "9:16",
        }),
      });
      if (!call.ok) {
        lastError = call.error;
        continue;
      }
      const body = (await call.res.json()) as {
        data?: { url?: string; b64_json?: string }[];
        url?: string;
      };
      const item = body.data?.[0];
      if (item?.b64_json) {
        return { ok: true, url: `data:image/jpeg;base64,${item.b64_json}` };
      }
      const url = item?.url ?? body.url;
      if (!url) {
        lastError = "No image returned";
        continue;
      }
      try {
        return { ok: true, url: await urlToDataUrl(url) };
      } catch {
        return { ok: true, url };
      }
    }
    return { ok: false, error: lastError };
  });

async function resolveStill(image?: string | null) {
  if (!image) return undefined;
  if (image.startsWith("color:") || image.startsWith("blob:")) return undefined;
  if (image.startsWith("data:image")) return image;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/templates/") && TEMPLATE_FILES.has(image)) {
    try {
      const { readFile } = await import("node:fs/promises");
      const { join } = await import("node:path");
      const buf = await readFile(join(process.cwd(), "public", image.replace(/^\//, "")));
      return `data:image/jpeg;base64,${buf.toString("base64")}`;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export const startClip = createServerFn({ method: "POST" })
  .validator(
    (input: { prompt: string; duration: 6 | 10; image?: string | null }) => input,
  )
  .handler(async ({ data }): Promise<{ ok: true; requestId: string } | { ok: false; error: string }> => {
    const prompt = data.prompt.trim().slice(0, 700);
    if (!prompt) return { ok: false, error: "Describe the clip." };
    const body: Record<string, unknown> = {
      model: "grok-imagine-video-1.5",
      prompt: `${prompt}. Vertical 9:16, photoreal, no text overlay, no watermark.`,
      duration: data.duration,
      aspect_ratio: "9:16",
      resolution: "480p",
      generate_audio: true,
    };
    const still = await resolveStill(data.image);
    if (still) {
      body.image = { url: still };
    }
    const call = await xaiFetch("/videos/generations", {
      method: "POST",
      timeoutMs: 60_000,
      body: JSON.stringify(body),
    });
    if (!call.ok) return { ok: false, error: call.error };
    const json = (await call.res.json()) as { request_id?: string; id?: string };
    const requestId = json.request_id ?? json.id;
    if (!requestId) return { ok: false, error: "Clip did not start." };
    return { ok: true, requestId };
  });

export const pollClip = createServerFn({ method: "POST" })
  .validator((input: { requestId: string }) => input)
  .handler(async ({ data }): Promise<
    | { ok: true; status: string; url?: string }
    | { ok: false; error: string }
  > => {
    const id = data.requestId.replace(/[^a-zA-Z0-9_-]/g, "");
    if (!id) return { ok: false, error: "Missing clip id." };
    const call = await xaiFetch(`/videos/${id}`, { method: "GET", timeoutMs: 30_000 });
    if (!call.ok) return { ok: false, error: call.error };
    const json = (await call.res.json()) as {
      status?: string;
      video?: { url?: string };
      url?: string;
      error?: { message?: string };
    };
    const status = json.status ?? "pending";
    const url = json.video?.url ?? json.url;
    if (status === "failed" || status === "expired") {
      return { ok: false, error: json.error?.message ?? `Clip ${status}.` };
    }
    if (status === "done" && url) {
      try {
        const ingested = await urlToDataUrl(url);
        if (ingested.length < 9_000_000) {
          return { ok: true, status, url: ingested };
        }
      } catch {
        /* keep remote url */
      }
      return { ok: true, status, url };
    }
    return { ok: true, status, url };
  });

export const ingestMedia = createServerFn({ method: "POST" })
  .validator((input: { url: string }) => input)
  .handler(async ({ data }): Promise<{ ok: true; url: string } | { ok: false; error: string }> => {
    const url = data.url.trim();
    if (!url.startsWith("https://") && !url.startsWith("http://")) {
      return { ok: false, error: "Invalid media url." };
    }
    try {
      const ingested = await urlToDataUrl(url);
      if (ingested.length > 12_000_000) {
        return { ok: false, error: "Clip is too large to cache." };
      }
      return { ok: true, url: ingested };
    } catch {
      return { ok: false, error: "Could not fetch clip." };
    }
  });

export const speakScript = createServerFn({ method: "POST" })
  .validator((input: { text: string; voiceId: string }) => input)
  .handler(async ({ data }): Promise<{ ok: true; audio: string } | { ok: false; error: string }> => {
    const text = data.text.trim().slice(0, 1200);
    if (!text) return { ok: false, error: "Nothing to speak." };
    const call = await xaiFetch("/tts", {
      method: "POST",
      timeoutMs: 60_000,
      body: JSON.stringify({
        text,
        voice_id: data.voiceId || "eve",
        language: "en",
      }),
    });
    if (!call.ok) return { ok: false, error: call.error };
    const audio = await bufferToDataUrl(call.res, "audio/mpeg");
    return { ok: true, audio };
  });

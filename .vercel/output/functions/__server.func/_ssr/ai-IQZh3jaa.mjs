import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { s as TEMPLATES } from "./templates-DZD5lCEg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-IQZh3jaa.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var XAI = "https://api.x.ai/v1";
var TEMPLATE_FILES = new Set(TEMPLATES.filter((t) => t.file.startsWith("/templates/")).map((t) => t.file));
function apiKey() {
	return process.env.XAI_API_KEY ?? "";
}
async function xaiFetch(path, init) {
	const key = apiKey();
	if (!key) return {
		ok: false,
		status: 0,
		error: "AI is not available in this environment"
	};
	const { timeoutMs = 9e4, ...rest } = init;
	const res = await fetch(`${XAI}${path}`, {
		...rest,
		signal: rest.signal ?? AbortSignal.timeout(timeoutMs),
		headers: {
			Authorization: `Bearer ${key}`,
			...rest.body instanceof FormData ? {} : { "Content-Type": "application/json" },
			...rest.headers ?? {}
		}
	});
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		return {
			ok: false,
			status: res.status,
			error: parseXaiError(text, res.status)
		};
	}
	return {
		ok: true,
		res
	};
}
function parseXaiError(text, status) {
	try {
		const json = JSON.parse(text);
		if (typeof json.error === "string") return json.error;
		if (json.error?.message) return json.error.message;
	} catch {}
	return `xAI API error ${status}`;
}
function extractJson(text) {
	const start = text.indexOf("{");
	const end = text.lastIndexOf("}");
	if (start < 0 || end <= start) return null;
	try {
		return JSON.parse(text.slice(start, end + 1));
	} catch {
		return null;
	}
}
var getAiStatus_createServerFn_handler = createServerRpc({
	id: "f55d85520203b0ca68806b32dd775d224e89e7dbf6a1371fbfe6857a9f8e3df4",
	name: "getAiStatus",
	filename: "src/lib/ai.ts"
}, (opts) => getAiStatus.__executeServer(opts));
var getAiStatus = createServerFn({ method: "GET" }).handler(getAiStatus_createServerFn_handler, async () => {
	return { available: Boolean(apiKey()) };
});
var directReel_createServerFn_handler = createServerRpc({
	id: "f618220103a74dbad1361fe4605ad6243ceb97c8db1cc77dbf70da43008e3a85",
	name: "directReel",
	filename: "src/lib/ai.ts"
}, (opts) => directReel.__executeServer(opts));
var directReel = createServerFn({ method: "POST" }).validator((input) => input).handler(directReel_createServerFn_handler, async ({ data }) => {
	const prompt = data.prompt.trim().slice(0, 400);
	if (!prompt) return {
		ok: false,
		error: "Say what you want on this take."
	};
	const call = await xaiFetch("/chat/completions", {
		method: "POST",
		timeoutMs: 45e3,
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .7,
			max_tokens: 900,
			messages: [{
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
- Never invent brand logos or celebrity likenesses.`
			}, {
				role: "user",
				content: `Current reel:\n${data.context.slice(0, 800)}\n\nRequest:\n${prompt}`
			}]
		})
	});
	if (!call.ok) return {
		ok: false,
		error: call.error
	};
	const parsed = extractJson((await call.res.json()).choices?.[0]?.message?.content ?? "");
	if (!parsed) return {
		ok: false,
		error: "Director could not read that prompt."
	};
	return {
		ok: true,
		result: {
			actions: (Array.isArray(parsed.actions) ? parsed.actions : []).filter((a) => [
				"hook",
				"script",
				"image",
				"video",
				"voice"
			].includes(a)),
			hook: String(parsed.hook ?? "").slice(0, 80),
			script: String(parsed.script ?? "").slice(0, 1600),
			caption: String(parsed.caption ?? "").slice(0, 220),
			imagePrompt: String(parsed.imagePrompt ?? "").slice(0, 700),
			videoPrompt: String(parsed.videoPrompt ?? "").slice(0, 700),
			voiceText: String(parsed.voiceText ?? parsed.script ?? "").slice(0, 1200)
		}
	};
});
var writeScript_createServerFn_handler = createServerRpc({
	id: "ebe1ec8fe57c0cf02e198a9a91a6d48c31b6d2dc5f9903634707a66c6d618b40",
	name: "writeScript",
	filename: "src/lib/ai.ts"
}, (opts) => writeScript.__executeServer(opts));
var writeScript = createServerFn({ method: "POST" }).validator((input) => input).handler(writeScript_createServerFn_handler, async ({ data }) => {
	const topic = data.topic.trim().slice(0, 280);
	if (!topic) return {
		ok: false,
		error: "Give the script a topic."
	};
	const call = await xaiFetch("/chat/completions", {
		method: "POST",
		timeoutMs: 45e3,
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .8,
			max_tokens: 700,
			messages: [{
				role: "system",
				content: "Write short-form vertical video scripts. Return ONLY JSON {hook, script, caption}. No emoji, no hashtags, no stage directions. Hook is max 6 words. Script is 12-30 seconds spoken."
			}, {
				role: "user",
				content: `Tone: ${data.tone}\nTopic: ${topic}`
			}]
		})
	});
	if (!call.ok) return {
		ok: false,
		error: call.error
	};
	const parsed = extractJson((await call.res.json()).choices?.[0]?.message?.content ?? "");
	if (!parsed?.script) return {
		ok: false,
		error: "Could not write that script."
	};
	return {
		ok: true,
		hook: String(parsed.hook ?? "").slice(0, 80),
		script: String(parsed.script).slice(0, 1600),
		caption: String(parsed.caption ?? "").slice(0, 220)
	};
});
var writeHook_createServerFn_handler = createServerRpc({
	id: "99af0f4b76508d362387fc957e740246d4c9e4dc2e5882a741a9e5c5ef4e81d4",
	name: "writeHook",
	filename: "src/lib/ai.ts"
}, (opts) => writeHook.__executeServer(opts));
var writeHook = createServerFn({ method: "POST" }).validator((input) => input).handler(writeHook_createServerFn_handler, async ({ data }) => {
	const topic = data.topic.trim().slice(0, 280);
	if (!topic) return {
		ok: false,
		error: "Need a topic for the hook."
	};
	const call = await xaiFetch("/chat/completions", {
		method: "POST",
		timeoutMs: 3e4,
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .9,
			max_tokens: 80,
			messages: [{
				role: "system",
				content: "Write one stop-the-scroll overlay line for a 9:16 reel. Max 6 words. No emoji, no hashtags, no quotes. Return plain text only."
			}, {
				role: "user",
				content: topic
			}]
		})
	});
	if (!call.ok) return {
		ok: false,
		error: call.error
	};
	const hook = ((await call.res.json()).choices?.[0]?.message?.content ?? "").replace(/["']/g, "").trim().slice(0, 80);
	if (!hook) return {
		ok: false,
		error: "Could not write a hook."
	};
	return {
		ok: true,
		hook
	};
});
async function bufferToDataUrl(res, fallbackMime) {
	const mime = res.headers.get("content-type") || fallbackMime;
	const buf = Buffer.from(await res.arrayBuffer());
	return `data:${mime.split(";")[0]};base64,${buf.toString("base64")}`;
}
async function urlToDataUrl(url) {
	const res = await fetch(url);
	if (!res.ok) throw new Error("Could not fetch generated media");
	return bufferToDataUrl(res, "image/jpeg");
}
var generateStill_createServerFn_handler = createServerRpc({
	id: "74e4bd1692b6eb8646ef14c88cce0deeb7ed40d51037424f8eed2c607e32a3fe",
	name: "generateStill",
	filename: "src/lib/ai.ts"
}, (opts) => generateStill.__executeServer(opts));
var generateStill = createServerFn({ method: "POST" }).validator((input) => input).handler(generateStill_createServerFn_handler, async ({ data }) => {
	const prompt = data.prompt.trim().slice(0, 700);
	if (!prompt) return {
		ok: false,
		error: "Describe the still."
	};
	const full = `${prompt}. Vertical 9:16 composition, cinematic lighting, photoreal, no text, no watermark, no logos, no readable signage, dark lower third.`;
	const models = [
		"grok-imagine-image-2.0",
		"grok-imagine-image-quality",
		"grok-imagine-image"
	];
	let lastError = "Image generation failed";
	for (const model of models) {
		const call = await xaiFetch("/images/generations", {
			method: "POST",
			timeoutMs: 9e4,
			body: JSON.stringify({
				model,
				prompt: full,
				n: 1,
				resolution: "1k",
				aspect_ratio: "9:16"
			})
		});
		if (!call.ok) {
			lastError = call.error;
			continue;
		}
		const body = await call.res.json();
		const item = body.data?.[0];
		if (item?.b64_json) return {
			ok: true,
			url: `data:image/jpeg;base64,${item.b64_json}`
		};
		const url = item?.url ?? body.url;
		if (!url) {
			lastError = "No image returned";
			continue;
		}
		try {
			return {
				ok: true,
				url: await urlToDataUrl(url)
			};
		} catch {
			return {
				ok: true,
				url
			};
		}
	}
	return {
		ok: false,
		error: lastError
	};
});
async function resolveStill(image) {
	if (!image) return void 0;
	if (image.startsWith("color:") || image.startsWith("blob:")) return void 0;
	if (image.startsWith("data:image")) return image;
	if (image.startsWith("http://") || image.startsWith("https://")) return image;
	if (image.startsWith("/templates/") && TEMPLATE_FILES.has(image)) try {
		const { readFile } = await import("node:fs/promises");
		const { join } = await import("node:path");
		return `data:image/jpeg;base64,${(await readFile(join(process.cwd(), "public", image.replace(/^\//, "")))).toString("base64")}`;
	} catch {
		return;
	}
}
var startClip_createServerFn_handler = createServerRpc({
	id: "a72e56185b4e6e03f84d3e89f744053eb774d4aae32e277946ddb8ac6d699f54",
	name: "startClip",
	filename: "src/lib/ai.ts"
}, (opts) => startClip.__executeServer(opts));
var startClip = createServerFn({ method: "POST" }).validator((input) => input).handler(startClip_createServerFn_handler, async ({ data }) => {
	const prompt = data.prompt.trim().slice(0, 700);
	if (!prompt) return {
		ok: false,
		error: "Describe the clip."
	};
	const body = {
		model: "grok-imagine-video-1.5",
		prompt: `${prompt}. Vertical 9:16, photoreal, no text overlay, no watermark.`,
		duration: data.duration,
		aspect_ratio: "9:16",
		resolution: "480p",
		generate_audio: true
	};
	const still = await resolveStill(data.image);
	if (still) body.image = { url: still };
	const call = await xaiFetch("/videos/generations", {
		method: "POST",
		timeoutMs: 6e4,
		body: JSON.stringify(body)
	});
	if (!call.ok) return {
		ok: false,
		error: call.error
	};
	const json = await call.res.json();
	const requestId = json.request_id ?? json.id;
	if (!requestId) return {
		ok: false,
		error: "Clip did not start."
	};
	return {
		ok: true,
		requestId
	};
});
var pollClip_createServerFn_handler = createServerRpc({
	id: "c09f908c6f6410f2f878636627d927798425e098b2345668c86a5b9a40970442",
	name: "pollClip",
	filename: "src/lib/ai.ts"
}, (opts) => pollClip.__executeServer(opts));
var pollClip = createServerFn({ method: "POST" }).validator((input) => input).handler(pollClip_createServerFn_handler, async ({ data }) => {
	const id = data.requestId.replace(/[^a-zA-Z0-9_-]/g, "");
	if (!id) return {
		ok: false,
		error: "Missing clip id."
	};
	const call = await xaiFetch(`/videos/${id}`, {
		method: "GET",
		timeoutMs: 3e4
	});
	if (!call.ok) return {
		ok: false,
		error: call.error
	};
	const json = await call.res.json();
	const status = json.status ?? "pending";
	const url = json.video?.url ?? json.url;
	if (status === "failed" || status === "expired") return {
		ok: false,
		error: json.error?.message ?? `Clip ${status}.`
	};
	if (status === "done" && url) {
		try {
			const ingested = await urlToDataUrl(url);
			if (ingested.length < 9e6) return {
				ok: true,
				status,
				url: ingested
			};
		} catch {}
		return {
			ok: true,
			status,
			url
		};
	}
	return {
		ok: true,
		status,
		url
	};
});
var ingestMedia_createServerFn_handler = createServerRpc({
	id: "94bc5cac95a2fd2076eb9e7a58bb92c8488e861930cefc16bb13ebdefd08ca65",
	name: "ingestMedia",
	filename: "src/lib/ai.ts"
}, (opts) => ingestMedia.__executeServer(opts));
var ingestMedia = createServerFn({ method: "POST" }).validator((input) => input).handler(ingestMedia_createServerFn_handler, async ({ data }) => {
	const url = data.url.trim();
	if (!url.startsWith("https://") && !url.startsWith("http://")) return {
		ok: false,
		error: "Invalid media url."
	};
	try {
		const ingested = await urlToDataUrl(url);
		if (ingested.length > 12e6) return {
			ok: false,
			error: "Clip is too large to cache."
		};
		return {
			ok: true,
			url: ingested
		};
	} catch {
		return {
			ok: false,
			error: "Could not fetch clip."
		};
	}
});
var speakScript_createServerFn_handler = createServerRpc({
	id: "4bae1623b7460d2b59efc5ecc69253099afc67b79f146e7cd038aa1b906b9766",
	name: "speakScript",
	filename: "src/lib/ai.ts"
}, (opts) => speakScript.__executeServer(opts));
var speakScript = createServerFn({ method: "POST" }).validator((input) => input).handler(speakScript_createServerFn_handler, async ({ data }) => {
	const text = data.text.trim().slice(0, 1200);
	if (!text) return {
		ok: false,
		error: "Nothing to speak."
	};
	const call = await xaiFetch("/tts", {
		method: "POST",
		timeoutMs: 6e4,
		body: JSON.stringify({
			text,
			voice_id: data.voiceId || "eve",
			language: "en"
		})
	});
	if (!call.ok) return {
		ok: false,
		error: call.error
	};
	return {
		ok: true,
		audio: await bufferToDataUrl(call.res, "audio/mpeg")
	};
});
//#endregion
export { directReel_createServerFn_handler, generateStill_createServerFn_handler, getAiStatus_createServerFn_handler, ingestMedia_createServerFn_handler, pollClip_createServerFn_handler, speakScript_createServerFn_handler, startClip_createServerFn_handler, writeHook_createServerFn_handler, writeScript_createServerFn_handler };

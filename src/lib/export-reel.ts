import { downloadBlob, loadImage, slugify } from "@/lib/utils";
import { isColorMedia, mediaFill, type HookAlign, type HookStyle, type LogoPosition } from "@/lib/templates";

export type OverlayState = {
  hook: string;
  hookStyle: HookStyle;
  hookAlign: HookAlign;
  channelName: string;
  handle: string;
  logoUrl: string;
  logoPosition: LogoPosition;
  logoScale: number;
  caption: string;
};

const W = 1080;
const H = 1920;

function hookFont(style: HookStyle, ctx: CanvasRenderingContext2D) {
  if (style === "cinematic") {
    ctx.font = "700 96px 'Bebas Neue', 'Arial Narrow', Impact, sans-serif";
    ctx.letterSpacing = "0.06em";
  } else if (style === "bold") {
    ctx.font = "700 72px Outfit, sans-serif";
    ctx.letterSpacing = "-0.03em";
  } else if (style === "minimal") {
    ctx.font = "500 42px Outfit, sans-serif";
    ctx.letterSpacing = "0.28em";
  } else {
    ctx.font = "500 44px Outfit, sans-serif";
    ctx.letterSpacing = "0";
  }
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

function coverDraw(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  sw: number,
  sh: number,
  zoom = 1,
) {
  const scale = Math.max(W / sw, H / sh) * zoom;
  const dw = sw * scale;
  const dh = sh * scale;
  const dx = (W - dw) / 2;
  const dy = (H - dh) / 2;
  ctx.drawImage(source, dx, dy, dw, dh);
}

function drawGradients(ctx: CanvasRenderingContext2D) {
  const top = ctx.createLinearGradient(0, 0, 0, 280);
  top.addColorStop(0, "rgba(0,0,0,0.45)");
  top.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = top;
  ctx.fillRect(0, 0, W, 280);

  const bot = ctx.createLinearGradient(0, H - 720, 0, H);
  bot.addColorStop(0, "rgba(0,0,0,0)");
  bot.addColorStop(1, "rgba(0,0,0,0.78)");
  ctx.fillStyle = bot;
  ctx.fillRect(0, H - 720, W, 720);
}

function hookY(align: HookAlign, lineCount: number, lineHeight: number) {
  const block = lineCount * lineHeight;
  if (align === "top") return 220;
  if (align === "center") return (H - block) / 2;
  return H - 520 - block;
}

function roundedClip(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.clip();
}

function roundedStroke(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.stroke();
}

function drawOverlays(
  ctx: CanvasRenderingContext2D,
  overlay: OverlayState,
  logo: HTMLImageElement | null,
) {
  drawGradients(ctx);

  if (overlay.hook.trim()) {
    hookFont(overlay.hookStyle, ctx);
    ctx.fillStyle = "#f4f4f5";
    ctx.textAlign = overlay.hookStyle === "minimal" ? "center" : "left";
    ctx.textBaseline = "top";
    ctx.shadowColor = "rgba(0,0,0,0.85)";
    ctx.shadowBlur = 18;
    const maxW = W - 200;
    const lines = wrapLines(ctx, overlay.hook.toUpperCase(), maxW);
    const lineHeight =
      overlay.hookStyle === "cinematic" ? 102 : overlay.hookStyle === "bold" ? 84 : 56;
    const x = overlay.hookStyle === "minimal" ? W / 2 : 72;
    let y = hookY(overlay.hookAlign, lines.length, lineHeight);
    for (const line of lines) {
      ctx.fillText(line, x, y);
      y += lineHeight;
    }
    ctx.shadowBlur = 0;
  }

  const logoSize = Math.round(88 * overlay.logoScale);
  const pad = 64;
  const lx =
    overlay.logoPosition === "tr" || overlay.logoPosition === "br" ? W - pad - logoSize : pad;
  const ly =
    overlay.logoPosition === "tl" || overlay.logoPosition === "tr" ? pad + 24 : H - pad - logoSize - 140;

  if (logo) {
    ctx.save();
    roundedClip(ctx, lx, ly, logoSize, logoSize, 22);
    ctx.drawImage(logo, lx, ly, logoSize, logoSize);
    ctx.restore();
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 2;
    roundedStroke(ctx, lx, ly, logoSize, logoSize, 22);
  }

  const right = overlay.logoPosition.endsWith("r");
  ctx.textAlign = right ? "right" : "left";
  ctx.textBaseline = "top";
  ctx.shadowColor = "rgba(0,0,0,0.7)";
  ctx.shadowBlur = 12;
  const nameX = right ? lx - 20 : lx + logoSize + 20;
  ctx.fillStyle = "#f4f4f5";
  ctx.font = "600 36px Outfit, sans-serif";
  ctx.letterSpacing = "0";
  ctx.fillText(overlay.channelName || "Your Channel", nameX, ly + 10);
  ctx.fillStyle = "rgba(244,244,245,0.72)";
  ctx.font = "500 28px Outfit, sans-serif";
  ctx.fillText(`@${overlay.handle.replace(/^@/, "") || "yourchannel"}`, nameX, ly + 54);
  ctx.shadowBlur = 0;

  if (overlay.caption.trim()) {
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(244,244,245,0.88)";
    ctx.font = "500 28px Outfit, sans-serif";
    const capLines = wrapLines(ctx, overlay.caption, W - 200);
    let cy = H - 160;
    for (const line of capLines.slice(0, 2)) {
      ctx.fillText(line, pad, cy);
      cy += 38;
    }
  }
}

async function waitFonts() {
  if (typeof document !== "undefined" && document.fonts?.ready) {
    await document.fonts.ready.catch(() => undefined);
  }
}

export async function renderPoster(mediaUrl: string, overlay: OverlayState): Promise<Blob> {
  await waitFonts();
  let logo: HTMLImageElement | null = null;
  try {
    logo = await loadImage(overlay.logoUrl);
  } catch {
    logo = null;
  }
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.fillStyle = isColorMedia(mediaUrl) ? mediaFill(mediaUrl) : "#0a0a0b";
  ctx.fillRect(0, 0, W, H);
  if (!isColorMedia(mediaUrl)) {
    const img = await loadImage(mediaUrl);
    coverDraw(ctx, img, img.width, img.height, 1);
  }
  drawOverlays(ctx, overlay, logo);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Could not export poster");
  return blob;
}

function pickRecorderMime() {
  const types = [
    "video/mp4;codecs=avc1,mp4a.40.2",
    "video/mp4",
    "video/webm;codecs=vp9,opus",
    "video/webm",
  ];
  for (const t of types) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t)) return t;
  }
  return "video/webm";
}

export async function renderReel(options: {
  mediaUrl: string;
  mediaKind: "image" | "video";
  overlay: OverlayState;
  voiceUrl: string | null;
  durationSec: number;
  onProgress?: (pct: number) => void;
}): Promise<{ blob: Blob; filename: string }> {
  if (typeof MediaRecorder === "undefined" || typeof HTMLCanvasElement === "undefined") {
    throw new Error("Video export is not supported in this browser");
  }
  await waitFonts();
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("Canvas unavailable");

  let logo: HTMLImageElement | null = null;
  try {
    logo = await loadImage(options.overlay.logoUrl);
  } catch {
    logo = null;
  }

  const mime = pickRecorderMime();
  const stream = canvas.captureStream(30);
  let audioCtx: AudioContext | null = null;
  const dest = (() => {
    try {
      audioCtx = new AudioContext();
      return audioCtx.createMediaStreamDestination();
    } catch {
      return null;
    }
  })();

  let voiceEl: HTMLAudioElement | null = null;
  let videoEl: HTMLVideoElement | null = null;
  let still: HTMLImageElement | null = null;
  const fill = isColorMedia(options.mediaUrl) ? mediaFill(options.mediaUrl) : "#0a0a0b";

  try {
    if (options.voiceUrl && audioCtx && dest) {
      voiceEl = new Audio(options.voiceUrl);
      voiceEl.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        const timer = window.setTimeout(() => reject(new Error("Voiceover failed to load")), 12_000);
        voiceEl!.oncanplaythrough = () => {
          window.clearTimeout(timer);
          resolve();
        };
        voiceEl!.onerror = () => {
          window.clearTimeout(timer);
          reject(new Error("Voiceover failed to load"));
        };
        voiceEl!.load();
      });
      const src = audioCtx.createMediaElementSource(voiceEl);
      src.connect(dest);
    }

    if (options.mediaKind === "video") {
      videoEl = document.createElement("video");
      videoEl.crossOrigin = "anonymous";
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.src = options.mediaUrl;
      await new Promise<void>((resolve, reject) => {
        const timer = window.setTimeout(() => reject(new Error("Clip failed to load for export")), 12_000);
        videoEl!.onloadeddata = () => {
          window.clearTimeout(timer);
          resolve();
        };
        videoEl!.onerror = () => {
          window.clearTimeout(timer);
          reject(new Error("Clip failed to load for export"));
        };
      });
      const capturable = videoEl as HTMLVideoElement & { captureStream?: () => MediaStream };
      if (!options.voiceUrl && dest && typeof capturable.captureStream === "function") {
        const vstream = capturable.captureStream();
        for (const track of vstream.getAudioTracks()) dest.stream.addTrack(track);
      }
    } else if (!isColorMedia(options.mediaUrl)) {
      still = await loadImage(options.mediaUrl);
    }

    if (dest) {
      for (const track of dest.stream.getAudioTracks()) {
        stream.addTrack(track);
      }
    }

    const duration = Math.max(
      4,
      options.voiceUrl && voiceEl && Number.isFinite(voiceEl.duration)
        ? Math.min(voiceEl.duration, 30)
        : options.durationSec,
    );

    const recorder = new MediaRecorder(stream, { mimeType: mime });
    const chunks: BlobPart[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size) chunks.push(e.data);
    };
    const stopped = new Promise<void>((resolve, reject) => {
      recorder.onstop = () => resolve();
      recorder.onerror = () => reject(new Error("Recorder failed"));
    });

    recorder.start(200);
    if (audioCtx) await audioCtx.resume().catch(() => undefined);
    const start = performance.now();
    if (voiceEl) void voiceEl.play().catch(() => undefined);
    if (videoEl) {
      videoEl.currentTime = 0;
      void videoEl.play().catch(() => undefined);
    }

    await new Promise<void>((resolve) => {
      const tick = () => {
        const t = (performance.now() - start) / 1000;
        options.onProgress?.(Math.min(99, (t / duration) * 100));
        ctx.fillStyle = fill;
        ctx.fillRect(0, 0, W, H);
        const reduce =
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const zoom = reduce || options.mediaKind === "video" ? 1 : 1 + 0.06 * (t / duration);
        if (videoEl && videoEl.videoWidth) {
          coverDraw(ctx, videoEl, videoEl.videoWidth, videoEl.videoHeight, 1);
        } else if (still) {
          coverDraw(ctx, still, still.width, still.height, zoom);
        }
        drawOverlays(ctx, options.overlay, logo);
        if (t >= duration) {
          resolve();
          return;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });

    if (voiceEl) voiceEl.pause();
    if (videoEl) videoEl.pause();
    if (recorder.state !== "inactive") recorder.stop();
    await stopped;

    const blob = new Blob(chunks, { type: mime.includes("mp4") ? "video/mp4" : "video/webm" });
    if (!blob.size) throw new Error("Export produced an empty file");
    const ext = blob.type.includes("mp4") ? "mp4" : "webm";
    const filename = `slate-${slugify(options.overlay.handle)}.${ext}`;
    return { blob, filename };
  } finally {
    if (voiceEl) {
      voiceEl.pause();
      voiceEl.src = "";
    }
    if (videoEl) {
      videoEl.pause();
      videoEl.src = "";
    }
    if (audioCtx && audioCtx.state !== "closed") {
      await audioCtx.close().catch(() => undefined);
    }
  }
}

export function exportFilename(handle: string, kind: "png" | "mp4" | "webm") {
  return `slate-${slugify(handle)}.${kind}`;
}

export async function shareFile(blob: Blob, filename: string, title: string, text: string) {
  const file = new File([blob], filename, { type: blob.type || "application/octet-stream" });
  const payload: ShareData = { title, text, files: [file] };
  if (typeof navigator.share === "function" && navigator.canShare?.(payload)) {
    await navigator.share(payload);
    return "shared" as const;
  }
  downloadBlob(blob, filename);
  if (text && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text).catch(() => undefined);
  }
  return "downloaded" as const;
}

export { downloadBlob };

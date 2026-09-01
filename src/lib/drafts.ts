import {
  isUsableMediaUrl,
  templateById,
  type HookAlign,
  type HookStyle,
  type LogoPosition,
} from "@/lib/templates";
import type { MediaKind } from "@/lib/studio-store";

export type StudioDraft = {
  id: string;
  name: string;
  savedAt: number;
  templateId: string;
  mediaUrl: string;
  mediaKind: MediaKind;
  posterUrl: string | null;
  hook: string;
  hookStyle: HookStyle;
  hookAlign: HookAlign;
  channelName: string;
  handle: string;
  logoUrl: string;
  logoPosition: LogoPosition;
  logoScale: number;
  script: string;
  caption: string;
  voiceId: string;
  voiceUrl: string | null;
  videoDuration: 6 | 10;
};

const KEY = "slate-drafts-v1";
const MAX_DRAFTS = 12;
const MAX_BYTES = 3_500_000;

function readRaw(): StudioDraft[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StudioDraft[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((d) => d && typeof d.id === "string" && typeof d.savedAt === "number");
  } catch {
    return [];
  }
}

function writeRaw(drafts: StudioDraft[]) {
  const trimmed = drafts.slice(0, MAX_DRAFTS);
  const json = JSON.stringify(trimmed);
  if (json.length > MAX_BYTES) {
    throw new Error("Draft is too large to keep on this device.");
  }
  localStorage.setItem(KEY, json);
}

function packUrl(url: string | null | undefined, fallback: string | null = null) {
  if (isUsableMediaUrl(url) && url && !url.startsWith("blob:")) {
    if (url.startsWith("data:") && url.length > 900_000) return fallback;
    return url;
  }
  return fallback;
}

export function listDrafts(): StudioDraft[] {
  return readRaw().sort((a, b) => b.savedAt - a.savedAt);
}

export function captureDraft(
  state: Omit<StudioDraft, "id" | "name" | "savedAt">,
  name: string,
): { draft: StudioDraft; dropped: string[] } {
  const template = templateById(state.templateId);
  const dropped: string[] = [];
  const mediaUrl = packUrl(state.mediaUrl, template.file) ?? template.file;
  if (mediaUrl !== state.mediaUrl) dropped.push("clip");
  const packedPoster = packUrl(state.posterUrl, null);
  const logoUrl = packUrl(state.logoUrl, "/logo.svg") ?? "/logo.svg";
  if (logoUrl !== state.logoUrl) dropped.push("logo");
  let voiceUrl = state.voiceUrl;
  if (voiceUrl && (!isUsableMediaUrl(voiceUrl) || voiceUrl.length > 700_000)) {
    voiceUrl = null;
    dropped.push("voice");
  }
  const draft: StudioDraft = {
    ...state,
    id: `d-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim().slice(0, 48) || state.hook.trim().slice(0, 32) || "Untitled take",
    savedAt: Date.now(),
    mediaUrl,
    mediaKind:
      state.mediaKind === "video" && mediaUrl === state.mediaUrl ? "video" : "image",
    posterUrl: packedPoster || (mediaUrl.startsWith("color:") ? mediaUrl : null),
    logoUrl,
    voiceUrl,
  };
  return { draft, dropped };
}

export function saveDraft(draft: StudioDraft): StudioDraft[] {
  const existing = readRaw().filter((d) => d.id !== draft.id);
  const next = [draft, ...existing].slice(0, MAX_DRAFTS);
  try {
    writeRaw(next);
    return next;
  } catch {
    const slim: StudioDraft = {
      ...draft,
      mediaUrl: templateById(draft.templateId).file,
      mediaKind: "image",
      posterUrl: null,
      voiceUrl: null,
      logoUrl: draft.logoUrl.startsWith("data:") ? "/logo.svg" : draft.logoUrl,
    };
    const slimNext = [slim, ...existing].slice(0, MAX_DRAFTS);
    writeRaw(slimNext);
    return slimNext;
  }
}

export function deleteDraft(id: string): StudioDraft[] {
  const next = readRaw().filter((d) => d.id !== id);
  try {
    writeRaw(next);
  } catch {
    /* ignore */
  }
  return next;
}

export function formatDraftTime(ts: number) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(ts);
  } catch {
    return "";
  }
}

export const AUTOSAVE_ID = "d-autosave";

export function upsertAutosave(state: Omit<StudioDraft, "id" | "name" | "savedAt">): StudioDraft[] {
  const { draft } = captureDraft(state, "Last take");
  const pinned: StudioDraft = { ...draft, id: AUTOSAVE_ID, name: "Last take" };
  const existing = readRaw().filter((d) => d.id !== AUTOSAVE_ID);
  const next = [pinned, ...existing].slice(0, MAX_DRAFTS);
  try {
    writeRaw(next);
    return next;
  } catch {
    return listDrafts();
  }
}

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  SCENE_TEMPLATES,
  isUsableMediaUrl,
  persistableMediaUrl,
  templateById,
  type HookAlign,
  type HookStyle,
  type LogoPosition,
} from "@/lib/templates";
import type { OverlayState } from "@/lib/export-reel";
import type { StudioDraft } from "@/lib/drafts";

export type MediaKind = "image" | "video";
export type ToolId =
  | "templates"
  | "logo"
  | "hook"
  | "script"
  | "media"
  | "voice"
  | "export";
export type BusyKind = "direct" | "script" | "image" | "video" | "voice" | "export";

export type StudioState = {
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
  playing: boolean;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  applyTemplate: (id: string) => void;
  setMedia: (url: string, kind: MediaKind, poster?: string | null) => void;
  setHook: (hook: string) => void;
  setHookStyle: (style: HookStyle) => void;
  setHookAlign: (align: HookAlign) => void;
  setChannelName: (name: string) => void;
  setHandle: (handle: string) => void;
  setLogoUrl: (url: string) => void;
  setLogoPosition: (pos: LogoPosition) => void;
  setLogoScale: (scale: number) => void;
  setScript: (script: string) => void;
  setCaption: (caption: string) => void;
  setVoiceId: (id: string) => void;
  setVoiceUrl: (url: string | null) => void;
  setVideoDuration: (n: 6 | 10) => void;
  setPlaying: (playing: boolean) => void;
  applyDraft: (draft: StudioDraft) => void;
  recoverMedia: () => void;
  failMedia: () => void;
  resetTake: () => void;
};

const first = SCENE_TEMPLATES[0];

const initial = {
  templateId: first.id,
  mediaUrl: first.file,
  mediaKind: "image" as const,
  posterUrl: first.file,
  hook: first.hook,
  hookStyle: first.style,
  hookAlign: first.align,
  channelName: "Your Channel",
  handle: "yourchannel",
  logoUrl: "/logo.svg",
  logoPosition: "bl" as const,
  logoScale: 1,
  script: "",
  caption: "",
  voiceId: "eve",
  voiceUrl: null as string | null,
  videoDuration: 6 as const,
  playing: false,
};

function revokeIfBlob(url: string | null | undefined) {
  if (url?.startsWith("blob:")) {
    try {
      URL.revokeObjectURL(url);
    } catch {
      /* ignore */
    }
  }
}

function releaseLater(url: string | null | undefined) {
  if (!url?.startsWith("blob:")) return;
  if (typeof window === "undefined") return;
  window.setTimeout(() => revokeIfBlob(url), 400);
}

const safeStorage = {
  getItem: (name: string) => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    try {
      localStorage.setItem(name, value);
    } catch {
      try {
        localStorage.removeItem(name);
        localStorage.setItem(name, value);
      } catch {
        /* quota — keep running */
      }
    }
  },
  removeItem: (name: string) => {
    try {
      localStorage.removeItem(name);
    } catch {
      /* ignore */
    }
  },
};

export const useStudio = create<StudioState>()(
  persist(
    (set, get) => ({
      ...initial,
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),
      applyTemplate: (id) => {
        const prev = get();
        const t = templateById(id);
        set({
          templateId: t.id,
          mediaUrl: t.file,
          mediaKind: "image",
          posterUrl: t.file,
          hook: t.hook,
          hookStyle: t.style,
          hookAlign: t.align,
          playing: false,
        });
        if (prev.mediaUrl !== t.file) releaseLater(prev.mediaUrl);
      },
      setMedia: (mediaUrl, mediaKind, posterUrl) => {
        const prev = get();
        set({
          mediaUrl,
          mediaKind,
          posterUrl: posterUrl ?? (mediaKind === "image" ? mediaUrl : prev.posterUrl),
          playing: false,
        });
        if (prev.mediaUrl !== mediaUrl) releaseLater(prev.mediaUrl);
      },
      setHook: (hook) => set({ hook }),
      setHookStyle: (hookStyle) => set({ hookStyle }),
      setHookAlign: (hookAlign) => set({ hookAlign }),
      setChannelName: (channelName) => set({ channelName }),
      setHandle: (handle) => set({ handle: handle.replace(/^@/, "") }),
      setLogoUrl: (logoUrl) => {
        const prev = get().logoUrl;
        set({ logoUrl });
        if (prev !== logoUrl) releaseLater(prev);
      },
      setLogoPosition: (logoPosition) => set({ logoPosition }),
      setLogoScale: (logoScale) => set({ logoScale }),
      setScript: (script) => set({ script }),
      setCaption: (caption) => set({ caption }),
      setVoiceId: (voiceId) => set({ voiceId }),
      setVoiceUrl: (voiceUrl) => {
        const prev = get().voiceUrl;
        set({ voiceUrl, playing: false });
        if (prev && prev !== voiceUrl) releaseLater(prev);
      },
      setVideoDuration: (videoDuration) => set({ videoDuration }),
      setPlaying: (playing) => set({ playing }),
      applyDraft: (draft) => {
        const prev = get();
        const mediaUrl = isUsableMediaUrl(draft.mediaUrl)
          ? draft.mediaUrl
          : templateById(draft.templateId).file;
        set({
          templateId: draft.templateId || first.id,
          mediaUrl,
          mediaKind: draft.mediaKind === "video" && isUsableMediaUrl(mediaUrl) ? "video" : "image",
          posterUrl: isUsableMediaUrl(draft.posterUrl) ? draft.posterUrl : mediaUrl,
          hook: draft.hook ?? "",
          hookStyle: draft.hookStyle ?? first.style,
          hookAlign: draft.hookAlign ?? first.align,
          channelName: draft.channelName || "Your Channel",
          handle: (draft.handle || "yourchannel").replace(/^@/, ""),
          logoUrl: isUsableMediaUrl(draft.logoUrl) ? draft.logoUrl : "/logo.svg",
          logoPosition: draft.logoPosition ?? "bl",
          logoScale: Number.isFinite(draft.logoScale) ? draft.logoScale : 1,
          script: draft.script ?? "",
          caption: draft.caption ?? "",
          voiceId: draft.voiceId || "eve",
          voiceUrl: isUsableMediaUrl(draft.voiceUrl) ? draft.voiceUrl : null,
          videoDuration: draft.videoDuration === 10 ? 10 : 6,
          playing: false,
        });
        if (prev.mediaUrl !== mediaUrl) releaseLater(prev.mediaUrl);
        if (prev.voiceUrl) releaseLater(prev.voiceUrl);
        if (prev.logoUrl !== get().logoUrl) releaseLater(prev.logoUrl);
      },
      recoverMedia: () => {
        const s = get();
        if (isUsableMediaUrl(s.mediaUrl) && (s.mediaKind === "image" || s.mediaKind === "video")) {
          if (s.playing) set({ playing: false });
          return;
        }
        const t = templateById(s.templateId);
        set({
          mediaUrl: t.file,
          posterUrl: t.file,
          mediaKind: "image",
          playing: false,
          voiceUrl: isUsableMediaUrl(s.voiceUrl) ? s.voiceUrl : null,
        });
      },
      failMedia: () => {
        const s = get();
        const t = templateById(s.templateId);
        if (s.mediaUrl === t.file && s.mediaKind === "image") {
          set({ playing: false });
          return;
        }
        set({
          mediaUrl: t.file,
          posterUrl: t.file,
          mediaKind: "image",
          playing: false,
        });
        if (s.mediaUrl !== t.file) releaseLater(s.mediaUrl);
      },
      resetTake: () => {
        const prev = get();
        set({ ...initial, hydrated: true });
        releaseLater(prev.mediaUrl);
        releaseLater(prev.voiceUrl);
        releaseLater(prev.logoUrl);
      },
    }),
    {
      name: "slate-studio-v3",
      storage: createJSONStorage(() => safeStorage),
      skipHydration: true,
      partialize: (s) => {
        const media = persistableMediaUrl(s.mediaUrl) || templateById(s.templateId).file;
        return {
          templateId: s.templateId,
          mediaUrl: media,
          mediaKind: persistableMediaUrl(s.mediaUrl) && s.mediaKind === "video" ? "video" : "image",
          posterUrl: persistableMediaUrl(s.posterUrl),
          hook: s.hook,
          hookStyle: s.hookStyle,
          hookAlign: s.hookAlign,
          channelName: s.channelName,
          handle: s.handle,
          logoPosition: s.logoPosition,
          logoScale: s.logoScale,
          script: s.script,
          caption: s.caption,
          voiceId: s.voiceId,
          videoDuration: s.videoDuration,
        };
      },
    },
  ),
);

export function overlayFrom(s: Pick<
  StudioState,
  | "hook"
  | "hookStyle"
  | "hookAlign"
  | "channelName"
  | "handle"
  | "logoUrl"
  | "logoPosition"
  | "logoScale"
  | "caption"
>): OverlayState {
  return {
    hook: s.hook,
    hookStyle: s.hookStyle,
    hookAlign: s.hookAlign,
    channelName: s.channelName,
    handle: s.handle,
    logoUrl: s.logoUrl,
    logoPosition: s.logoPosition,
    logoScale: s.logoScale,
    caption: s.caption,
  };
}

export const BUSY_COPY: Record<BusyKind, { title: string; note: string }> = {
  direct: { title: "Directing the take", note: "Reading your prompt" },
  script: { title: "Writing the script", note: "Short-form, spoken" },
  image: { title: "Shooting the still", note: "Vertical 9:16 frame" },
  video: { title: "Rolling the clip", note: "This can take a minute" },
  voice: { title: "Recording voiceover", note: "Matching your script" },
  export: { title: "Exporting the reel", note: "Compositing overlays" },
};

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Clapperboard,
  Download,
  ImagePlus,
  LayoutGrid,
  Mic,
  Play,
  RotateCcw,
  Save,
  ScrollText,
  SendHorizontal,
  Sparkles,
  Type,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStudio, type BusyKind, type ToolId } from "@/lib/studio-store";
import { BUSY_COPY } from "@/lib/studio-store";
import { QUICK_TAKES, VOICES, isColorMedia, mediaFill } from "@/lib/templates";

const TOOLS: { id: ToolId; label: string; icon: typeof LayoutGrid }[] = [
  { id: "templates", label: "Templates", icon: LayoutGrid },
  { id: "logo", label: "Logo", icon: Clapperboard },
  { id: "hook", label: "Hook", icon: Type },
  { id: "media", label: "Media", icon: ImagePlus },
  { id: "script", label: "Script", icon: ScrollText },
  { id: "voice", label: "Voice", icon: Mic },
  { id: "export", label: "Post", icon: Download },
];

type ReelStageProps = {
  activeTool: ToolId | null;
  onTool: (id: ToolId) => void;
  busy: BusyKind | null;
  prompt: string;
  onPrompt: (value: string) => void;
  onDirect: (text?: string) => void;
  onReset: () => void;
  onSaveDraft: () => void;
  onDownload: () => void;
  sheet: ReactNode;
  reduceMotion: boolean;
};

function formatClock(seconds: number) {
  const s = Math.max(0, Math.round(seconds));
  return `0:${String(s).padStart(2, "0")}`;
}

export function ReelStage({
  activeTool,
  onTool,
  busy,
  prompt,
  onPrompt,
  onDirect,
  onReset,
  onSaveDraft,
  onDownload,
  sheet,
  reduceMotion,
}: ReelStageProps) {
  const mediaUrl = useStudio((s) => s.mediaUrl);
  const mediaKind = useStudio((s) => s.mediaKind);
  const hook = useStudio((s) => s.hook);
  const hookStyle = useStudio((s) => s.hookStyle);
  const hookAlign = useStudio((s) => s.hookAlign);
  const channelName = useStudio((s) => s.channelName);
  const handle = useStudio((s) => s.handle);
  const logoUrl = useStudio((s) => s.logoUrl);
  const logoPosition = useStudio((s) => s.logoPosition);
  const logoScale = useStudio((s) => s.logoScale);
  const caption = useStudio((s) => s.caption);
  const voiceId = useStudio((s) => s.voiceId);
  const voiceUrl = useStudio((s) => s.voiceUrl);
  const videoDuration = useStudio((s) => s.videoDuration);
  const playing = useStudio((s) => s.playing);
  const setPlaying = useStudio((s) => s.setPlaying);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [logoFailed, setLogoFailed] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);

  const watching = playing && !activeTool && !busy;

  useEffect(() => {
    setLogoFailed(false);
  }, [logoUrl]);

  useEffect(() => {
    setMediaFailed(false);
  }, [mediaUrl]);

  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (playing) {
      setProgress(0);
      void video?.play().catch(() => undefined);
      if (voiceUrl) {
        if (audio) audio.currentTime = 0;
        void audio?.play().catch(() => undefined);
      }
    } else {
      video?.pause();
      audio?.pause();
    }
  }, [playing, mediaUrl, voiceUrl, mediaKind]);

  useEffect(() => {
    if (!playing || mediaKind === "video") return;
    const audio = audioRef.current;
    const durMs =
      (voiceUrl && audio && Number.isFinite(audio.duration) && audio.duration > 0
        ? audio.duration
        : videoDuration) * 1000;
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const t = (performance.now() - start) / durMs;
      setProgress(Math.min(1, t));
      if (t >= 1) {
        setPlaying(false);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, mediaKind, voiceUrl, videoDuration, setPlaying]);

  const cluster =
    logoPosition === "tl"
      ? "top-20 left-4"
      : logoPosition === "tr"
        ? "top-20 right-20"
        : logoPosition === "br"
          ? watching
            ? "bottom-10 right-16"
            : "bottom-36 right-20"
          : watching
            ? "bottom-10 left-4"
            : "bottom-36 left-4";

  const hookPos =
    hookAlign === "top"
      ? "top-28"
      : hookAlign === "center"
        ? "top-1/2 -translate-y-1/2"
        : watching
          ? "bottom-32"
          : "bottom-52";

  const voiceLabel = VOICES.find((v) => v.id === voiceId)?.label ?? "Eve";
  const busyCopy = busy ? BUSY_COPY[busy] : null;
  const showSuggestions = !prompt && !activeTool && !busy && !playing;
  const remain = Math.max(0, videoDuration * (1 - progress));

  return (
    <div className="relative h-full w-full overflow-hidden bg-surface @container">
      {mediaKind === "video" && !mediaFailed ? (
        <video
          ref={videoRef}
          key={mediaUrl}
          src={mediaUrl}
          className="absolute inset-0 h-full w-full object-cover"
          playsInline
          loop
          muted={Boolean(voiceUrl)}
          crossOrigin="anonymous"
          onTimeUpdate={(e) => {
            const el = e.currentTarget;
            if (el.duration) setProgress(el.currentTime / el.duration);
          }}
          onEnded={() => setPlaying(false)}
          onError={() => {
            setPlaying(false);
            useStudio.getState().failMedia();
          }}
        />
      ) : isColorMedia(mediaUrl) || mediaFailed ? (
        <div
          className="absolute inset-0"
          style={{ background: mediaFailed ? "#121214" : mediaFill(mediaUrl) }}
        />
      ) : (
        <img
          src={mediaUrl}
          alt=""
          className={cn(
            "absolute inset-0 h-full w-full object-cover will-change-transform",
            playing && !reduceMotion && "animate-ken",
          )}
          crossOrigin="anonymous"
          draggable={false}
          onError={() => {
            setPlaying(false);
            useStudio.getState().failMedia();
          }}
        />
      )}

      {voiceUrl ? (
        <audio
          ref={audioRef}
          src={voiceUrl}
          preload="auto"
          onEnded={() => setPlaying(false)}
        />
      ) : null}

      <div className="reel-vignette pointer-events-none absolute inset-0" />

      {isColorMedia(mediaUrl) && !mediaFailed && !watching ? (
        <div className="pointer-events-none absolute inset-3 z-[11] rounded-sm outline outline-1 outline-fg/20">
          <div className="absolute inset-x-6 top-[11%] border-t border-dashed border-fg/15" />
          <div className="absolute inset-x-6 bottom-[16%] border-t border-dashed border-fg/15" />
          <span className="absolute top-2 left-2 font-display text-xs tracking-[0.22em] text-fg/35">
            9:16
          </span>
        </div>
      ) : null}

      <button
        type="button"
        aria-label={activeTool ? "Close tool" : playing ? "Pause" : "Play"}
        className="absolute inset-0 z-10"
        onClick={() => {
          if (activeTool) onTool(activeTool);
          else setPlaying(!playing);
        }}
      />

      {!playing && !busy && !activeTool && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-bg/45 text-fg backdrop-blur-sm">
            <Play className="ml-0.5 size-6" />
          </span>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-4 top-[max(10px,env(safe-area-inset-top))] z-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display text-xl tracking-[0.22em] text-fg drop-shadow-hook">
            SLATE
          </span>
        </div>
        <div className="flex items-center gap-2">
          {busy ? (
            <span className="flex items-center gap-1.5 rounded-full bg-bg/45 px-2.5 py-1 text-2xs font-medium tracking-wide text-fg backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-rec animate-rec" />
              REC
            </span>
          ) : (
            <span className="rounded-full bg-bg/35 px-2.5 py-1 text-2xs font-medium tabular-nums tracking-wide text-fg/80 backdrop-blur-sm">
              {playing ? formatClock(remain) : "9:16"}
            </span>
          )}
          <button
            type="button"
            onClick={onSaveDraft}
            aria-label="Save draft"
            disabled={Boolean(busy)}
            className={cn(
              "pointer-events-auto flex size-11 items-center justify-center rounded-full bg-bg/35 text-fg backdrop-blur-sm transition-opacity duration-200",
              watching && "pointer-events-none opacity-0",
            )}
          >
            <Save className="size-4" />
          </button>
          <button
            type="button"
            onClick={onDownload}
            aria-label="Download reel"
            disabled={Boolean(busy)}
            className={cn(
              "pointer-events-auto flex size-11 items-center justify-center rounded-full bg-bg/35 text-fg backdrop-blur-sm transition-opacity duration-200",
              watching && "pointer-events-none opacity-0",
            )}
          >
            <Download className="size-4" />
          </button>
          <button
            type="button"
            onClick={onReset}
            aria-label="Reset take"
            className={cn(
              "pointer-events-auto flex size-11 items-center justify-center rounded-full bg-bg/35 text-fg backdrop-blur-sm transition-opacity duration-200",
              watching && "pointer-events-none opacity-0",
            )}
          >
            <RotateCcw className="size-4" />
          </button>
        </div>
      </div>

      <div className="absolute inset-x-3 top-[max(6px,env(safe-area-inset-top))] z-20 h-0.5 overflow-hidden rounded-full bg-fg/20">
        <div
          className="h-full bg-fg transition-[width] duration-150"
          style={{ width: `${Math.min(100, progress * 100)}%` }}
        />
      </div>

      {hook.trim() && !activeTool ? (
        <div
          className={cn(
            "pointer-events-none absolute z-20 max-w-[78%] px-4 text-fg drop-shadow-hook",
            hookStyle === "minimal" ? "inset-x-0 mx-auto" : "left-0",
            hookPos,
          )}
        >
          <p className={cn(`hook-${hookStyle}`)}>{hook}</p>
        </div>
      ) : null}

      {(!activeTool || logoPosition === "tl" || logoPosition === "tr") ? (
      <div className={cn("pointer-events-none absolute z-20 flex items-center gap-2.5", cluster)}>
        <div
          className="overflow-hidden rounded-md bg-elevated outline outline-1 -outline-offset-1 outline-fg/20"
          style={{ width: 36 * logoScale, height: 36 * logoScale }}
        >
          {logoFailed ? (
            <div className="flex h-full w-full items-center justify-center font-display text-lg text-fg">
              {(channelName || "Y").slice(0, 1)}
            </div>
          ) : (
            <img
              src={logoUrl}
              alt=""
              className="h-full w-full object-cover"
              crossOrigin="anonymous"
              onError={() => setLogoFailed(true)}
            />
          )}
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-2 truncate text-sm font-semibold text-fg drop-shadow-hook">
            <span className="truncate">{channelName || "Your Channel"}</span>
            {watching ? (
              <span className="shrink-0 rounded-full bg-fg px-2 py-0.5 text-2xs font-semibold tracking-wide text-bg">
                Follow
              </span>
            ) : null}
          </p>
          <p className="truncate text-xs text-fg/75 drop-shadow-hook">
            @{handle.replace(/^@/, "") || "yourchannel"}
          </p>
          <button
            type="button"
            onClick={() => onTool("voice")}
            className="pointer-events-auto mt-0.5 flex items-center gap-1.5 truncate text-2xs text-fg/70"
          >
            <span
              className={cn(
                "relative size-3 shrink-0 rounded-full bg-fg",
                playing && !reduceMotion && "animate-spin",
              )}
            >
              <span className="absolute inset-[3px] rounded-full bg-bg" />
            </span>
            {voiceUrl ? `${voiceLabel} VO` : "Original audio"}
          </button>
        </div>
      </div>
      ) : null}

      {caption && !activeTool ? (
        <p
          className={cn(
            "pointer-events-none absolute left-4 z-20 max-w-[62%] text-xs leading-snug text-fg/85 drop-shadow-hook",
            watching ? "bottom-8" : "bottom-28",
          )}
        >
          {caption}
        </p>
      ) : null}

      <nav
        aria-label="Studio tools"
        className={cn(
          "absolute top-24 right-1.5 z-50 flex flex-col items-center gap-1 transition-[opacity,transform] duration-200 ease-[var(--ease-smooth)]",
          watching && "pointer-events-none translate-x-2 opacity-0",
        )}
      >
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const active = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => onTool(tool.id)}
              className="flex w-14 flex-col items-center gap-0.5 text-fg"
            >
              <span
                className={cn(
                  "flex size-11 items-center justify-center rounded-full backdrop-blur-sm transition-colors duration-150",
                  active ? "bg-accent text-accent-fg" : "bg-bg/40",
                )}
              >
                <Icon className="size-5" />
              </span>
              <span className="text-2xs font-medium drop-shadow-hook">{tool.label}</span>
            </button>
          );
        })}
      </nav>

      {busyCopy ? (
        <div className="absolute inset-0 z-50 flex items-end bg-scrim p-5 pb-36">
          <div className="w-full">
            <div className="h-0.5 overflow-hidden rounded-full bg-fg/15">
              <div className="h-full w-2/3 rounded-full bg-rec animate-rec" />
            </div>
            <p className="mt-3 text-sm font-medium text-fg">{busyCopy.title}</p>
            <p className="text-xs text-muted">{busyCopy.note}</p>
          </div>
        </div>
      ) : null}

      {sheet}

      {activeTool || watching ? null : (
        <div className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-bg via-bg/80 to-transparent px-3 pt-8 pb-[max(10px,env(safe-area-inset-bottom))]">
          {showSuggestions ? (
            <div className="mb-2 flex gap-1.5 overflow-x-auto pb-1">
              {QUICK_TAKES.map((take) => (
                <button
                  key={take.label}
                  type="button"
                  onClick={() => onDirect(take.prompt)}
                  className="h-8 shrink-0 rounded-full bg-fg/10 px-3 text-xs font-medium text-fg backdrop-blur-sm"
                >
                  {take.label}
                </button>
              ))}
            </div>
          ) : null}
          <form
            className="flex items-center gap-2 rounded-xl bg-elevated/90 p-1.5 ring-1 ring-border backdrop-blur-md"
            onSubmit={(e) => {
              e.preventDefault();
              onDirect();
            }}
          >
            <Sparkles className="ml-2 size-4 shrink-0 text-muted" />
            <input
              name="slate-prompt"
              autoComplete="off"
              value={prompt}
              onChange={(e) => onPrompt(e.target.value)}
              placeholder="Direct this take…"
              disabled={Boolean(busy)}
              suppressHydrationWarning
              className="h-10 min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-subtle"
            />
            <button
              type="submit"
              disabled={Boolean(busy) || !prompt.trim()}
              aria-label="Run prompt"
              className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-fg disabled:opacity-40"
            >
              <SendHorizontal className="size-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Clapperboard,
  Download,
  ImagePlus,
  Mic,
  Save,
  Share2,
  Sparkles,
  Square,
  Trash2,
  Upload,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { cn, fileToDataUrl, resizeDataUrl } from "@/lib/utils";
import {
  FRAME_TEMPLATES,
  HOOK_ALIGNS,
  HOOK_STYLES,
  LOGO_SPOTS,
  SCENE_TEMPLATES,
  TONES,
  VOICES,
  templateById,
  type HookAlign,
  type HookStyle,
  type LogoPosition,
} from "@/lib/templates";
import { formatDraftTime, type StudioDraft } from "@/lib/drafts";
import { useStudio, type BusyKind, type ToolId } from "@/lib/studio-store";

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 rounded-full px-3.5 text-sm font-medium transition-colors duration-150",
        active ? "bg-accent text-accent-fg" : "bg-elevated text-muted hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

export type StudioActions = {
  aiOn: boolean;
  busy: BusyKind | null;
  generateHook: (topic: string) => Promise<void>;
  generateScript: (topic: string, tone: string) => Promise<void>;
  generateStill: (prompt: string) => Promise<void>;
  generateClip: (prompt: string) => Promise<void>;
  generateVoice: () => Promise<void>;
  exportPoster: () => Promise<void>;
  exportReel: () => Promise<void>;
  share: (kind: "poster" | "reel") => Promise<void>;
  copyCaption: () => Promise<void>;
  postTo: (href: string) => Promise<void>;
  drafts: StudioDraft[];
  saveDraft: (name?: string) => void;
  loadDraft: (id: string) => void;
  deleteDraft: (id: string) => void;
  readyFile: { url: string; filename: string } | null;
};

export function ToolPanel({ tool, actions }: { tool: ToolId; actions: StudioActions }) {
  switch (tool) {
    case "templates":
      return <TemplatesPanel />;
    case "logo":
      return <LogoPanel />;
    case "hook":
      return <HookPanel actions={actions} />;
    case "script":
      return <ScriptPanel actions={actions} />;
    case "media":
      return <MediaPanel actions={actions} />;
    case "voice":
      return <VoicePanel actions={actions} />;
    case "export":
      return <ExportPanel actions={actions} />;
  }
}

function TemplatesPanel() {
  const templateId = useStudio((s) => s.templateId);
  const applyTemplate = useStudio((s) => s.applyTemplate);
  const standard = FRAME_TEMPLATES[0];
  const otherFrames = FRAME_TEMPLATES.slice(1);

  function Grid({ items }: { items: typeof FRAME_TEMPLATES }) {
    return (
      <div className="grid grid-cols-4 gap-2">
        {items.map((t) => {
          const on = t.id === templateId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => applyTemplate(t.id)}
              className={cn(
                "overflow-hidden rounded-md text-left ring-1 transition-shadow duration-150",
                on ? "ring-accent" : "ring-border",
              )}
            >
              {t.kind === "frame" ? (
                <span className="relative block aspect-[9/16] w-full" style={{ background: t.color }}>
                  <span className="absolute inset-1 rounded-[1px] outline outline-1 outline-fg/25" />
                </span>
              ) : (
                <img
                  src={t.file}
                  alt=""
                  className="aspect-[9/16] w-full object-cover"
                  draggable={false}
                />
              )}
              <span className="block truncate px-1.5 py-1 text-2xs text-muted">{t.title}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs font-medium text-fg">Standard frame</p>
        <p className="text-xs text-muted">Blank 9:16. No scene, no theme — just a colour frame.</p>
        <button
          type="button"
          onClick={() => applyTemplate(standard.id)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg p-2 text-left ring-1 transition-shadow duration-150",
            templateId === standard.id ? "ring-accent" : "ring-border",
          )}
        >
          <span
            className="relative h-20 w-11 shrink-0 overflow-hidden rounded-sm"
            style={{ background: standard.color }}
          >
            <span className="absolute inset-1 rounded-[1px] outline outline-1 outline-fg/30" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-medium text-fg">Standard</span>
            <span className="block text-xs text-muted">Clean colour canvas for your logo, hook, and media.</span>
          </span>
        </button>
        {otherFrames.length ? <Grid items={otherFrames} /> : null}
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-fg">Scenes</p>
        <p className="text-xs text-muted">Tap a look. Hook text comes with it.</p>
        <Grid items={SCENE_TEMPLATES} />
      </div>
    </div>
  );
}

function LogoPanel() {
  const channelName = useStudio((s) => s.channelName);
  const handle = useStudio((s) => s.handle);
  const logoUrl = useStudio((s) => s.logoUrl);
  const logoPosition = useStudio((s) => s.logoPosition);
  const logoScale = useStudio((s) => s.logoScale);
  const setChannelName = useStudio((s) => s.setChannelName);
  const setHandle = useStudio((s) => s.setHandle);
  const setLogoUrl = useStudio((s) => s.setLogoUrl);
  const setLogoPosition = useStudio((s) => s.setLogoPosition);
  const setLogoScale = useStudio((s) => s.setLogoScale);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Use a PNG or JPG logo.");
      return;
    }
    const data = await fileToDataUrl(file);
    const small = await resizeDataUrl(data, 512, "image/png", 0.92);
    setLogoUrl(small);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="size-14 overflow-hidden rounded-md bg-elevated outline outline-1 -outline-offset-1 outline-fg/15">
          <img src={logoUrl} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-fg">Channel mark</p>
          <p className="text-xs text-muted">Sits on the reel like a profile badge.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
          <Upload />
          Upload
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => void onFile(e.target.files?.[0])}
        />
      </div>
      <Field label="Channel name" htmlFor="channel-name">
        <Input
          id="channel-name"
          value={channelName}
          maxLength={32}
          onChange={(e) => setChannelName(e.target.value)}
        />
      </Field>
      <Field label="Handle" htmlFor="channel-handle">
        <Input
          id="channel-handle"
          value={handle}
          maxLength={24}
          onChange={(e) => setHandle(e.target.value)}
        />
      </Field>
      <Field label="Position">
        <div className="grid grid-cols-2 gap-2">
          {LOGO_SPOTS.map((spot) => (
            <Chip
              key={spot.id}
              active={logoPosition === spot.id}
              onClick={() => setLogoPosition(spot.id as LogoPosition)}
            >
              {spot.label}
            </Chip>
          ))}
        </div>
      </Field>
      <Field label="Scale">
        <Slider
          min={0.7}
          max={1.6}
          step={0.05}
          value={[logoScale]}
          onValueChange={(v) => setLogoScale(v[0] ?? 1)}
        />
      </Field>
      <Button variant="ghost" size="sm" onClick={() => setLogoUrl("/logo.svg")}>
        <Clapperboard />
        Use SLATE mark
      </Button>
    </div>
  );
}

function HookPanel({ actions }: { actions: StudioActions }) {
  const hook = useStudio((s) => s.hook);
  const hookStyle = useStudio((s) => s.hookStyle);
  const hookAlign = useStudio((s) => s.hookAlign);
  const setHook = useStudio((s) => s.setHook);
  const setHookStyle = useStudio((s) => s.setHookStyle);
  const setHookAlign = useStudio((s) => s.setHookAlign);
  const [topic, setTopic] = useState("");

  return (
    <div className="space-y-4">
      <Field label="Overlay text" htmlFor="hook-text">
        <Input
          id="hook-text"
          value={hook}
          maxLength={48}
          placeholder="STOP THE SCROLL"
          onChange={(e) => setHook(e.target.value)}
        />
      </Field>
      <Field label="Style">
        <div className="flex flex-wrap gap-1.5">
          {HOOK_STYLES.map((s) => (
            <Chip
              key={s.id}
              active={hookStyle === s.id}
              onClick={() => setHookStyle(s.id as HookStyle)}
            >
              {s.label}
            </Chip>
          ))}
        </div>
      </Field>
      <Field label="Placement">
        <div className="flex flex-wrap gap-1.5">
          {HOOK_ALIGNS.map((s) => (
            <Chip
              key={s.id}
              active={hookAlign === s.id}
              onClick={() => setHookAlign(s.id as HookAlign)}
            >
              {s.label}
            </Chip>
          ))}
        </div>
      </Field>
      <div className="flex gap-2">
        <Input
          value={topic}
          maxLength={80}
          placeholder="Topic for a generated hook"
          onChange={(e) => setTopic(e.target.value)}
        />
        <Button
          variant="secondary"
          disabled={!actions.aiOn || Boolean(actions.busy)}
          onClick={() => void actions.generateHook(topic || hook)}
        >
          <Sparkles />
          Write
        </Button>
      </div>
    </div>
  );
}

function ScriptPanel({ actions }: { actions: StudioActions }) {
  const script = useStudio((s) => s.script);
  const caption = useStudio((s) => s.caption);
  const setScript = useStudio((s) => s.setScript);
  const setCaption = useStudio((s) => s.setCaption);
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("punchy");

  return (
    <div className="space-y-4">
      <Field label="Topic" htmlFor="script-topic">
        <Input
          id="script-topic"
          value={topic}
          maxLength={120}
          placeholder="Why the last set matters"
          onChange={(e) => setTopic(e.target.value)}
        />
      </Field>
      <Field label="Tone">
        <div className="flex flex-wrap gap-1.5">
          {TONES.map((t) => (
            <Chip key={t.id} active={tone === t.id} onClick={() => setTone(t.id)}>
              {t.label}
            </Chip>
          ))}
        </div>
      </Field>
      <Button
        className="w-full"
        disabled={!actions.aiOn || Boolean(actions.busy)}
        onClick={() => void actions.generateScript(topic, tone)}
      >
        <Sparkles />
        Write script
      </Button>
      <Field label="Spoken script" htmlFor="script-body">
        <Textarea
          id="script-body"
          value={script}
          maxLength={1600}
          rows={6}
          placeholder="The voiceover reads this."
          onChange={(e) => setScript(e.target.value)}
        />
      </Field>
      <Field label="Caption" htmlFor="caption-body">
        <Input
          id="caption-body"
          value={caption}
          maxLength={220}
          placeholder="Posted under the reel"
          onChange={(e) => setCaption(e.target.value)}
        />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="secondary"
          disabled={!script.trim()}
          onClick={() => {
            const line = script.trim().split(/[.!\n]/)[0] ?? script;
            useStudio.getState().setHook(line.slice(0, 48));
          }}
        >
          Use as hook
        </Button>
        <Button
          variant="secondary"
          disabled={!actions.aiOn || Boolean(actions.busy) || !script.trim()}
          onClick={() => void actions.generateVoice()}
        >
          <Mic />
          Record VO
        </Button>
      </div>
    </div>
  );
}

function MediaPanel({ actions }: { actions: StudioActions }) {
  const videoDuration = useStudio((s) => s.videoDuration);
  const setVideoDuration = useStudio((s) => s.setVideoDuration);
  const setMedia = useStudio((s) => s.setMedia);
  const mediaKind = useStudio((s) => s.mediaKind);
  const templateId = useStudio((s) => s.templateId);
  const mood = templateById(templateId).mood;
  const [prompt, setPrompt] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    if (file.type.startsWith("video/")) {
      setMedia(URL.createObjectURL(file), "video");
      return;
    }
    if (file.type.startsWith("image/")) {
      const data = await fileToDataUrl(file);
      const small = await resizeDataUrl(data, 1280);
      setMedia(small, "image");
      return;
    }
    toast.error("Use an image or video file.");
  }

  return (
    <div className="space-y-4">
      <Field label="Describe the frame" htmlFor="media-prompt">
        <Textarea
          id="media-prompt"
          value={prompt}
          maxLength={400}
          rows={3}
          placeholder="Rain on a black coupe at night, neon in the puddles"
          onChange={(e) => setPrompt(e.target.value)}
        />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="secondary"
          disabled={!actions.aiOn || Boolean(actions.busy)}
          onClick={() => void actions.generateStill(prompt || mood)}
        >
          <ImagePlus />
          Still
        </Button>
        <Button
          disabled={!actions.aiOn || Boolean(actions.busy)}
          onClick={() => void actions.generateClip(prompt || mood)}
        >
          <Sparkles />
          Clip
        </Button>
      </div>
      <Field label="Clip length">
        <div className="flex gap-1.5">
          {([6, 10] as const).map((n) => (
            <Chip key={n} active={videoDuration === n} onClick={() => setVideoDuration(n)}>
              {n}s
            </Chip>
          ))}
        </div>
      </Field>
      <p className="text-xs text-muted">
        Clip uses the current still as a start frame when you already have one. {mediaKind === "video" ? "A clip is on the reel now." : "A still is on the reel now."}
      </p>
      <Button variant="outline" className="w-full" onClick={() => fileRef.current?.click()}>
        <Upload />
        Upload photo or video
      </Button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => void onFile(e.target.files?.[0])}
      />
    </div>
  );
}

function VoicePanel({ actions }: { actions: StudioActions }) {
  const voiceId = useStudio((s) => s.voiceId);
  const voiceUrl = useStudio((s) => s.voiceUrl);
  const script = useStudio((s) => s.script);
  const setVoiceId = useStudio((s) => s.setVoiceId);
  const setVoiceUrl = useStudio((s) => s.setVoiceUrl);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);

  function clearTimer() {
    if (timerRef.current != null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function stopMic(save: boolean) {
    const rec = recRef.current;
    recRef.current = null;
    clearTimer();
    setRecording(false);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (!rec) return;
    if (save) {
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        if (blob.size > 0) {
          setVoiceUrl(URL.createObjectURL(blob));
          toast.success("Mic take saved");
        }
      };
    } else {
      rec.onstop = null;
    }
    if (rec.state !== "inactive") rec.stop();
  }

  useEffect(() => {
    return () => stopMic(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startMic() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      toast.error("Microphone is not available here.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((t) =>
        MediaRecorder.isTypeSupported(t),
      );
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      rec.start();
      recRef.current = rec;
      setElapsed(0);
      setRecording(true);
      const started = Date.now();
      timerRef.current = window.setInterval(() => {
        const sec = Math.floor((Date.now() - started) / 1000);
        setElapsed(sec);
        if (sec >= 15) stopMic(true);
      }, 250);
    } catch {
      toast.error("Microphone permission denied.");
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted">Reads your script, or record your own voice on the mic.</p>
      <div className="grid grid-cols-2 gap-2">
        {VOICES.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setVoiceId(v.id)}
            className={cn(
              "rounded-lg px-3 py-2.5 text-left ring-1 transition-colors duration-150",
              voiceId === v.id ? "bg-accent text-accent-fg ring-accent" : "bg-elevated text-fg ring-border",
            )}
          >
            <p className="text-sm font-medium">{v.label}</p>
            <p className={cn("text-2xs", voiceId === v.id ? "text-accent-fg/70" : "text-muted")}>
              {v.tone}
            </p>
          </button>
        ))}
      </div>
      <Button
        className="w-full"
        disabled={!actions.aiOn || Boolean(actions.busy) || !script.trim() || recording}
        onClick={() => void actions.generateVoice()}
      >
        <Mic />
        Record voiceover
      </Button>
      {recording ? (
        <Button variant="rec" className="w-full" onClick={() => stopMic(true)}>
          <Square />
          Stop · 0:{String(elapsed).padStart(2, "0")}
        </Button>
      ) : (
        <Button variant="outline" className="w-full" onClick={() => void startMic()}>
          <Mic />
          Record with mic
        </Button>
      )}
      {voiceUrl ? (
        <div className="space-y-2 rounded-lg bg-elevated p-3">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Volume2 className="size-3.5" />
            Preview
          </div>
          <audio src={voiceUrl} controls className="w-full" />
          <Button variant="ghost" size="sm" onClick={() => setVoiceUrl(null)}>
            Remove
          </Button>
        </div>
      ) : (
        <p className="text-xs text-subtle">
          {script.trim() ? "No take recorded yet." : "Write a script, or just hit the mic."}
        </p>
      )}
    </div>
  );
}

function ExportPanel({ actions }: { actions: StudioActions }) {
  const hook = useStudio((s) => s.hook);
  const [name, setName] = useState(hook || "");
  const platforms = [
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "YouTube", href: "https://studio.youtube.com/" },
    { label: "TikTok", href: "https://www.tiktok.com/upload" },
    { label: "X", href: "https://x.com/compose/post" },
  ];
  return (
    <div className="space-y-4">
      {actions.readyFile ? (
        <a
          href={actions.readyFile.url}
          download={actions.readyFile.filename}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-3 text-sm font-medium text-accent-fg"
        >
          <Download className="size-4" />
          Save {actions.readyFile.filename}
        </a>
      ) : null}
      <div className="grid grid-cols-2 gap-2">
        <Button
          className="w-full"
          disabled={Boolean(actions.busy)}
          onClick={() => void actions.exportReel()}
        >
          <Download />
          Download reel
        </Button>
        <Button
          variant="secondary"
          disabled={Boolean(actions.busy)}
          onClick={() => void actions.exportPoster()}
        >
          <Download />
          Poster
        </Button>
      </div>
      <Button
        variant="secondary"
        className="w-full"
        disabled={Boolean(actions.busy)}
        onClick={() => void actions.share("reel")}
      >
        <Share2 />
        Share reel
      </Button>
      <div className="space-y-2">
        <p className="text-xs font-medium text-fg">Save draft</p>
        <div className="flex gap-2">
          <Input
            value={name}
            maxLength={48}
            placeholder="Untitled take"
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            variant="secondary"
            onClick={() => {
              actions.saveDraft(name);
            }}
          >
            <Save />
            Save
          </Button>
        </div>
        {actions.drafts.length ? (
          <ul className="divide-y divide-border overflow-hidden rounded-lg ring-1 ring-border">
            {actions.drafts.map((d) => (
              <li key={d.id} className="flex items-center gap-2 bg-elevated px-3 py-2">
                <button
                  type="button"
                  className="min-w-0 flex-1 text-left"
                  onClick={() => actions.loadDraft(d.id)}
                >
                  <p className="truncate text-sm text-fg">{d.name}</p>
                  <p className="text-2xs text-muted">{formatDraftTime(d.savedAt)}</p>
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${d.name}`}
                  className="flex size-9 items-center justify-center text-muted hover:text-fg"
                  onClick={() => actions.deleteDraft(d.id)}
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-subtle">No drafts yet. Save to pick this take up later.</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {platforms.map((p) => (
          <Button
            key={p.label}
            variant="outline"
            disabled={Boolean(actions.busy)}
            onClick={() => void actions.postTo(p.href)}
          >
            {p.label}
          </Button>
        ))}
      </div>
      <Button variant="outline" className="w-full" onClick={() => void actions.copyCaption()}>
        Copy caption
      </Button>
      <p className="text-2xs leading-relaxed text-subtle">
        Download the 9:16 reel or poster, then post to Instagram, Shorts, TikTok, or X. Drafts stay on this device.
      </p>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ReelStage } from "@/components/studio/reel-stage";
import { ToolPanel, type StudioActions } from "@/components/studio/panels";
import {
  directReel,
  generateStill,
  getAiStatus,
  pollClip,
  speakScript,
  startClip,
  writeHook,
  writeScript,
  type DirectorResult,
} from "@/lib/ai";
import {
  downloadBlob,
  exportFilename,
  renderPoster,
  renderReel,
  shareFile,
} from "@/lib/export-reel";
import { overlayFrom, useStudio, type BusyKind, type ToolId } from "@/lib/studio-store";
import { isUsableMediaUrl, persistableMediaUrl, templateById } from "@/lib/templates";
import { captureDraft, deleteDraft, listDrafts, saveDraft, upsertAutosave, type StudioDraft } from "@/lib/drafts";
import { resizeDataUrl } from "@/lib/utils";

const TITLES: Record<ToolId, string> = {
  templates: "Templates",
  logo: "Channel",
  hook: "Hook text",
  script: "Script",
  media: "Media",
  voice: "Voiceover",
  export: "Download & post",
};

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function waitForClip(requestId: string) {
  const start = Date.now();
  while (Date.now() - start < 180_000) {
    await sleep(4000);
    const r = await pollClip({ data: { requestId } });
    if (!r.ok) throw new Error(r.error);
    if (r.status === "done" && r.url) return r.url;
  }
  throw new Error("Clip timed out. Try a shorter prompt.");
}

export function StudioApp() {
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [busy, setBusy] = useState<BusyKind | null>(null);
  const [prompt, setPrompt] = useState("");
  const [aiOn, setAiOn] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [drafts, setDrafts] = useState<StudioDraft[]>([]);
  const [readyFile, setReadyFile] = useState<{ url: string; filename: string } | null>(null);
  const lastReel = useRef<{ blob: Blob; filename: string } | null>(null);
  const runId = useRef(0);

  function rememberFile(blob: Blob, filename: string) {
    setReadyFile((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return { url: URL.createObjectURL(blob), filename };
    });
  }

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        await useStudio.persist.rehydrate();
      } catch {
        try {
          useStudio.persist.clearStorage();
        } catch {
          /* ignore */
        }
        useStudio.getState().resetTake();
      }
      if (cancelled) return;
      const s = useStudio.getState();
      const persisted = persistableMediaUrl(s.mediaUrl);
      if (persisted) {
        useStudio.setState({
          mediaUrl: persisted,
          posterUrl: persistableMediaUrl(s.posterUrl) || persisted,
          mediaKind: s.mediaKind === "video" && persisted.startsWith("http") ? "video" : "image",
          playing: false,
        });
      } else {
        const t = templateById(s.templateId);
        useStudio.setState({
          mediaUrl: t.file,
          posterUrl: t.file,
          mediaKind: "image",
          playing: false,
        });
      }
      s.recoverMedia();
      s.setHydrated(true);
      try {
        setDrafts(listDrafts());
      } catch {
        setDrafts([]);
      }
      try {
        const status = await getAiStatus();
        if (!cancelled) setAiOn(status.available);
      } catch {
        if (!cancelled) setAiOn(false);
      }
    })();
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => {
      cancelled = true;
      mq.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    let timer = 0;
    const unsub = useStudio.subscribe((s, prev) => {
      if (
        s.mediaUrl === prev.mediaUrl &&
        s.hook === prev.hook &&
        s.script === prev.script &&
        s.caption === prev.caption &&
        s.templateId === prev.templateId &&
        s.logoUrl === prev.logoUrl &&
        s.voiceUrl === prev.voiceUrl
      ) {
        return;
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        try {
          setDrafts(upsertAutosave(draftPayload()));
        } catch {
          /* keep running */
        }
      }, 800);
    });
    const flush = () => {
      try {
        upsertAutosave(draftPayload());
      } catch {
        /* ignore */
      }
    };
    const onHide = () => {
      if (document.visibilityState === "hidden") flush();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", flush);
    return () => {
      unsub();
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", flush);
    };
  }, []);

  useEffect(() => {
    return () => {
      setReadyFile((prev) => {
        if (prev?.url) URL.revokeObjectURL(prev.url);
        return null;
      });
    };
  }, []);

  function snapshot() {
    return useStudio.getState();
  }

  function overlay() {
    return overlayFrom(snapshot());
  }

  function draftPayload() {
    const st = snapshot();
    return {
      templateId: st.templateId,
      mediaUrl: st.mediaUrl,
      mediaKind: st.mediaKind,
      posterUrl: st.posterUrl,
      hook: st.hook,
      hookStyle: st.hookStyle,
      hookAlign: st.hookAlign,
      channelName: st.channelName,
      handle: st.handle,
      logoUrl: st.logoUrl,
      logoPosition: st.logoPosition,
      logoScale: st.logoScale,
      script: st.script,
      caption: st.caption,
      voiceId: st.voiceId,
      voiceUrl: st.voiceUrl,
      videoDuration: st.videoDuration,
    };
  }

  function begin(kind: BusyKind) {
    const id = ++runId.current;
    setBusy(kind);
    return id;
  }

  function alive(id: number) {
    return id === runId.current;
  }

  function needAi() {
    if (!aiOn) {
      toast.error("AI is not available in this environment.");
      return false;
    }
    return true;
  }

  async function runHook(topic: string) {
    if (!needAi()) return;
    const id = begin("script");
    try {
      const r = await writeHook({ data: { topic: topic.trim() || snapshot().hook || "reel hook" } });
      if (!alive(id)) return;
      if (!r.ok) throw new Error(r.error);
      useStudio.getState().setHook(r.hook);
      toast.success("Hook set");
    } catch (err) {
      if (!alive(id)) return;
      toast.error(err instanceof Error ? err.message : "Could not write hook");
    } finally {
      if (alive(id)) setBusy(null);
    }
  }

  async function runScript(topic: string, tone: string) {
    if (!needAi()) return;
    const id = begin("script");
    try {
      const r = await writeScript({
        data: { topic: topic.trim() || snapshot().hook || "vertical reel", tone },
      });
      if (!alive(id)) return;
      if (!r.ok) throw new Error(r.error);
      const st = useStudio.getState();
      st.setScript(r.script);
      if (r.hook) st.setHook(r.hook);
      if (r.caption) st.setCaption(r.caption);
      toast.success("Script ready");
    } catch (err) {
      if (!alive(id)) return;
      toast.error(err instanceof Error ? err.message : "Could not write script");
    } finally {
      if (alive(id)) setBusy(null);
    }
  }

  async function runStill(text: string) {
    if (!needAi()) return;
    const promptText = text.trim();
    if (!promptText) {
      toast.error("Describe the still.");
      return;
    }
    const id = begin("image");
    try {
      const r = await generateStill({ data: { prompt: promptText } });
      if (!alive(id)) return;
      if (!r.ok) throw new Error(r.error);
      useStudio.getState().setMedia(r.url, "image");
      toast.success("Still on the reel");
    } catch (err) {
      if (!alive(id)) return;
      toast.error(err instanceof Error ? err.message : "Could not generate still");
    } finally {
      if (alive(id)) setBusy(null);
    }
  }

  async function runClip(text: string) {
    if (!needAi()) return;
    const promptText = text.trim();
    if (!promptText) {
      toast.error("Describe the clip.");
      return;
    }
    const id = begin("video");
    try {
      const st = snapshot();
      let image: string | null = st.mediaKind === "image" ? st.mediaUrl : st.posterUrl;
      if (image?.startsWith("color:") || image?.startsWith("blob:")) image = null;
      if (image?.startsWith("data:image") && image.length > 1_400_000) {
        image = await resizeDataUrl(image, 768);
      }
      if (!alive(id)) return;
      const start = await startClip({
        data: {
          prompt: promptText,
          duration: st.videoDuration,
          image,
        },
      });
      if (!alive(id)) return;
      if (!start.ok) throw new Error(start.error);
      const url = await waitForClip(start.requestId);
      if (!alive(id)) return;
      useStudio.getState().setMedia(url, "video", st.mediaKind === "image" ? st.mediaUrl : st.posterUrl);
      toast.success("Clip on the reel");
    } catch (err) {
      if (!alive(id)) return;
      toast.error(err instanceof Error ? err.message : "Could not generate clip");
    } finally {
      if (alive(id)) setBusy(null);
    }
  }

  async function runVoice() {
    if (!needAi()) return;
    const st = snapshot();
    const text = st.script.trim();
    if (!text) {
      toast.error("Write a script first.");
      setActiveTool("script");
      return;
    }
    const id = begin("voice");
    try {
      const r = await speakScript({ data: { text, voiceId: st.voiceId } });
      if (!alive(id)) return;
      if (!r.ok) throw new Error(r.error);
      useStudio.getState().setVoiceUrl(r.audio);
      useStudio.getState().setPlaying(true);
      toast.success("Voiceover recorded");
    } catch (err) {
      if (!alive(id)) return;
      toast.error(err instanceof Error ? err.message : "Could not record voice");
    } finally {
      if (alive(id)) setBusy(null);
    }
  }

  async function runDirector(text?: string) {
    const value = (text ?? prompt).trim();
    if (!value) {
      toast.error("Say what you want on this take.");
      return;
    }
    if (!needAi()) return;
    setPrompt(value);
    const id = begin("direct");
    try {
      const st = snapshot();
      const context = [
        `template=${st.templateId}`,
        `hook=${st.hook}`,
        `script=${st.script.slice(0, 240)}`,
        `caption=${st.caption}`,
        `media=${st.mediaKind}`,
        `voice=${st.voiceId}`,
      ].join("\n");
      const directed = await directReel({ data: { prompt: value, context } });
      if (!alive(id)) return;
      if (!directed.ok) throw new Error(directed.error);
      const result = directed.result;
      const next = useStudio.getState();
      if (result.hook) next.setHook(result.hook);
      if (result.script) next.setScript(result.script);
      if (result.caption) next.setCaption(result.caption);

      const acts: DirectorResult["actions"] = result.actions.length
        ? result.actions
        : ["hook", "script"];

      if (acts.includes("image")) {
        setBusy("image");
        const still = await generateStill({
          data: { prompt: result.imagePrompt || value },
        });
        if (!alive(id)) return;
        if (!still.ok) throw new Error(still.error);
        useStudio.getState().setMedia(still.url, "image");
      }

      if (acts.includes("video")) {
        setBusy("video");
        const now = useStudio.getState();
        let image: string | null = now.mediaKind === "image" ? now.mediaUrl : now.posterUrl;
        if (image?.startsWith("color:") || image?.startsWith("blob:")) image = null;
        if (image?.startsWith("data:image") && image.length > 1_400_000) {
          image = await resizeDataUrl(image, 768);
        }
        if (!alive(id)) return;
        const start = await startClip({
          data: {
            prompt: result.videoPrompt || value,
            duration: now.videoDuration,
            image,
          },
        });
        if (!alive(id)) return;
        if (!start.ok) throw new Error(start.error);
        const url = await waitForClip(start.requestId);
        if (!alive(id)) return;
        const after = useStudio.getState();
        after.setMedia(url, "video", after.mediaKind === "image" ? after.mediaUrl : after.posterUrl);
      }

      if (acts.includes("voice")) {
        setBusy("voice");
        const spoken = result.voiceText || useStudio.getState().script;
        if (spoken.trim()) {
          const voice = await speakScript({
            data: { text: spoken, voiceId: useStudio.getState().voiceId },
          });
          if (!alive(id)) return;
          if (!voice.ok) throw new Error(voice.error);
          useStudio.getState().setVoiceUrl(voice.audio);
          useStudio.getState().setPlaying(true);
        }
      }

      if (!alive(id)) return;
      setPrompt("");
      toast.success("Take ready");
    } catch (err) {
      if (!alive(id)) return;
      toast.error(err instanceof Error ? err.message : "Director failed");
    } finally {
      if (alive(id)) setBusy(null);
    }
  }

  async function exportPoster() {
    const id = begin("export");
    try {
      const st = snapshot();
      const src = st.mediaKind === "image" ? st.mediaUrl : st.posterUrl || st.mediaUrl;
      const blob = await renderPoster(src, overlay());
      if (!alive(id)) return;
      rememberFile(blob, exportFilename(st.handle, "png"));
      downloadBlob(blob, exportFilename(st.handle, "png"));
      toast.success("Poster downloaded");
    } catch (err) {
      if (!alive(id)) return;
      toast.error(err instanceof Error ? err.message : "Could not download poster");
    } finally {
      if (alive(id)) setBusy(null);
    }
  }

  async function buildReel() {
    const st = snapshot();
    const result = await renderReel({
      mediaUrl: st.mediaUrl,
      mediaKind: st.mediaKind,
      overlay: overlay(),
      voiceUrl: isUsableMediaUrl(st.voiceUrl) ? st.voiceUrl : null,
      durationSec: st.videoDuration,
    });
    lastReel.current = result;
    return result;
  }

  async function exportReelFile() {
    const id = begin("export");
    try {
      const result = await buildReel();
      if (!alive(id)) return;
      rememberFile(result.blob, result.filename);
      downloadBlob(result.blob, result.filename);
      toast.success("Reel downloaded");
    } catch (err) {
      if (!alive(id)) return;
      toast.error(err instanceof Error ? err.message : "Could not download reel");
      await exportPoster();
    } finally {
      if (alive(id)) setBusy(null);
    }
  }

  async function share(kind: "poster" | "reel") {
    const id = begin("export");
    try {
      const st = snapshot();
      const title = st.hook || "SLATE reel";
      const text = [st.caption, `@${st.handle}`].filter(Boolean).join(" ");
      if (kind === "poster") {
        const src = st.mediaKind === "image" ? st.mediaUrl : st.posterUrl || st.mediaUrl;
        const blob = await renderPoster(src, overlay());
        if (!alive(id)) return;
        const mode = await shareFile(blob, exportFilename(st.handle, "png"), title, text);
        toast.success(mode === "shared" ? "Opened share sheet" : "Poster downloaded — caption copied");
      } else {
        const result = lastReel.current ?? (await buildReel());
        if (!alive(id)) return;
        const mode = await shareFile(result.blob, result.filename, title, text);
        toast.success(mode === "shared" ? "Opened share sheet" : "Reel downloaded — caption copied");
      }
    } catch (err) {
      if (!alive(id)) return;
      if (err instanceof Error && err.name === "AbortError") return;
      toast.error(err instanceof Error ? err.message : "Could not share");
    } finally {
      if (alive(id)) setBusy(null);
    }
  }

  async function copyCaption() {
    const st = snapshot();
    const text = st.caption || st.hook;
    if (!text) {
      toast.error("No caption yet.");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Caption copied");
    } catch {
      toast.error("Could not copy caption");
    }
  }

  async function postTo(href: string) {
    await share("reel");
    window.open(href, "_blank", "noopener,noreferrer");
  }

  function saveCurrentDraft(name?: string) {
    try {
      const { draft, dropped } = captureDraft(draftPayload(), name ?? snapshot().hook);
      setDrafts(saveDraft(draft));
      toast.success(
        dropped.length ? `Draft saved · skipped ${dropped.join(", ")}` : "Draft saved",
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save draft");
    }
  }

  function loadCurrentDraft(id: string) {
    const found = drafts.find((d) => d.id === id) ?? listDrafts().find((d) => d.id === id);
    if (!found) {
      toast.error("Draft not found.");
      return;
    }
    runId.current += 1;
    setBusy(null);
    lastReel.current = null;
    useStudio.getState().applyDraft(found);
    setActiveTool(null);
    toast.success("Draft loaded");
  }

  function removeDraft(id: string) {
    setDrafts(deleteDraft(id));
  }


  const actions: StudioActions = useMemo(
    () => ({
      aiOn,
      busy,
      generateHook: runHook,
      generateScript: runScript,
      generateStill: runStill,
      generateClip: runClip,
      generateVoice: runVoice,
      exportPoster,
      exportReel: exportReelFile,
      share,
      copyCaption,
      postTo,
      drafts,
      saveDraft: saveCurrentDraft,
      loadDraft: loadCurrentDraft,
      deleteDraft: removeDraft,
      readyFile,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [aiOn, busy, drafts, readyFile],
  );

  const sheet = activeTool ? (
    <div className="absolute bottom-0 left-0 right-16 z-40 max-h-[58%] animate-sheet rounded-t-xl bg-surface ring-1 ring-border">
      <div className="flex flex-col">
        <span className="mx-auto mt-2 h-1 w-8 rounded-full bg-border" />
        <div className="flex items-center px-2 pt-1 pb-2">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setActiveTool(null)}
            className="flex h-11 items-center px-3 text-sm font-medium text-muted hover:text-fg"
          >
            Close
          </button>
          <h2 className="flex-1 text-center text-sm font-medium text-fg">{TITLES[activeTool]}</h2>
          <span className="w-16 shrink-0" />
        </div>
      </div>
      <div className="max-h-[48dvh] overflow-y-auto px-4 pb-6">
        <ToolPanel tool={activeTool} actions={actions} />
      </div>
    </div>
  ) : null;

  return (
    <main className="studio-floor flex min-h-dvh items-stretch justify-center sm:items-center sm:p-6">
      <div className="relative h-dvh w-full sm:aspect-[9/16] sm:h-[min(100dvh-48px,860px)] sm:w-auto sm:rounded-2xl sm:bg-elevated sm:p-2 sm:shadow-reel">
        <div className="relative h-full w-full overflow-hidden bg-surface sm:rounded-xl">
          <ReelStage
            activeTool={activeTool}
            onTool={(id) => setActiveTool((cur) => (cur === id ? null : id))}
            busy={busy}
            prompt={prompt}
            onPrompt={setPrompt}
            onDirect={(text) => void runDirector(text)}
            onReset={() => {
              runId.current += 1;
              setBusy(null);
              useStudio.getState().resetTake();
              lastReel.current = null;
              setActiveTool(null);
              setPrompt("");
              toast.success("Take cleared");
            }}
            onSaveDraft={() => saveCurrentDraft()}
            onDownload={() => void exportReelFile()}
            sheet={sheet}
            reduceMotion={reduceMotion}
          />
        </div>
      </div>
    </main>
  );
}

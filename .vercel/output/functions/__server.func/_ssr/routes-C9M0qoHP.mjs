import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, r as Slot, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Root } from "../_libs/@radix-ui/react-label+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as QUICK_TAKES, c as TONES, d as isUsableMediaUrl, f as mediaFill, i as LOGO_SPOTS, l as VOICES, m as templateById, n as HOOK_ALIGNS, o as SCENE_TEMPLATES, p as persistableMediaUrl, r as HOOK_STYLES, t as FRAME_TEMPLATES, u as isColorMedia } from "./templates-DZD5lCEg.mjs";
import { _ as Download, a as Trash2, c as Share2, d as Save, f as RotateCcw, g as ImagePlus, h as LayoutGrid, l as SendHorizontal, m as Mic, n as Upload, o as Square, p as Play, r as Type, s as Sparkles, t as Volume2, u as ScrollText, v as Clapperboard } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as overlayFrom, i as BUSY_COPY, o as useStudio, r as StudioGuard } from "./router-CRC2Zqc_.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C9M0qoHP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function fileToDataUrl(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(file);
	});
}
async function resizeDataUrl(dataUrl, maxEdge, mime = "image/jpeg", quality = .86) {
	const img = await loadImage(dataUrl);
	const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
	const width = Math.max(1, Math.round(img.width * scale));
	const height = Math.max(1, Math.round(img.height * scale));
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) return dataUrl;
	ctx.drawImage(img, 0, 0, width, height);
	return canvas.toDataURL(mime, quality);
}
function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		const timer = window.setTimeout(() => {
			img.src = "";
			reject(/* @__PURE__ */ new Error("Image timed out"));
		}, 15e3);
		img.onload = () => {
			window.clearTimeout(timer);
			resolve(img);
		};
		img.onerror = () => {
			window.clearTimeout(timer);
			reject(/* @__PURE__ */ new Error("Could not load image"));
		};
		img.src = src;
	});
}
function downloadBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
function slugify(value) {
	return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40) || "slate";
}
var TOOLS = [
	{
		id: "templates",
		label: "Templates",
		icon: LayoutGrid
	},
	{
		id: "logo",
		label: "Logo",
		icon: Clapperboard
	},
	{
		id: "hook",
		label: "Hook",
		icon: Type
	},
	{
		id: "media",
		label: "Media",
		icon: ImagePlus
	},
	{
		id: "script",
		label: "Script",
		icon: ScrollText
	},
	{
		id: "voice",
		label: "Voice",
		icon: Mic
	},
	{
		id: "export",
		label: "Post",
		icon: Download
	}
];
function formatClock(seconds) {
	return `0:${String(Math.max(0, Math.round(seconds))).padStart(2, "0")}`;
}
function ReelStage({ activeTool, onTool, busy, prompt, onPrompt, onDirect, onReset, onSaveDraft, onDownload, sheet, reduceMotion }) {
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
	const videoRef = (0, import_react.useRef)(null);
	const audioRef = (0, import_react.useRef)(null);
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [logoFailed, setLogoFailed] = (0, import_react.useState)(false);
	const [mediaFailed, setMediaFailed] = (0, import_react.useState)(false);
	const watching = playing && !activeTool && !busy;
	(0, import_react.useEffect)(() => {
		setLogoFailed(false);
	}, [logoUrl]);
	(0, import_react.useEffect)(() => {
		setMediaFailed(false);
	}, [mediaUrl]);
	(0, import_react.useEffect)(() => {
		const video = videoRef.current;
		const audio = audioRef.current;
		if (playing) {
			setProgress(0);
			video?.play().catch(() => void 0);
			if (voiceUrl) {
				if (audio) audio.currentTime = 0;
				audio?.play().catch(() => void 0);
			}
		} else {
			video?.pause();
			audio?.pause();
		}
	}, [
		playing,
		mediaUrl,
		voiceUrl,
		mediaKind
	]);
	(0, import_react.useEffect)(() => {
		if (!playing || mediaKind === "video") return;
		const audio = audioRef.current;
		const durMs = (voiceUrl && audio && Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : videoDuration) * 1e3;
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
	}, [
		playing,
		mediaKind,
		voiceUrl,
		videoDuration,
		setPlaying
	]);
	const cluster = logoPosition === "tl" ? "top-20 left-4" : logoPosition === "tr" ? "top-20 right-20" : logoPosition === "br" ? watching ? "bottom-10 right-16" : "bottom-36 right-20" : watching ? "bottom-10 left-4" : "bottom-36 left-4";
	const hookPos = hookAlign === "top" ? "top-28" : hookAlign === "center" ? "top-1/2 -translate-y-1/2" : watching ? "bottom-32" : "bottom-52";
	const voiceLabel = VOICES.find((v) => v.id === voiceId)?.label ?? "Eve";
	const busyCopy = busy ? BUSY_COPY[busy] : null;
	const showSuggestions = !prompt && !activeTool && !busy && !playing;
	const remain = Math.max(0, videoDuration * (1 - progress));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-full w-full overflow-hidden bg-surface @container",
		children: [
			mediaKind === "video" && !mediaFailed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: videoRef,
				src: mediaUrl,
				className: "absolute inset-0 h-full w-full object-cover",
				playsInline: true,
				loop: true,
				muted: Boolean(voiceUrl),
				crossOrigin: "anonymous",
				onTimeUpdate: (e) => {
					const el = e.currentTarget;
					if (el.duration) setProgress(el.currentTime / el.duration);
				},
				onEnded: () => setPlaying(false),
				onError: () => {
					setPlaying(false);
					useStudio.getState().failMedia();
				}
			}, mediaUrl) : isColorMedia(mediaUrl) || mediaFailed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0",
				style: { background: mediaFailed ? "#121214" : mediaFill(mediaUrl) }
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: mediaUrl,
				alt: "",
				className: cn("absolute inset-0 h-full w-full object-cover will-change-transform", playing && !reduceMotion && "animate-ken"),
				crossOrigin: "anonymous",
				draggable: false,
				onError: () => {
					setPlaying(false);
					useStudio.getState().failMedia();
				}
			}),
			voiceUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
				ref: audioRef,
				src: voiceUrl,
				preload: "auto",
				onEnded: () => setPlaying(false)
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "reel-vignette pointer-events-none absolute inset-0" }),
			isColorMedia(mediaUrl) && !mediaFailed && !watching ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-3 z-[11] rounded-sm outline outline-1 outline-fg/20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-6 top-[11%] border-t border-dashed border-fg/15" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-6 bottom-[16%] border-t border-dashed border-fg/15" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute top-2 left-2 font-display text-xs tracking-[0.22em] text-fg/35",
						children: "9:16"
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": activeTool ? "Close tool" : playing ? "Pause" : "Play",
				className: "absolute inset-0 z-10",
				onClick: () => {
					if (activeTool) onTool(activeTool);
					else setPlaying(!playing);
				}
			}),
			!playing && !busy && !activeTool && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-0 z-10 flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex size-14 items-center justify-center rounded-full bg-bg/45 text-fg backdrop-blur-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "ml-0.5 size-6" })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-x-4 top-[max(10px,env(safe-area-inset-top))] z-20 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-xl tracking-[0.22em] text-fg drop-shadow-hook",
						children: "SLATE"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5 rounded-full bg-bg/45 px-2.5 py-1 text-2xs font-medium tracking-wide text-fg backdrop-blur-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-rec animate-rec" }), "REC"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-bg/35 px-2.5 py-1 text-2xs font-medium tabular-nums tracking-wide text-fg/80 backdrop-blur-sm",
							children: playing ? formatClock(remain) : "9:16"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onSaveDraft,
							"aria-label": "Save draft",
							disabled: Boolean(busy),
							className: cn("pointer-events-auto flex size-11 items-center justify-center rounded-full bg-bg/35 text-fg backdrop-blur-sm transition-opacity duration-200", watching && "pointer-events-none opacity-0"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onDownload,
							"aria-label": "Download reel",
							disabled: Boolean(busy),
							className: cn("pointer-events-auto flex size-11 items-center justify-center rounded-full bg-bg/35 text-fg backdrop-blur-sm transition-opacity duration-200", watching && "pointer-events-none opacity-0"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onReset,
							"aria-label": "Reset take",
							className: cn("pointer-events-auto flex size-11 items-center justify-center rounded-full bg-bg/35 text-fg backdrop-blur-sm transition-opacity duration-200", watching && "pointer-events-none opacity-0"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-x-3 top-[max(6px,env(safe-area-inset-top))] z-20 h-0.5 overflow-hidden rounded-full bg-fg/20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-fg transition-[width] duration-150",
					style: { width: `${Math.min(100, progress * 100)}%` }
				})
			}),
			hook.trim() && !activeTool ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("pointer-events-none absolute z-20 max-w-[78%] px-4 text-fg drop-shadow-hook", hookStyle === "minimal" ? "inset-x-0 mx-auto" : "left-0", hookPos),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn(`hook-${hookStyle}`),
					children: hook
				})
			}) : null,
			!activeTool || logoPosition === "tl" || logoPosition === "tr" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("pointer-events-none absolute z-20 flex items-center gap-2.5", cluster),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-md bg-elevated outline outline-1 -outline-offset-1 outline-fg/20",
					style: {
						width: 36 * logoScale,
						height: 36 * logoScale
					},
					children: logoFailed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-full w-full items-center justify-center font-display text-lg text-fg",
						children: (channelName || "Y").slice(0, 1)
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: logoUrl,
						alt: "",
						className: "h-full w-full object-cover",
						crossOrigin: "anonymous",
						onError: () => setLogoFailed(true)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-2 truncate text-sm font-semibold text-fg drop-shadow-hook",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: channelName || "Your Channel"
							}), watching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 rounded-full bg-fg px-2 py-0.5 text-2xs font-semibold tracking-wide text-bg",
								children: "Follow"
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-xs text-fg/75 drop-shadow-hook",
							children: ["@", handle.replace(/^@/, "") || "yourchannel"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onTool("voice"),
							className: "pointer-events-auto mt-0.5 flex items-center gap-1.5 truncate text-2xs text-fg/70",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("relative size-3 shrink-0 rounded-full bg-fg", playing && !reduceMotion && "animate-spin"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-[3px] rounded-full bg-bg" })
							}), voiceUrl ? `${voiceLabel} VO` : "Original audio"]
						})
					]
				})]
			}) : null,
			caption && !activeTool ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("pointer-events-none absolute left-4 z-20 max-w-[62%] text-xs leading-snug text-fg/85 drop-shadow-hook", watching ? "bottom-8" : "bottom-28"),
				children: caption
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				"aria-label": "Studio tools",
				className: cn("absolute top-24 right-1.5 z-50 flex flex-col items-center gap-1 transition-[opacity,transform] duration-200 ease-[var(--ease-smooth)]", watching && "pointer-events-none translate-x-2 opacity-0"),
				children: TOOLS.map((tool) => {
					const Icon = tool.icon;
					const active = activeTool === tool.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onTool(tool.id),
						className: "flex w-14 flex-col items-center gap-0.5 text-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("flex size-11 items-center justify-center rounded-full backdrop-blur-sm transition-colors duration-150", active ? "bg-accent text-accent-fg" : "bg-bg/40"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-2xs font-medium drop-shadow-hook",
							children: tool.label
						})]
					}, tool.id);
				})
			}),
			busyCopy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-50 flex items-end bg-scrim p-5 pb-36",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-0.5 overflow-hidden rounded-full bg-fg/15",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-2/3 rounded-full bg-rec animate-rec" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm font-medium text-fg",
							children: busyCopy.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: busyCopy.note
						})
					]
				})
			}) : null,
			sheet,
			activeTool || watching ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-bg via-bg/80 to-transparent px-3 pt-8 pb-[max(10px,env(safe-area-inset-bottom))]",
				children: [showSuggestions ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 flex gap-1.5 overflow-x-auto pb-1",
					children: QUICK_TAKES.map((take) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onDirect(take.prompt),
						className: "h-8 shrink-0 rounded-full bg-fg/10 px-3 text-xs font-medium text-fg backdrop-blur-sm",
						children: take.label
					}, take.label))
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex items-center gap-2 rounded-xl bg-elevated/90 p-1.5 ring-1 ring-border backdrop-blur-md",
					onSubmit: (e) => {
						e.preventDefault();
						onDirect();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "ml-2 size-4 shrink-0 text-muted" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "slate-prompt",
							autoComplete: "off",
							value: prompt,
							onChange: (e) => onPrompt(e.target.value),
							placeholder: "Direct this take…",
							disabled: Boolean(busy),
							suppressHydrationWarning: true,
							className: "h-10 min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-subtle"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: Boolean(busy) || !prompt.trim(),
							"aria-label": "Run prompt",
							className: "flex size-10 items-center justify-center rounded-lg bg-accent text-accent-fg disabled:opacity-40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SendHorizontal, { className: "size-4" })
						})
					]
				})]
			})
		]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,opacity,transform] duration-150 ease-[var(--ease-smooth)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-accent/90",
			secondary: "bg-elevated text-fg hover:bg-elevated/80",
			outline: "border border-border bg-transparent text-fg hover:bg-elevated",
			ghost: "text-fg hover:bg-elevated",
			rec: "bg-rec text-fg hover:bg-rec/90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		"data-slot": "button",
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		"data-slot": "input",
		className: cn("flex h-11 w-full rounded-md border border-border bg-elevated px-3 text-sm text-fg shadow-none transition-[border-color,box-shadow] duration-150 placeholder:text-subtle focus-visible:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		"data-slot": "label",
		className: cn("text-xs font-medium tracking-wide text-muted", className),
		...props
	});
}
function Slider({ className, value, defaultValue, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		"data-slot": "slider",
		value,
		defaultValue,
		className: cn("relative flex h-11 w-full touch-none items-center select-none", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1 w-full grow overflow-hidden rounded-full bg-elevated",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-accent" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-4 rounded-full bg-accent shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" })]
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		"data-slot": "textarea",
		className: cn("flex min-h-24 w-full rounded-md border border-border bg-elevated px-3 py-2.5 text-sm text-fg transition-[border-color,box-shadow] duration-150 placeholder:text-subtle focus-visible:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40", className),
		...props
	});
}
var KEY = "slate-drafts-v1";
var MAX_DRAFTS = 12;
var MAX_BYTES = 35e5;
function readRaw() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter((d) => d && typeof d.id === "string" && typeof d.savedAt === "number");
	} catch {
		return [];
	}
}
function writeRaw(drafts) {
	const trimmed = drafts.slice(0, MAX_DRAFTS);
	const json = JSON.stringify(trimmed);
	if (json.length > MAX_BYTES) throw new Error("Draft is too large to keep on this device.");
	localStorage.setItem(KEY, json);
}
function packUrl(url, fallback = null) {
	if (isUsableMediaUrl(url) && url && !url.startsWith("blob:")) {
		if (url.startsWith("data:") && url.length > 9e5) return fallback;
		return url;
	}
	return fallback;
}
function listDrafts() {
	return readRaw().sort((a, b) => b.savedAt - a.savedAt);
}
function captureDraft(state, name) {
	const template = templateById(state.templateId);
	const dropped = [];
	const mediaUrl = packUrl(state.mediaUrl, template.file) ?? template.file;
	if (mediaUrl !== state.mediaUrl) dropped.push("clip");
	const packedPoster = packUrl(state.posterUrl, null);
	const logoUrl = packUrl(state.logoUrl, "/logo.svg") ?? "/logo.svg";
	if (logoUrl !== state.logoUrl) dropped.push("logo");
	let voiceUrl = state.voiceUrl;
	if (voiceUrl && (!isUsableMediaUrl(voiceUrl) || voiceUrl.length > 7e5)) {
		voiceUrl = null;
		dropped.push("voice");
	}
	return {
		draft: {
			...state,
			id: `d-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
			name: name.trim().slice(0, 48) || state.hook.trim().slice(0, 32) || "Untitled take",
			savedAt: Date.now(),
			mediaUrl,
			mediaKind: state.mediaKind === "video" && mediaUrl === state.mediaUrl ? "video" : "image",
			posterUrl: packedPoster || (mediaUrl.startsWith("color:") ? mediaUrl : null),
			logoUrl,
			voiceUrl
		},
		dropped
	};
}
function saveDraft(draft) {
	const existing = readRaw().filter((d) => d.id !== draft.id);
	const next = [draft, ...existing].slice(0, MAX_DRAFTS);
	try {
		writeRaw(next);
		return next;
	} catch {
		const slimNext = [{
			...draft,
			mediaUrl: templateById(draft.templateId).file,
			mediaKind: "image",
			posterUrl: null,
			voiceUrl: null,
			logoUrl: draft.logoUrl.startsWith("data:") ? "/logo.svg" : draft.logoUrl
		}, ...existing].slice(0, MAX_DRAFTS);
		writeRaw(slimNext);
		return slimNext;
	}
}
function deleteDraft(id) {
	const next = readRaw().filter((d) => d.id !== id);
	try {
		writeRaw(next);
	} catch {}
	return next;
}
function formatDraftTime(ts) {
	try {
		return new Intl.DateTimeFormat(void 0, {
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit"
		}).format(ts);
	} catch {
		return "";
	}
}
var AUTOSAVE_ID = "d-autosave";
function upsertAutosave(state) {
	const { draft } = captureDraft(state, "Last take");
	const next = [{
		...draft,
		id: AUTOSAVE_ID,
		name: "Last take"
	}, ...readRaw().filter((d) => d.id !== AUTOSAVE_ID)].slice(0, MAX_DRAFTS);
	try {
		writeRaw(next);
		return next;
	} catch {
		return listDrafts();
	}
}
function Chip({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("h-9 rounded-full px-3.5 text-sm font-medium transition-colors duration-150", active ? "bg-accent text-accent-fg" : "bg-elevated text-muted hover:text-fg"),
		children
	});
}
function Field({ label, htmlFor, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor,
			children: label
		}), children]
	});
}
function ToolPanel({ tool, actions }) {
	switch (tool) {
		case "templates": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TemplatesPanel, {});
		case "logo": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoPanel, {});
		case "hook": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HookPanel, { actions });
		case "script": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScriptPanel, { actions });
		case "media": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaPanel, { actions });
		case "voice": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoicePanel, { actions });
		case "export": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportPanel, { actions });
	}
}
function TemplatesPanel() {
	const templateId = useStudio((s) => s.templateId);
	const applyTemplate = useStudio((s) => s.applyTemplate);
	const standard = FRAME_TEMPLATES[0];
	const otherFrames = FRAME_TEMPLATES.slice(1);
	function Grid({ items }) {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-4 gap-2",
			children: items.map((t) => {
				const on = t.id === templateId;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => applyTemplate(t.id),
					className: cn("overflow-hidden rounded-md text-left ring-1 transition-shadow duration-150", on ? "ring-accent" : "ring-border"),
					children: [t.kind === "frame" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "relative block aspect-[9/16] w-full",
						style: { background: t.color },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-1 rounded-[1px] outline outline-1 outline-fg/25" })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: t.file,
						alt: "",
						className: "aspect-[9/16] w-full object-cover",
						draggable: false
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block truncate px-1.5 py-1 text-2xs text-muted",
						children: t.title
					})]
				}, t.id);
			})
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium text-fg",
					children: "Standard frame"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Blank 9:16. No scene, no theme — just a colour frame."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => applyTemplate(standard.id),
					className: cn("flex w-full items-center gap-3 rounded-lg p-2 text-left ring-1 transition-shadow duration-150", templateId === standard.id ? "ring-accent" : "ring-border"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "relative h-20 w-11 shrink-0 overflow-hidden rounded-sm",
						style: { background: standard.color },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-1 rounded-[1px] outline outline-1 outline-fg/30" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm font-medium text-fg",
							children: "Standard"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs text-muted",
							children: "Clean colour canvas for your logo, hook, and media."
						})]
					})]
				}),
				otherFrames.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid, { items: otherFrames }) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium text-fg",
					children: "Scenes"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Tap a look. Hook text comes with it."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid, { items: SCENE_TEMPLATES })
			]
		})]
	});
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
	const fileRef = (0, import_react.useRef)(null);
	async function onFile(file) {
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			toast.error("Use a PNG or JPG logo.");
			return;
		}
		const small = await resizeDataUrl(await fileToDataUrl(file), 512, "image/png", .92);
		setLogoUrl(small);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "size-14 overflow-hidden rounded-md bg-elevated outline outline-1 -outline-offset-1 outline-fg/15",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: logoUrl,
							alt: "",
							className: "h-full w-full object-cover"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-fg",
							children: "Channel mark"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Sits on the reel like a profile badge."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						size: "sm",
						onClick: () => fileRef.current?.click(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {}), "Upload"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						accept: "image/*",
						className: "hidden",
						onChange: (e) => void onFile(e.target.files?.[0])
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Channel name",
				htmlFor: "channel-name",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "channel-name",
					value: channelName,
					maxLength: 32,
					onChange: (e) => setChannelName(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Handle",
				htmlFor: "channel-handle",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "channel-handle",
					value: handle,
					maxLength: 24,
					onChange: (e) => setHandle(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Position",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2",
					children: LOGO_SPOTS.map((spot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						active: logoPosition === spot.id,
						onClick: () => setLogoPosition(spot.id),
						children: spot.label
					}, spot.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Scale",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					min: .7,
					max: 1.6,
					step: .05,
					value: [logoScale],
					onValueChange: (v) => setLogoScale(v[0] ?? 1)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: () => setLogoUrl("/logo.svg"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clapperboard, {}), "Use SLATE mark"]
			})
		]
	});
}
function HookPanel({ actions }) {
	const hook = useStudio((s) => s.hook);
	const hookStyle = useStudio((s) => s.hookStyle);
	const hookAlign = useStudio((s) => s.hookAlign);
	const setHook = useStudio((s) => s.setHook);
	const setHookStyle = useStudio((s) => s.setHookStyle);
	const setHookAlign = useStudio((s) => s.setHookAlign);
	const [topic, setTopic] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Overlay text",
				htmlFor: "hook-text",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "hook-text",
					value: hook,
					maxLength: 48,
					placeholder: "STOP THE SCROLL",
					onChange: (e) => setHook(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Style",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: HOOK_STYLES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						active: hookStyle === s.id,
						onClick: () => setHookStyle(s.id),
						children: s.label
					}, s.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Placement",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: HOOK_ALIGNS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						active: hookAlign === s.id,
						onClick: () => setHookAlign(s.id),
						children: s.label
					}, s.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: topic,
					maxLength: 80,
					placeholder: "Topic for a generated hook",
					onChange: (e) => setTopic(e.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					disabled: !actions.aiOn || Boolean(actions.busy),
					onClick: () => void actions.generateHook(topic || hook),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {}), "Write"]
				})]
			})
		]
	});
}
function ScriptPanel({ actions }) {
	const script = useStudio((s) => s.script);
	const caption = useStudio((s) => s.caption);
	const setScript = useStudio((s) => s.setScript);
	const setCaption = useStudio((s) => s.setCaption);
	const [topic, setTopic] = (0, import_react.useState)("");
	const [tone, setTone] = (0, import_react.useState)("punchy");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Topic",
				htmlFor: "script-topic",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "script-topic",
					value: topic,
					maxLength: 120,
					placeholder: "Why the last set matters",
					onChange: (e) => setTopic(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Tone",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: TONES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						active: tone === t.id,
						onClick: () => setTone(t.id),
						children: t.label
					}, t.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "w-full",
				disabled: !actions.aiOn || Boolean(actions.busy),
				onClick: () => void actions.generateScript(topic, tone),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {}), "Write script"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Spoken script",
				htmlFor: "script-body",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "script-body",
					value: script,
					maxLength: 1600,
					rows: 6,
					placeholder: "The voiceover reads this.",
					onChange: (e) => setScript(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Caption",
				htmlFor: "caption-body",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "caption-body",
					value: caption,
					maxLength: 220,
					placeholder: "Posted under the reel",
					onChange: (e) => setCaption(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					disabled: !script.trim(),
					onClick: () => {
						const line = script.trim().split(/[.!\n]/)[0] ?? script;
						useStudio.getState().setHook(line.slice(0, 48));
					},
					children: "Use as hook"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					disabled: !actions.aiOn || Boolean(actions.busy) || !script.trim(),
					onClick: () => void actions.generateVoice(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, {}), "Record VO"]
				})]
			})
		]
	});
}
function MediaPanel({ actions }) {
	const videoDuration = useStudio((s) => s.videoDuration);
	const setVideoDuration = useStudio((s) => s.setVideoDuration);
	const setMedia = useStudio((s) => s.setMedia);
	const mediaKind = useStudio((s) => s.mediaKind);
	const templateId = useStudio((s) => s.templateId);
	const mood = templateById(templateId).mood;
	const [prompt, setPrompt] = (0, import_react.useState)("");
	const fileRef = (0, import_react.useRef)(null);
	async function onFile(file) {
		if (!file) return;
		if (file.type.startsWith("video/")) {
			setMedia(URL.createObjectURL(file), "video");
			return;
		}
		if (file.type.startsWith("image/")) {
			const small = await resizeDataUrl(await fileToDataUrl(file), 1280);
			setMedia(small, "image");
			return;
		}
		toast.error("Use an image or video file.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Describe the frame",
				htmlFor: "media-prompt",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "media-prompt",
					value: prompt,
					maxLength: 400,
					rows: 3,
					placeholder: "Rain on a black coupe at night, neon in the puddles",
					onChange: (e) => setPrompt(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					disabled: !actions.aiOn || Boolean(actions.busy),
					onClick: () => void actions.generateStill(prompt || mood),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, {}), "Still"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					disabled: !actions.aiOn || Boolean(actions.busy),
					onClick: () => void actions.generateClip(prompt || mood),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {}), "Clip"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Clip length",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1.5",
					children: [6, 10].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, {
						active: videoDuration === n,
						onClick: () => setVideoDuration(n),
						children: [n, "s"]
					}, n))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted",
				children: ["Clip uses the current still as a start frame when you already have one. ", mediaKind === "video" ? "A clip is on the reel now." : "A still is on the reel now."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				className: "w-full",
				onClick: () => fileRef.current?.click(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {}), "Upload photo or video"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				accept: "image/*,video/*",
				className: "hidden",
				onChange: (e) => void onFile(e.target.files?.[0])
			})
		]
	});
}
function VoicePanel({ actions }) {
	const voiceId = useStudio((s) => s.voiceId);
	const voiceUrl = useStudio((s) => s.voiceUrl);
	const script = useStudio((s) => s.script);
	const setVoiceId = useStudio((s) => s.setVoiceId);
	const setVoiceUrl = useStudio((s) => s.setVoiceUrl);
	const [recording, setRecording] = (0, import_react.useState)(false);
	const [elapsed, setElapsed] = (0, import_react.useState)(0);
	const recRef = (0, import_react.useRef)(null);
	const chunksRef = (0, import_react.useRef)([]);
	const streamRef = (0, import_react.useRef)(null);
	const timerRef = (0, import_react.useRef)(null);
	function clearTimer() {
		if (timerRef.current != null) {
			window.clearInterval(timerRef.current);
			timerRef.current = null;
		}
	}
	function stopMic(save) {
		const rec = recRef.current;
		recRef.current = null;
		clearTimer();
		setRecording(false);
		streamRef.current?.getTracks().forEach((t) => t.stop());
		streamRef.current = null;
		if (!rec) return;
		if (save) rec.onstop = () => {
			const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
			if (blob.size > 0) {
				setVoiceUrl(URL.createObjectURL(blob));
				toast.success("Mic take saved");
			}
		};
		else rec.onstop = null;
		if (rec.state !== "inactive") rec.stop();
	}
	(0, import_react.useEffect)(() => {
		return () => stopMic(false);
	}, []);
	async function startMic() {
		if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
			toast.error("Microphone is not available here.");
			return;
		}
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			streamRef.current = stream;
			const mime = [
				"audio/webm;codecs=opus",
				"audio/webm",
				"audio/mp4"
			].find((t) => MediaRecorder.isTypeSupported(t));
			const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : void 0);
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
				const sec = Math.floor((Date.now() - started) / 1e3);
				setElapsed(sec);
				if (sec >= 15) stopMic(true);
			}, 250);
		} catch {
			toast.error("Microphone permission denied.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "Reads your script, or record your own voice on the mic."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2",
				children: VOICES.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setVoiceId(v.id),
					className: cn("rounded-lg px-3 py-2.5 text-left ring-1 transition-colors duration-150", voiceId === v.id ? "bg-accent text-accent-fg ring-accent" : "bg-elevated text-fg ring-border"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: v.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("text-2xs", voiceId === v.id ? "text-accent-fg/70" : "text-muted"),
						children: v.tone
					})]
				}, v.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "w-full",
				disabled: !actions.aiOn || Boolean(actions.busy) || !script.trim() || recording,
				onClick: () => void actions.generateVoice(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, {}), "Record voiceover"]
			}),
			recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "rec",
				className: "w-full",
				onClick: () => stopMic(true),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, {}),
					"Stop · 0:",
					String(elapsed).padStart(2, "0")
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				className: "w-full",
				onClick: () => void startMic(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, {}), "Record with mic"]
			}),
			voiceUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 rounded-lg bg-elevated p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-3.5" }), "Preview"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
						src: voiceUrl,
						controls: true,
						className: "w-full"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => setVoiceUrl(null),
						children: "Remove"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: script.trim() ? "No take recorded yet." : "Write a script, or just hit the mic."
			})
		]
	});
}
function ExportPanel({ actions }) {
	const hook = useStudio((s) => s.hook);
	const [name, setName] = (0, import_react.useState)(hook || "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			actions.readyFile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: actions.readyFile.url,
				download: actions.readyFile.filename,
				className: "flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-3 text-sm font-medium text-accent-fg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }),
					"Save ",
					actions.readyFile.filename
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "w-full",
					disabled: Boolean(actions.busy),
					onClick: () => void actions.exportReel(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), "Download reel"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					disabled: Boolean(actions.busy),
					onClick: () => void actions.exportPoster(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), "Poster"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "secondary",
				className: "w-full",
				disabled: Boolean(actions.busy),
				onClick: () => void actions.share("reel"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, {}), "Share reel"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-fg",
						children: "Save draft"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: name,
							maxLength: 48,
							placeholder: "Untitled take",
							onChange: (e) => setName(e.target.value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							onClick: () => {
								actions.saveDraft(name);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, {}), "Save"]
						})]
					}),
					actions.drafts.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border overflow-hidden rounded-lg ring-1 ring-border",
						children: actions.drafts.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2 bg-elevated px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "min-w-0 flex-1 text-left",
								onClick: () => actions.loadDraft(d.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm text-fg",
									children: d.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-2xs text-muted",
									children: formatDraftTime(d.savedAt)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": `Delete ${d.name}`,
								className: "flex size-9 items-center justify-center text-muted hover:text-fg",
								onClick: () => actions.deleteDraft(d.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
							})]
						}, d.id))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-subtle",
						children: "No drafts yet. Save to pick this take up later."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [
					{
						label: "Instagram",
						href: "https://www.instagram.com/"
					},
					{
						label: "YouTube",
						href: "https://studio.youtube.com/"
					},
					{
						label: "TikTok",
						href: "https://www.tiktok.com/upload"
					},
					{
						label: "X",
						href: "https://x.com/compose/post"
					}
				].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					disabled: Boolean(actions.busy),
					onClick: () => void actions.postTo(p.href),
					children: p.label
				}, p.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				className: "w-full",
				onClick: () => void actions.copyCaption(),
				children: "Copy caption"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-2xs leading-relaxed text-subtle",
				children: "Download the 9:16 reel or poster, then post to Instagram, Shorts, TikTok, or X. Drafts stay on this device."
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getAiStatus = createServerFn({ method: "GET" }).handler(createSsrRpc("f55d85520203b0ca68806b32dd775d224e89e7dbf6a1371fbfe6857a9f8e3df4"));
var directReel = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("f618220103a74dbad1361fe4605ad6243ceb97c8db1cc77dbf70da43008e3a85"));
var writeScript = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("ebe1ec8fe57c0cf02e198a9a91a6d48c31b6d2dc5f9903634707a66c6d618b40"));
var writeHook = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("99af0f4b76508d362387fc957e740246d4c9e4dc2e5882a741a9e5c5ef4e81d4"));
var generateStill = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("74e4bd1692b6eb8646ef14c88cce0deeb7ed40d51037424f8eed2c607e32a3fe"));
var startClip = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("a72e56185b4e6e03f84d3e89f744053eb774d4aae32e277946ddb8ac6d699f54"));
var pollClip = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("c09f908c6f6410f2f878636627d927798425e098b2345668c86a5b9a40970442"));
createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("94bc5cac95a2fd2076eb9e7a58bb92c8488e861930cefc16bb13ebdefd08ca65"));
var speakScript = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("4bae1623b7460d2b59efc5ecc69253099afc67b79f146e7cd038aa1b906b9766"));
var W = 1080;
var H = 1920;
function hookFont(style, ctx) {
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
function wrapLines(ctx, text, maxWidth) {
	const words = text.trim().split(/\s+/);
	const lines = [];
	let line = "";
	for (const word of words) {
		const next = line ? `${line} ${word}` : word;
		if (ctx.measureText(next).width > maxWidth && line) {
			lines.push(line);
			line = word;
		} else line = next;
	}
	if (line) lines.push(line);
	return lines.slice(0, 4);
}
function coverDraw(ctx, source, sw, sh, zoom = 1) {
	const scale = Math.max(W / sw, H / sh) * zoom;
	const dw = sw * scale;
	const dh = sh * scale;
	const dx = (W - dw) / 2;
	const dy = (H - dh) / 2;
	ctx.drawImage(source, dx, dy, dw, dh);
}
function drawGradients(ctx) {
	const top = ctx.createLinearGradient(0, 0, 0, 280);
	top.addColorStop(0, "rgba(0,0,0,0.45)");
	top.addColorStop(1, "rgba(0,0,0,0)");
	ctx.fillStyle = top;
	ctx.fillRect(0, 0, W, 280);
	const bot = ctx.createLinearGradient(0, 1200, 0, H);
	bot.addColorStop(0, "rgba(0,0,0,0)");
	bot.addColorStop(1, "rgba(0,0,0,0.78)");
	ctx.fillStyle = bot;
	ctx.fillRect(0, 1200, W, 720);
}
function hookY(align, lineCount, lineHeight) {
	const block = lineCount * lineHeight;
	if (align === "top") return 220;
	if (align === "center") return (H - block) / 2;
	return 1400 - block;
}
function roundedClip(ctx, x, y, w, h, r) {
	ctx.beginPath();
	ctx.roundRect(x, y, w, h, r);
	ctx.clip();
}
function roundedStroke(ctx, x, y, w, h, r) {
	ctx.beginPath();
	ctx.roundRect(x, y, w, h, r);
	ctx.stroke();
}
function drawOverlays(ctx, overlay, logo) {
	drawGradients(ctx);
	if (overlay.hook.trim()) {
		hookFont(overlay.hookStyle, ctx);
		ctx.fillStyle = "#f4f4f5";
		ctx.textAlign = overlay.hookStyle === "minimal" ? "center" : "left";
		ctx.textBaseline = "top";
		ctx.shadowColor = "rgba(0,0,0,0.85)";
		ctx.shadowBlur = 18;
		const lines = wrapLines(ctx, overlay.hook.toUpperCase(), 880);
		const lineHeight = overlay.hookStyle === "cinematic" ? 102 : overlay.hookStyle === "bold" ? 84 : 56;
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
	const lx = overlay.logoPosition === "tr" || overlay.logoPosition === "br" ? 1016 - logoSize : pad;
	const ly = overlay.logoPosition === "tl" || overlay.logoPosition === "tr" ? 88 : 1856 - logoSize - 140;
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
		const capLines = wrapLines(ctx, overlay.caption, 880);
		let cy = 1760;
		for (const line of capLines.slice(0, 2)) {
			ctx.fillText(line, pad, cy);
			cy += 38;
		}
	}
}
async function waitFonts() {
	if (typeof document !== "undefined" && document.fonts?.ready) await document.fonts.ready.catch(() => void 0);
}
async function renderPoster(mediaUrl, overlay) {
	await waitFonts();
	let logo = null;
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
	const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
	if (!blob) throw new Error("Could not export poster");
	return blob;
}
function pickRecorderMime() {
	for (const t of [
		"video/mp4;codecs=avc1,mp4a.40.2",
		"video/mp4",
		"video/webm;codecs=vp9,opus",
		"video/webm"
	]) if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t)) return t;
	return "video/webm";
}
async function renderReel(options) {
	if (typeof MediaRecorder === "undefined" || typeof HTMLCanvasElement === "undefined") throw new Error("Video export is not supported in this browser");
	await waitFonts();
	const canvas = document.createElement("canvas");
	canvas.width = W;
	canvas.height = H;
	const ctx = canvas.getContext("2d", { alpha: false });
	if (!ctx) throw new Error("Canvas unavailable");
	let logo = null;
	try {
		logo = await loadImage(options.overlay.logoUrl);
	} catch {
		logo = null;
	}
	const mime = pickRecorderMime();
	const stream = canvas.captureStream(30);
	let audioCtx = null;
	const dest = (() => {
		try {
			audioCtx = new AudioContext();
			return audioCtx.createMediaStreamDestination();
		} catch {
			return null;
		}
	})();
	let voiceEl = null;
	let videoEl = null;
	let still = null;
	const fill = isColorMedia(options.mediaUrl) ? mediaFill(options.mediaUrl) : "#0a0a0b";
	try {
		if (options.voiceUrl && audioCtx && dest) {
			voiceEl = new Audio(options.voiceUrl);
			voiceEl.crossOrigin = "anonymous";
			await new Promise((resolve, reject) => {
				const timer = window.setTimeout(() => reject(/* @__PURE__ */ new Error("Voiceover failed to load")), 12e3);
				voiceEl.oncanplaythrough = () => {
					window.clearTimeout(timer);
					resolve();
				};
				voiceEl.onerror = () => {
					window.clearTimeout(timer);
					reject(/* @__PURE__ */ new Error("Voiceover failed to load"));
				};
				voiceEl.load();
			});
			audioCtx.createMediaElementSource(voiceEl).connect(dest);
		}
		if (options.mediaKind === "video") {
			videoEl = document.createElement("video");
			videoEl.crossOrigin = "anonymous";
			videoEl.muted = true;
			videoEl.playsInline = true;
			videoEl.src = options.mediaUrl;
			await new Promise((resolve, reject) => {
				const timer = window.setTimeout(() => reject(/* @__PURE__ */ new Error("Clip failed to load for export")), 12e3);
				videoEl.onloadeddata = () => {
					window.clearTimeout(timer);
					resolve();
				};
				videoEl.onerror = () => {
					window.clearTimeout(timer);
					reject(/* @__PURE__ */ new Error("Clip failed to load for export"));
				};
			});
			const capturable = videoEl;
			if (!options.voiceUrl && dest && typeof capturable.captureStream === "function") {
				const vstream = capturable.captureStream();
				for (const track of vstream.getAudioTracks()) dest.stream.addTrack(track);
			}
		} else if (!isColorMedia(options.mediaUrl)) still = await loadImage(options.mediaUrl);
		if (dest) for (const track of dest.stream.getAudioTracks()) stream.addTrack(track);
		const duration = Math.max(4, options.voiceUrl && voiceEl && Number.isFinite(voiceEl.duration) ? Math.min(voiceEl.duration, 30) : options.durationSec);
		const recorder = new MediaRecorder(stream, { mimeType: mime });
		const chunks = [];
		recorder.ondataavailable = (e) => {
			if (e.data.size) chunks.push(e.data);
		};
		const stopped = new Promise((resolve, reject) => {
			recorder.onstop = () => resolve();
			recorder.onerror = () => reject(/* @__PURE__ */ new Error("Recorder failed"));
		});
		recorder.start(200);
		if (audioCtx) await audioCtx.resume().catch(() => void 0);
		const start = performance.now();
		if (voiceEl) voiceEl.play().catch(() => void 0);
		if (videoEl) {
			videoEl.currentTime = 0;
			videoEl.play().catch(() => void 0);
		}
		await new Promise((resolve) => {
			const tick = () => {
				const t = (performance.now() - start) / 1e3;
				options.onProgress?.(Math.min(99, t / duration * 100));
				ctx.fillStyle = fill;
				ctx.fillRect(0, 0, W, H);
				const zoom = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches || options.mediaKind === "video" ? 1 : 1 + .06 * (t / duration);
				if (videoEl && videoEl.videoWidth) coverDraw(ctx, videoEl, videoEl.videoWidth, videoEl.videoHeight, 1);
				else if (still) coverDraw(ctx, still, still.width, still.height, zoom);
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
		return {
			blob,
			filename: `slate-${slugify(options.overlay.handle)}.${ext}`
		};
	} finally {
		if (voiceEl) {
			voiceEl.pause();
			voiceEl.src = "";
		}
		if (videoEl) {
			videoEl.pause();
			videoEl.src = "";
		}
		if (audioCtx && audioCtx.state !== "closed") await audioCtx.close().catch(() => void 0);
	}
}
function exportFilename(handle, kind) {
	return `slate-${slugify(handle)}.${kind}`;
}
async function shareFile(blob, filename, title, text) {
	const payload = {
		title,
		text,
		files: [new File([blob], filename, { type: blob.type || "application/octet-stream" })]
	};
	if (typeof navigator.share === "function" && navigator.canShare?.(payload)) {
		await navigator.share(payload);
		return "shared";
	}
	downloadBlob(blob, filename);
	if (text && navigator.clipboard?.writeText) await navigator.clipboard.writeText(text).catch(() => void 0);
	return "downloaded";
}
var TITLES = {
	templates: "Templates",
	logo: "Channel",
	hook: "Hook text",
	script: "Script",
	media: "Media",
	voice: "Voiceover",
	export: "Download & post"
};
function sleep(ms) {
	return new Promise((resolve) => window.setTimeout(resolve, ms));
}
async function waitForClip(requestId) {
	const start = Date.now();
	while (Date.now() - start < 18e4) {
		await sleep(4e3);
		const r = await pollClip({ data: { requestId } });
		if (!r.ok) throw new Error(r.error);
		if (r.status === "done" && r.url) return r.url;
	}
	throw new Error("Clip timed out. Try a shorter prompt.");
}
function StudioApp() {
	const [activeTool, setActiveTool] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [prompt, setPrompt] = (0, import_react.useState)("");
	const [aiOn, setAiOn] = (0, import_react.useState)(true);
	const [reduceMotion, setReduceMotion] = (0, import_react.useState)(false);
	const [drafts, setDrafts] = (0, import_react.useState)([]);
	const [readyFile, setReadyFile] = (0, import_react.useState)(null);
	const lastReel = (0, import_react.useRef)(null);
	const runId = (0, import_react.useRef)(0);
	function rememberFile(blob, filename) {
		setReadyFile((prev) => {
			if (prev?.url) URL.revokeObjectURL(prev.url);
			return {
				url: URL.createObjectURL(blob),
				filename
			};
		});
	}
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			try {
				await useStudio.persist.rehydrate();
			} catch {
				try {
					useStudio.persist.clearStorage();
				} catch {}
				useStudio.getState().resetTake();
			}
			if (cancelled) return;
			const s = useStudio.getState();
			const persisted = persistableMediaUrl(s.mediaUrl);
			if (persisted) useStudio.setState({
				mediaUrl: persisted,
				posterUrl: persistableMediaUrl(s.posterUrl) || persisted,
				mediaKind: s.mediaKind === "video" && persisted.startsWith("http") ? "video" : "image",
				playing: false
			});
			else {
				const t = templateById(s.templateId);
				useStudio.setState({
					mediaUrl: t.file,
					posterUrl: t.file,
					mediaKind: "image",
					playing: false
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
	(0, import_react.useEffect)(() => {
		let timer = 0;
		const unsub = useStudio.subscribe((s, prev) => {
			if (s.mediaUrl === prev.mediaUrl && s.hook === prev.hook && s.script === prev.script && s.caption === prev.caption && s.templateId === prev.templateId && s.logoUrl === prev.logoUrl && s.voiceUrl === prev.voiceUrl) return;
			window.clearTimeout(timer);
			timer = window.setTimeout(() => {
				try {
					setDrafts(upsertAutosave(draftPayload()));
				} catch {}
			}, 800);
		});
		const flush = () => {
			try {
				upsertAutosave(draftPayload());
			} catch {}
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
	(0, import_react.useEffect)(() => {
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
			videoDuration: st.videoDuration
		};
	}
	function begin(kind) {
		const id = ++runId.current;
		setBusy(kind);
		return id;
	}
	function alive(id) {
		return id === runId.current;
	}
	function needAi() {
		if (!aiOn) {
			toast.error("AI is not available in this environment.");
			return false;
		}
		return true;
	}
	async function runHook(topic) {
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
	async function runScript(topic, tone) {
		if (!needAi()) return;
		const id = begin("script");
		try {
			const r = await writeScript({ data: {
				topic: topic.trim() || snapshot().hook || "vertical reel",
				tone
			} });
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
	async function runStill(text) {
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
	async function runClip(text) {
		if (!needAi()) return;
		const promptText = text.trim();
		if (!promptText) {
			toast.error("Describe the clip.");
			return;
		}
		const id = begin("video");
		try {
			const st = snapshot();
			let image = st.mediaKind === "image" ? st.mediaUrl : st.posterUrl;
			if (image?.startsWith("color:") || image?.startsWith("blob:")) image = null;
			if (image?.startsWith("data:image") && image.length > 14e5) image = await resizeDataUrl(image, 768);
			if (!alive(id)) return;
			const start = await startClip({ data: {
				prompt: promptText,
				duration: st.videoDuration,
				image
			} });
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
			const r = await speakScript({ data: {
				text,
				voiceId: st.voiceId
			} });
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
	async function runDirector(text) {
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
			const directed = await directReel({ data: {
				prompt: value,
				context: [
					`template=${st.templateId}`,
					`hook=${st.hook}`,
					`script=${st.script.slice(0, 240)}`,
					`caption=${st.caption}`,
					`media=${st.mediaKind}`,
					`voice=${st.voiceId}`
				].join("\n")
			} });
			if (!alive(id)) return;
			if (!directed.ok) throw new Error(directed.error);
			const result = directed.result;
			const next = useStudio.getState();
			if (result.hook) next.setHook(result.hook);
			if (result.script) next.setScript(result.script);
			if (result.caption) next.setCaption(result.caption);
			const acts = result.actions.length ? result.actions : ["hook", "script"];
			if (acts.includes("image")) {
				setBusy("image");
				const still = await generateStill({ data: { prompt: result.imagePrompt || value } });
				if (!alive(id)) return;
				if (!still.ok) throw new Error(still.error);
				useStudio.getState().setMedia(still.url, "image");
			}
			if (acts.includes("video")) {
				setBusy("video");
				const now = useStudio.getState();
				let image = now.mediaKind === "image" ? now.mediaUrl : now.posterUrl;
				if (image?.startsWith("color:") || image?.startsWith("blob:")) image = null;
				if (image?.startsWith("data:image") && image.length > 14e5) image = await resizeDataUrl(image, 768);
				if (!alive(id)) return;
				const start = await startClip({ data: {
					prompt: result.videoPrompt || value,
					duration: now.videoDuration,
					image
				} });
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
					const voice = await speakScript({ data: {
						text: spoken,
						voiceId: useStudio.getState().voiceId
					} });
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
			const blob = await renderPoster(st.mediaKind === "image" ? st.mediaUrl : st.posterUrl || st.mediaUrl, overlay());
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
			durationSec: st.videoDuration
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
	async function share(kind) {
		const id = begin("export");
		try {
			const st = snapshot();
			const title = st.hook || "SLATE reel";
			const text = [st.caption, `@${st.handle}`].filter(Boolean).join(" ");
			if (kind === "poster") {
				const blob = await renderPoster(st.mediaKind === "image" ? st.mediaUrl : st.posterUrl || st.mediaUrl, overlay());
				if (!alive(id)) return;
				const mode = await shareFile(blob, exportFilename(st.handle, "png"), title, text);
				toast.success(mode === "shared" ? "Opened share sheet" : "Poster downloaded — caption copied");
			} else {
				const result = lastReel.current ?? await buildReel();
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
	async function postTo(href) {
		await share("reel");
		window.open(href, "_blank", "noopener,noreferrer");
	}
	function saveCurrentDraft(name) {
		try {
			const { draft, dropped } = captureDraft(draftPayload(), name ?? snapshot().hook);
			setDrafts(saveDraft(draft));
			toast.success(dropped.length ? `Draft saved · skipped ${dropped.join(", ")}` : "Draft saved");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save draft");
		}
	}
	function loadCurrentDraft(id) {
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
	function removeDraft(id) {
		setDrafts(deleteDraft(id));
	}
	const actions = (0, import_react.useMemo)(() => ({
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
		readyFile
	}), [
		aiOn,
		busy,
		drafts,
		readyFile
	]);
	const sheet = activeTool ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute bottom-0 left-0 right-16 z-40 max-h-[58%] animate-sheet rounded-t-xl bg-surface ring-1 ring-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mx-auto mt-2 h-1 w-8 rounded-full bg-border" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center px-2 pt-1 pb-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Close",
						onClick: () => setActiveTool(null),
						className: "flex h-11 items-center px-3 text-sm font-medium text-muted hover:text-fg",
						children: "Close"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "flex-1 text-center text-sm font-medium text-fg",
						children: TITLES[activeTool]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-16 shrink-0" })
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-h-[48dvh] overflow-y-auto px-4 pb-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolPanel, {
				tool: activeTool,
				actions
			})
		})]
	}) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "studio-floor flex min-h-dvh items-stretch justify-center sm:items-center sm:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative h-dvh w-full sm:aspect-[9/16] sm:h-[min(100dvh-48px,860px)] sm:w-auto sm:rounded-2xl sm:bg-elevated sm:p-2 sm:shadow-reel",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative h-full w-full overflow-hidden bg-surface sm:rounded-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReelStage, {
					activeTool,
					onTool: (id) => setActiveTool((cur) => cur === id ? null : id),
					busy,
					prompt,
					onPrompt: setPrompt,
					onDirect: (text) => void runDirector(text),
					onReset: () => {
						runId.current += 1;
						setBusy(null);
						useStudio.getState().resetTake();
						lastReel.current = null;
						setActiveTool(null);
						setPrompt("");
						toast.success("Take cleared");
					},
					onSaveDraft: () => saveCurrentDraft(),
					onDownload: () => void exportReelFile(),
					sheet,
					reduceMotion
				})
			})
		})
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioGuard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioApp, {}) });
}
//#endregion
export { Home as component };

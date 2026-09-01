import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as useRouter, f as createRouter, g as createRootRoute, h as createFileRoute, l as Scripts, m as lazyRouteComponent, p as Outlet, u as HeadContent } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as isUsableMediaUrl, m as templateById, o as SCENE_TEMPLATES, p as persistableMediaUrl } from "./templates-DZD5lCEg.mjs";
import { i as TriangleAlert } from "../_libs/lucide-react.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CRC2Zqc_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var first = SCENE_TEMPLATES[0];
var initial = {
	templateId: first.id,
	mediaUrl: first.file,
	mediaKind: "image",
	posterUrl: first.file,
	hook: first.hook,
	hookStyle: first.style,
	hookAlign: first.align,
	channelName: "Your Channel",
	handle: "yourchannel",
	logoUrl: "/logo.svg",
	logoPosition: "bl",
	logoScale: 1,
	script: "",
	caption: "",
	voiceId: "eve",
	voiceUrl: null,
	videoDuration: 6,
	playing: false
};
function revokeIfBlob(url) {
	if (url?.startsWith("blob:")) try {
		URL.revokeObjectURL(url);
	} catch {}
}
function releaseLater(url) {
	if (!url?.startsWith("blob:")) return;
	if (typeof window === "undefined") return;
	window.setTimeout(() => revokeIfBlob(url), 400);
}
var safeStorage = {
	getItem: (name) => {
		try {
			return localStorage.getItem(name);
		} catch {
			return null;
		}
	},
	setItem: (name, value) => {
		try {
			localStorage.setItem(name, value);
		} catch {
			try {
				localStorage.removeItem(name);
				localStorage.setItem(name, value);
			} catch {}
		}
	},
	removeItem: (name) => {
		try {
			localStorage.removeItem(name);
		} catch {}
	}
};
var useStudio = create()(persist((set, get) => ({
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
			playing: false
		});
		if (prev.mediaUrl !== t.file) releaseLater(prev.mediaUrl);
	},
	setMedia: (mediaUrl, mediaKind, posterUrl) => {
		const prev = get();
		set({
			mediaUrl,
			mediaKind,
			posterUrl: posterUrl ?? (mediaKind === "image" ? mediaUrl : prev.posterUrl),
			playing: false
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
		set({
			voiceUrl,
			playing: false
		});
		if (prev && prev !== voiceUrl) releaseLater(prev);
	},
	setVideoDuration: (videoDuration) => set({ videoDuration }),
	setPlaying: (playing) => set({ playing }),
	applyDraft: (draft) => {
		const prev = get();
		const mediaUrl = isUsableMediaUrl(draft.mediaUrl) ? draft.mediaUrl : templateById(draft.templateId).file;
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
			playing: false
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
			voiceUrl: isUsableMediaUrl(s.voiceUrl) ? s.voiceUrl : null
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
			playing: false
		});
		if (s.mediaUrl !== t.file) releaseLater(s.mediaUrl);
	},
	resetTake: () => {
		const prev = get();
		set({
			...initial,
			hydrated: true
		});
		releaseLater(prev.mediaUrl);
		releaseLater(prev.voiceUrl);
		releaseLater(prev.logoUrl);
	}
}), {
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
			videoDuration: s.videoDuration
		};
	}
}));
function overlayFrom(s) {
	return {
		hook: s.hook,
		hookStyle: s.hookStyle,
		hookAlign: s.hookAlign,
		channelName: s.channelName,
		handle: s.handle,
		logoUrl: s.logoUrl,
		logoPosition: s.logoPosition,
		logoScale: s.logoScale,
		caption: s.caption
	};
}
var BUSY_COPY = {
	direct: {
		title: "Directing the take",
		note: "Reading your prompt"
	},
	script: {
		title: "Writing the script",
		note: "Short-form, spoken"
	},
	image: {
		title: "Shooting the still",
		note: "Vertical 9:16 frame"
	},
	video: {
		title: "Rolling the clip",
		note: "This can take a minute"
	},
	voice: {
		title: "Recording voiceover",
		note: "Matching your script"
	},
	export: {
		title: "Exporting the reel",
		note: "Compositing overlays"
	}
};
function AppErrorComponent({ error, reset }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-dvh flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-rec",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted",
				children: error instanceof Error ? error.message : "That take hit a snag. Start a new one."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-2 h-11 rounded-lg bg-accent px-4 text-sm font-medium text-accent-fg",
				onClick: () => {
					try {
						useStudio.getState().resetTake();
					} catch {}
					if (typeof reset === "function") reset();
					else window.location.reload();
				},
				children: "New take"
			})
		]
	});
}
var StudioGuard = class extends import_react.Component {
	state = { error: null };
	static getDerivedStateFromError(error) {
		return { error };
	}
	componentDidCatch(error, info) {
		console.error(error, info.componentStack);
	}
	render() {
		if (this.state.error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppErrorComponent, {
			error: this.state.error,
			reset: () => {
				try {
					useStudio.getState().resetTake();
				} catch {}
				this.setState({ error: null });
			}
		});
		return this.props.children;
	}
};
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function Toaster$1() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		theme: "dark",
		position: "top-center",
		toastOptions: { classNames: {
			toast: "bg-elevated text-fg border border-border shadow-reel font-sans",
			title: "text-fg",
			description: "text-muted",
			actionButton: "bg-accent text-accent-fg",
			cancelButton: "bg-surface text-muted"
		} }
	});
}
var styles_default = "/assets/styles-td5YlylZ.css";
var APP_NAME = "SLATE";
var Route$1 = createRootRoute({
	errorComponent: AppErrorComponent,
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Mobile reel studio — templates, AI media, voiceover, script, and export."
			},
			{
				name: "theme-color",
				content: "#0a0a0b"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@400;500;600;700&display=swap"
			}
		]
	}),
	component: RootComponent
});
function RootComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitErrorComponentImporter = () => import("./routes-BO4T5ucs.mjs");
var $$splitComponentImporter = () => import("./routes-C9M0qoHP.mjs");
var rootRouteChildren = { IndexRoute: createFileRoute("/")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
}).update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$1
}) };
var routeTree = Route$1._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { overlayFrom as a, BUSY_COPY as i, AppErrorComponent as n, useStudio as o, StudioGuard as r, router_exports as t };

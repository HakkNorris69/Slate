//#region node_modules/.nitro/vite/services/ssr/assets/templates-DZD5lCEg.js
function frame(id, title, color) {
	return {
		id,
		title,
		file: `color:${color}`,
		kind: "frame",
		color,
		hook: "",
		style: "cinematic",
		align: "lower",
		mood: "clean 9:16 frame, no scene, no theme"
	};
}
var FRAME_TEMPLATES = [
	frame("standard", "Standard", "#141416"),
	frame("black", "Black", "#050505"),
	frame("graphite", "Graphite", "#2a2c31")
];
var SCENE_TEMPLATES = [
	{
		id: "studio",
		title: "Studio",
		file: "/templates/studio.jpg",
		kind: "scene",
		hook: "ONE TAKE",
		style: "cinematic",
		align: "lower",
		mood: "craft, process, talking-head energy"
	},
	{
		id: "night",
		title: "Night",
		file: "/templates/night.jpg",
		kind: "scene",
		hook: "DON'T BLINK",
		style: "bold",
		align: "lower",
		mood: "city after hours, nightlife, rain"
	},
	{
		id: "kitchen",
		title: "Kitchen",
		file: "/templates/kitchen.jpg",
		kind: "scene",
		hook: "TASTE THIS",
		style: "cinematic",
		align: "lower",
		mood: "food, recipe, restaurant, cooking"
	},
	{
		id: "product",
		title: "Product",
		file: "/templates/product.jpg",
		kind: "scene",
		hook: "BUILT QUIET",
		style: "minimal",
		align: "center",
		mood: "launch, luxury, object, unboxing"
	},
	{
		id: "gym",
		title: "Gym",
		file: "/templates/gym.jpg",
		kind: "scene",
		hook: "LAST SET",
		style: "bold",
		align: "lower",
		mood: "training, discipline, sport"
	},
	{
		id: "rooftop",
		title: "Rooftop",
		file: "/templates/rooftop.jpg",
		kind: "scene",
		hook: "STAY FOR THIS",
		style: "cinematic",
		align: "lower",
		mood: "city, travel, dusk, skyline"
	},
	{
		id: "road",
		title: "Road",
		file: "/templates/road.jpg",
		kind: "scene",
		hook: "KEEP DRIVING",
		style: "caption",
		align: "lower",
		mood: "car, night drive, journey"
	},
	{
		id: "fashion",
		title: "Atelier",
		file: "/templates/fashion.jpg",
		kind: "scene",
		hook: "CUT FROM THIS",
		style: "minimal",
		align: "center",
		mood: "fashion, editorial, wardrobe"
	}
];
var TEMPLATES = [...SCENE_TEMPLATES, ...FRAME_TEMPLATES];
var VOICES = [
	{
		id: "eve",
		label: "Eve",
		tone: "Energetic"
	},
	{
		id: "orion",
		label: "Orion",
		tone: "Cinematic"
	},
	{
		id: "altair",
		label: "Altair",
		tone: "Premium"
	},
	{
		id: "helix",
		label: "Helix",
		tone: "Bold"
	},
	{
		id: "luna",
		label: "Luna",
		tone: "Gentle"
	},
	{
		id: "rex",
		label: "Rex",
		tone: "Clear"
	},
	{
		id: "leo",
		label: "Leo",
		tone: "Strong"
	},
	{
		id: "ara",
		label: "Ara",
		tone: "Warm"
	}
];
var TONES = [
	{
		id: "street",
		label: "Street"
	},
	{
		id: "luxury",
		label: "Luxury"
	},
	{
		id: "educational",
		label: "Teach"
	},
	{
		id: "punchy",
		label: "Punchy"
	}
];
var HOOK_STYLES = [
	{
		id: "cinematic",
		label: "Cinema"
	},
	{
		id: "bold",
		label: "Bold"
	},
	{
		id: "caption",
		label: "Caption"
	},
	{
		id: "minimal",
		label: "Minimal"
	}
];
var HOOK_ALIGNS = [
	{
		id: "top",
		label: "Top"
	},
	{
		id: "center",
		label: "Center"
	},
	{
		id: "lower",
		label: "Lower"
	}
];
var LOGO_SPOTS = [
	{
		id: "tl",
		label: "Top left"
	},
	{
		id: "tr",
		label: "Top right"
	},
	{
		id: "bl",
		label: "Bottom left"
	},
	{
		id: "br",
		label: "Bottom right"
	}
];
var QUICK_TAKES = [
	{
		label: "Last set",
		prompt: "Bold gym reel, last-set energy, punchy voiceover, overlay hook LAST SET"
	},
	{
		label: "Night drive",
		prompt: "Cinematic night drive in the rain, calm voiceover, overlay hook KEEP DRIVING"
	},
	{
		label: "Quiet launch",
		prompt: "Minimal luxury product still, no people, overlay hook BUILT QUIET, no voiceover"
	}
];
function templateById(id) {
	if (id === "frame") return FRAME_TEMPLATES[0];
	return TEMPLATES.find((t) => t.id === id) ?? SCENE_TEMPLATES[0] ?? TEMPLATES[0];
}
function isColorMedia(url) {
	return Boolean(url?.startsWith("color:"));
}
function mediaFill(url) {
	if (url?.startsWith("color:")) return url.slice(6) || "#121214";
	return "#121214";
}
function isUsableMediaUrl(url) {
	if (!url) return false;
	if (url.startsWith("blob:")) return false;
	if (url.startsWith("color:")) return true;
	if (url.startsWith("data:")) return url.length < 25e5;
	if (url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://")) return true;
	return false;
}
function persistableMediaUrl(url) {
	if (!url) return null;
	if (url.startsWith("color:")) return url;
	if (url.startsWith("/") && !url.startsWith("//")) return url;
	if (url.startsWith("https://") || url.startsWith("http://")) return url;
	return null;
}
//#endregion
export { QUICK_TAKES as a, TONES as c, isUsableMediaUrl as d, mediaFill as f, LOGO_SPOTS as i, VOICES as l, templateById as m, HOOK_ALIGNS as n, SCENE_TEMPLATES as o, persistableMediaUrl as p, HOOK_STYLES as r, TEMPLATES as s, FRAME_TEMPLATES as t, isColorMedia as u };

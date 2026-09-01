export type HookStyle = "cinematic" | "bold" | "caption" | "minimal";
export type HookAlign = "top" | "center" | "lower";
export type LogoPosition = "tl" | "tr" | "bl" | "br";
export type TemplateKind = "frame" | "scene";

export type ReelTemplate = {
  id: string;
  title: string;
  file: string;
  kind: TemplateKind;
  color?: string;
  hook: string;
  style: HookStyle;
  align: HookAlign;
  mood: string;
};

function frame(id: string, title: string, color: string): ReelTemplate {
  return {
    id,
    title,
    file: `color:${color}`,
    kind: "frame",
    color,
    hook: "",
    style: "cinematic",
    align: "lower",
    mood: "clean 9:16 frame, no scene, no theme",
  };
}

export const FRAME_TEMPLATES: ReelTemplate[] = [
  frame("standard", "Standard", "#141416"),
  frame("black", "Black", "#050505"),
  frame("graphite", "Graphite", "#2a2c31"),
];

export const SCENE_TEMPLATES: ReelTemplate[] = [
  {
    id: "studio",
    title: "Studio",
    file: "/templates/studio.jpg",
    kind: "scene",
    hook: "ONE TAKE",
    style: "cinematic",
    align: "lower",
    mood: "craft, process, talking-head energy",
  },
  {
    id: "night",
    title: "Night",
    file: "/templates/night.jpg",
    kind: "scene",
    hook: "DON'T BLINK",
    style: "bold",
    align: "lower",
    mood: "city after hours, nightlife, rain",
  },
  {
    id: "kitchen",
    title: "Kitchen",
    file: "/templates/kitchen.jpg",
    kind: "scene",
    hook: "TASTE THIS",
    style: "cinematic",
    align: "lower",
    mood: "food, recipe, restaurant, cooking",
  },
  {
    id: "product",
    title: "Product",
    file: "/templates/product.jpg",
    kind: "scene",
    hook: "BUILT QUIET",
    style: "minimal",
    align: "center",
    mood: "launch, luxury, object, unboxing",
  },
  {
    id: "gym",
    title: "Gym",
    file: "/templates/gym.jpg",
    kind: "scene",
    hook: "LAST SET",
    style: "bold",
    align: "lower",
    mood: "training, discipline, sport",
  },
  {
    id: "rooftop",
    title: "Rooftop",
    file: "/templates/rooftop.jpg",
    kind: "scene",
    hook: "STAY FOR THIS",
    style: "cinematic",
    align: "lower",
    mood: "city, travel, dusk, skyline",
  },
  {
    id: "road",
    title: "Road",
    file: "/templates/road.jpg",
    kind: "scene",
    hook: "KEEP DRIVING",
    style: "caption",
    align: "lower",
    mood: "car, night drive, journey",
  },
  {
    id: "fashion",
    title: "Atelier",
    file: "/templates/fashion.jpg",
    kind: "scene",
    hook: "CUT FROM THIS",
    style: "minimal",
    align: "center",
    mood: "fashion, editorial, wardrobe",
  },
];

export const TEMPLATES: ReelTemplate[] = [...SCENE_TEMPLATES, ...FRAME_TEMPLATES];

export const VOICES = [
  { id: "eve", label: "Eve", tone: "Energetic" },
  { id: "orion", label: "Orion", tone: "Cinematic" },
  { id: "altair", label: "Altair", tone: "Premium" },
  { id: "helix", label: "Helix", tone: "Bold" },
  { id: "luna", label: "Luna", tone: "Gentle" },
  { id: "rex", label: "Rex", tone: "Clear" },
  { id: "leo", label: "Leo", tone: "Strong" },
  { id: "ara", label: "Ara", tone: "Warm" },
] as const;

export const TONES = [
  { id: "street", label: "Street" },
  { id: "luxury", label: "Luxury" },
  { id: "educational", label: "Teach" },
  { id: "punchy", label: "Punchy" },
] as const;

export const HOOK_STYLES: { id: HookStyle; label: string }[] = [
  { id: "cinematic", label: "Cinema" },
  { id: "bold", label: "Bold" },
  { id: "caption", label: "Caption" },
  { id: "minimal", label: "Minimal" },
];

export const HOOK_ALIGNS: { id: HookAlign; label: string }[] = [
  { id: "top", label: "Top" },
  { id: "center", label: "Center" },
  { id: "lower", label: "Lower" },
];

export const LOGO_SPOTS: { id: LogoPosition; label: string }[] = [
  { id: "tl", label: "Top left" },
  { id: "tr", label: "Top right" },
  { id: "bl", label: "Bottom left" },
  { id: "br", label: "Bottom right" },
];

export const QUICK_TAKES = [
  {
    label: "Last set",
    prompt: "Bold gym reel, last-set energy, punchy voiceover, overlay hook LAST SET",
  },
  {
    label: "Night drive",
    prompt: "Cinematic night drive in the rain, calm voiceover, overlay hook KEEP DRIVING",
  },
  {
    label: "Quiet launch",
    prompt: "Minimal luxury product still, no people, overlay hook BUILT QUIET, no voiceover",
  },
];

export function templateById(id: string) {
  if (id === "frame") return FRAME_TEMPLATES[0];
  return TEMPLATES.find((t) => t.id === id) ?? SCENE_TEMPLATES[0] ?? TEMPLATES[0];
}

export function isColorMedia(url: string | null | undefined) {
  return Boolean(url?.startsWith("color:"));
}

export function mediaFill(url: string | null | undefined) {
  if (url?.startsWith("color:")) return url.slice(6) || "#121214";
  return "#121214";
}

export function isUsableMediaUrl(url: string | null | undefined) {
  if (!url) return false;
  if (url.startsWith("blob:")) return false;
  if (url.startsWith("color:")) return true;
  if (url.startsWith("data:")) return url.length < 2_500_000;
  if (url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://")) return true;
  return false;
}

export function persistableMediaUrl(url: string | null | undefined) {
  if (!url) return null;
  if (url.startsWith("color:")) return url;
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  if (url.startsWith("https://") || url.startsWith("http://")) return url;
  return null;
}

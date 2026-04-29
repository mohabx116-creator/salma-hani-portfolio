// =============================================================================
// ARTWORK DATA - single source of truth for the portfolio
// =============================================================================

import betweenRealityCreation from "@/assets/artworks/between-reality-creation.png";
import boundToSilence from "@/assets/artworks/bound-to-silence.png";
import circleOfThoughts from "@/assets/artworks/circle-of-thoughts.png";
import discipline from "@/assets/artworks/discipline.png";
import echoesOfIdentity from "@/assets/artworks/echoes-of-identity.png";
import fadingGrace from "@/assets/artworks/fading-grace.png";
import fragmentsOfLove from "@/assets/artworks/fragments-of-love.png";
import halfSeen from "@/assets/artworks/half-seen.png";
import inTheStudio from "@/assets/artworks/in-the-studio.png";
import loveDecay from "@/assets/artworks/love-decay.png";
import messenger from "@/assets/artworks/messenger.png";
import quietAfternoon from "@/assets/artworks/quiet-afternoon.png";
import silentStrength from "@/assets/artworks/silent-strength.png";
import surroundedBySilence from "@/assets/artworks/surrounded-by-silence.png";
import threeStatesOfBeing from "@/assets/artworks/three-states-of-being.png";
import watcherOfTheEnd from "@/assets/artworks/watcher-of-the-end.png";
import weightOfThought from "@/assets/artworks/weight-of-thought.png";

export type Category =
  | "Portrait"
  | "Conceptual"
  | "Mixed Media"
  | "Landscape"
  | "Process"
  | "Drawing";

export type Placement = "hero" | "featured" | "gallery" | "process" | "about";

export type Artwork = {
  id: string;
  title: string;
  description: string;
  category: Category;
  placement: Placement;
  image: string;
  available: boolean;
  year?: string;
  medium?: string;
  price?: number;
  ratio?: "tall" | "wide" | "square";
};

export const artworks: Artwork[] = [
  {
    id: "silent-strength",
    title: "Silent Strength",
    description: "A poised figure holds a charged silence, where resilience and fracture meet in the body and shadow.",
    category: "Portrait",
    placement: "hero",
    image: silentStrength,
    available: true,
    ratio: "tall",
  },
  {
    id: "echoes-of-identity",
    title: "Echoes of Identity",
    description: "Presence and absence cross in shadow, while the horse emerges as a symbol of restrained power.",
    category: "Conceptual",
    placement: "featured",
    image: echoesOfIdentity,
    available: true,
    ratio: "tall",
  },
  {
    id: "weight-of-thought",
    title: "Weight of Thought",
    description: "An inner conflict takes form as heavy thoughts gather around the figure like unseen spirits.",
    category: "Conceptual",
    placement: "featured",
    image: weightOfThought,
    available: true,
    ratio: "tall",
  },
  {
    id: "watcher-of-the-end",
    title: "Final Watcher",
    description: "A dark sentinel stands at the edge of what remains, holding the tension between life and the unknown.",
    category: "Conceptual",
    placement: "featured",
    image: watcherOfTheEnd,
    available: true,
    ratio: "tall",
  },
  {
    id: "love-decay",
    title: "Love & Decay",
    description: "Love, time, and mortality overlap until feeling becomes an archaeological trace inside memory.",
    category: "Mixed Media",
    placement: "featured",
    image: loveDecay,
    available: true,
    ratio: "square",
  },
  {
    id: "fragments-of-love",
    title: "Love Fragments",
    description: "A torn emotional field where memory, symbol, and visual disruption collide.",
    category: "Mixed Media",
    placement: "featured",
    image: fragmentsOfLove,
    available: true,
    ratio: "wide",
  },
  {
    id: "surrounded-by-silence",
    title: "Inner Silence",
    description: "Isolation gathers inside the noise of the mind, turning skulls into reflections of thought.",
    category: "Conceptual",
    placement: "featured",
    image: surroundedBySilence,
    available: true,
    ratio: "wide",
  },
  {
    id: "three-states-of-being",
    title: "Three States",
    description: "Three psychological states unfold as shifting stages of awareness, presence, and being.",
    category: "Conceptual",
    placement: "featured",
    image: threeStatesOfBeing,
    available: true,
    ratio: "square",
  },
  {
    id: "fading-grace",
    title: "Fading Grace",
    description: "Fragile beauty stands between strength and collapse, suspended in a temporary balance.",
    category: "Portrait",
    placement: "featured",
    image: fadingGrace,
    available: true,
    ratio: "tall",
  },
  {
    id: "between-reality-creation",
    title: "Reality Study",
    description: "A comparison between artistic vision and realistic embodiment, revealing the journey of transformation.",
    category: "Process",
    placement: "process",
    image: betweenRealityCreation,
    available: true,
    ratio: "wide",
  },
  {
    id: "discipline",
    title: "Discipline",
    description: "Commitment and control turn fatigue into strength, and repeated effort into identity.",
    category: "Drawing",
    placement: "process",
    image: discipline,
    available: true,
    ratio: "tall",
  },
  {
    id: "circle-of-thoughts",
    title: "Thought Circle",
    description: "Repeated thoughts close around the mind, forming a loop without a clear beginning or end.",
    category: "Drawing",
    placement: "process",
    image: circleOfThoughts,
    available: true,
    ratio: "square",
  },
  {
    id: "in-the-studio",
    title: "Studio Moment",
    description: "A quiet look inside the artist's world, where an idea begins before it becomes a finished work.",
    category: "Process",
    placement: "about",
    image: inTheStudio,
    available: true,
    ratio: "tall",
  },
  {
    id: "half-seen",
    title: "Half Seen",
    description: "An unfinished identity appears in fragments, with one side revealed and the other held behind reality.",
    category: "Drawing",
    placement: "about",
    image: halfSeen,
    available: true,
    ratio: "wide",
  },
  {
    id: "quiet-afternoon",
    title: "Quiet Afternoon",
    description: "A still natural moment where light and shadow meet in a simple, living scene.",
    category: "Landscape",
    placement: "gallery",
    image: quietAfternoon,
    available: true,
    ratio: "wide",
  },
  {
    id: "messenger",
    title: "Messenger",
    description: "A symbolic figure carries unspoken messages between life and the unknown.",
    category: "Conceptual",
    placement: "gallery",
    image: messenger,
    available: true,
    ratio: "tall",
  },
  {
    id: "bound-to-silence",
    title: "Bound Silence",
    description: "",
    category: "Conceptual",
    placement: "gallery",
    image: boundToSilence,
    available: true,
    ratio: "tall",
  },
];

export const heroArtwork = artworks.find((a) => a.placement === "hero") ?? artworks[0];

export const featuredArtworks = () => artworks.filter((a) => a.placement === "featured");

export const availableArtworks = () =>
  artworks.filter((a) => a.available && typeof a.price === "number");

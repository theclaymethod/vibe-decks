export type BoxType = "text" | "image" | "chart" | "icon" | "card" | "generic";

export interface CanvasBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  type: BoxType;
  color: string;
}

export interface BuilderState {
  boxes: CanvasBox[];
  selectedBoxId: string | null;
  layoutPrompt: string;
  contentPrompt: string;
  templateHint: string;
  slideName: string;
  slidePosition: number;
  mode: "light" | "dark" | "cream";
}

export type GenerationStatus = "idle" | "generating" | "complete" | "error";

export interface GenerationState {
  status: GenerationStatus;
  output: string;
  error: string | null;
}

export const BOX_TYPE_COLORS: Record<BoxType, string> = {
  text: "#3b82f6",
  image: "#10b981",
  chart: "#f59e0b",
  icon: "#8b5cf6",
  card: "#ec4899",
  generic: "#6b7280",
};

export const TEMPLATES = [
  "TitleTemplate",
  "HeroTemplate",
  "SplitContentTemplate",
  "TwoColumnTemplate",
  "StatCardsTemplate",
  "QuoteTemplate",
  "BigNumberTemplate",
  "FeatureGridTemplate",
  "IconGridTemplate",
  "TimelineTemplate",
  "ComparisonTableTemplate",
  "BeforeAfterTemplate",
  "DiagramTemplate",
  "FullscreenImageTemplate",
  "PhotoGridTemplate",
  "PhoneMockupTemplate",
  "BrowserMockupTemplate",
  "TeamTemplate",
  "LogoCloudTemplate",
  "StackedCardsTemplate",
  "ThreeUpTemplate",
] as const;

export const MIN_BOX_WIDTH = 100;
export const MIN_BOX_HEIGHT = 60;

export type ChatMessageStatus = "pending" | "streaming" | "complete" | "error";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
  sessionId: string;
  status: ChatMessageStatus;
}

export interface EditSession {
  slideFileKey: string;
  sessionId: string | null;
  messages: ChatMessage[];
}

export interface GrabbedContext {
  componentName: string;
  filePath: string;
  lineNumber: number | null;
  columnNumber: number | null;
  htmlFrame: string;
  rawContent: string;
}

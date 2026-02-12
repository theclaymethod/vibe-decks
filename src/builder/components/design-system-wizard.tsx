import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useGeneration } from "../hooks/use-generation";
import { useAssets } from "../hooks/use-assets";
import { AssistantContent } from "./assistant-content";

type WizardStep =
  | "references"
  | "palette"
  | "typography"
  | "personality"
  | "plan"
  | "execute"
  | "complete";

const PALETTE_PRESETS = [
  { name: "Monochrome", colors: ["#0A0A0A", "#333333", "#666666", "#CCCCCC", "#FFFFFF"], accent: "#FCD94B" },
  { name: "Corporate Blue", colors: ["#0F172A", "#1E3A5F", "#3B82F6", "#93C5FD", "#F8FAFC"], accent: "#3B82F6" },
  { name: "Earth Tones", colors: ["#1C1917", "#44403C", "#78716C", "#D6D3D1", "#FAFAF9"], accent: "#B45309" },
  { name: "Forest", colors: ["#052E16", "#166534", "#22C55E", "#86EFAC", "#F0FDF4"], accent: "#22C55E" },
  { name: "Warm Coral", colors: ["#1A1A2E", "#16213E", "#E94560", "#F5A6B8", "#FFF5F7"], accent: "#E94560" },
];

const TYPOGRAPHY_OPTIONS = [
  { name: "Industrial", heading: "Bebas Neue", body: "Inter", mono: "JetBrains Mono", desc: "Bold condensed headlines, clean body text. Technical and precise." },
  { name: "Editorial", heading: "Playfair Display", body: "Source Serif Pro", mono: "IBM Plex Mono", desc: "Elegant serifs for headlines, readable serif body. Magazine feel." },
  { name: "Geometric", heading: "Space Grotesk", body: "DM Sans", mono: "Fira Code", desc: "Modern geometric sans throughout. Clean and contemporary." },
  { name: "Humanist", heading: "Libre Baskerville", body: "Nunito", mono: "Inconsolata", desc: "Warm serif headlines, friendly rounded body. Approachable." },
];

const PERSONALITY_OPTIONS = [
  { name: "Sharp & Technical", desc: "No border radius, hard edges, monospaced accents, isometric geometry. Feels like a blueprint.", icon: "cross" as const },
  { name: "Soft & Friendly", desc: "Rounded corners, warm colors, organic shapes. Feels approachable and modern.", icon: "dots" as const },
  { name: "Bold & Editorial", desc: "Dramatic scale contrasts, oversized type, asymmetric layouts. Feels like a magazine spread.", icon: "star" as const },
  { name: "Minimal & Restrained", desc: "Maximum whitespace, subtle borders, understated decoration. Feels considered and quiet.", icon: "arrow" as const },
];

export function DesignSystemWizard() {
  const navigate = useNavigate();
  const generation = useGeneration();
  const [step, setStep] = useState<WizardStep>("references");

  const inspiration = useAssets("inspiration");

  const [urls, setUrls] = useState("");
  const [selectedPalette, setSelectedPalette] = useState<string | null>(null);
  const [customColors, setCustomColors] = useState("");
  const [selectedTypography, setSelectedTypography] = useState<string | null>(null);
  const [selectedPersonality, setSelectedPersonality] = useState<string | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [plan, setPlan] = useState("");

  const planSessionRef = useRef<string | null>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    for (const file of files) inspiration.upload(file);
  }, [inspiration]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    for (const file of files) inspiration.upload(file);
  }, [inspiration]);

  const buildDescription = useCallback((): string => {
    const parts: string[] = [];

    if (selectedPalette) {
      const preset = PALETTE_PRESETS.find((p) => p.name === selectedPalette);
      if (preset) {
        parts.push(`Color palette: "${preset.name}" — primary colors: ${preset.colors.join(", ")}. Accent: ${preset.accent}.`);
      }
    }
    if (customColors.trim()) {
      parts.push(`Additional color notes: ${customColors.trim()}`);
    }

    if (selectedTypography) {
      const typo = TYPOGRAPHY_OPTIONS.find((t) => t.name === selectedTypography);
      if (typo) {
        parts.push(`Typography: "${typo.name}" direction — heading font: ${typo.heading}, body font: ${typo.body}, mono font: ${typo.mono}. ${typo.desc}`);
      }
    }

    if (selectedPersonality) {
      const pers = PERSONALITY_OPTIONS.find((p) => p.name === selectedPersonality);
      if (pers) {
        parts.push(`Look and feel: "${pers.name}" — ${pers.desc}`);
      }
    }

    if (additionalNotes.trim()) {
      parts.push(`Additional notes: ${additionalNotes.trim()}`);
    }

    return parts.join("\n\n");
  }, [selectedPalette, customColors, selectedTypography, selectedPersonality, additionalNotes]);

  const generatePlan = useCallback(async () => {
    setStep("plan");
    const parsedUrls = urls.split("\n").map((u) => u.trim()).filter(Boolean);
    const paths = inspiration.assets.map((a) => a.path);

    await generation.createDesignSystem(
      {
        description: buildDescription(),
        urls: parsedUrls.length > 0 ? parsedUrls : undefined,
        imagePaths: paths.length > 0 ? paths : undefined,
        planOnly: true,
      },
      (sid) => { planSessionRef.current = sid; }
    );
  }, [inspiration.assets, urls, generation, buildDescription]);

  useEffect(() => {
    if (step === "plan" && generation.status === "complete") {
      setPlan(generation.output);
    }
  }, [step, generation.status, generation.output]);

  const executePlan = useCallback(async () => {
    setStep("execute");
    const parsedUrls = urls.split("\n").map((u) => u.trim()).filter(Boolean);
    const paths = inspiration.assets.map((a) => a.path);

    await generation.createDesignSystem({
      description: buildDescription(),
      urls: parsedUrls.length > 0 ? parsedUrls : undefined,
      imagePaths: paths.length > 0 ? paths : undefined,
      planOnly: false,
    });
  }, [inspiration.assets, urls, generation, buildDescription]);

  useEffect(() => {
    if (step === "execute" && generation.status === "complete") {
      setStep("complete");
      fetch("/api/assess-design-system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: buildDescription(),
          imagePaths: inspiration.assets.map((a) => a.path),
        }),
      }).catch(() => {});
    }
  }, [step, generation.status, buildDescription, inspiration.assets]);

  const canProceedToPlan =
    selectedPalette !== null ||
    selectedTypography !== null ||
    selectedPersonality !== null ||
    additionalNotes.trim().length > 0;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Create Design System
          </h1>
          <button
            onClick={() => navigate({ to: "/builder" })}
            className="text-sm text-neutral-500 hover:text-neutral-800"
          >
            Cancel
          </button>
        </div>

        <StepIndicator current={step} />

        {/* Step 1: References */}
        {step === "references" && (
          <div className="space-y-8 mt-8">
            <div>
              <h2 className="text-sm font-medium text-neutral-800 mb-1">
                Reference Images
              </h2>
              <p className="text-xs text-neutral-500 mb-3">
                Upload screenshots, moodboards, or design references to guide the aesthetic.
              </p>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-neutral-400 transition-colors"
              >
                <p className="text-sm text-neutral-500 mb-3">
                  Drag and drop images, or click to browse
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-block px-4 py-2 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-700 cursor-pointer hover:bg-neutral-50"
                >
                  Browse Files
                </label>
              </div>
              {inspiration.assets.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {inspiration.assets.map((asset) => (
                    <div key={asset.filename} className="relative group">
                      <img
                        src={`${asset.path}?t=${asset.modified}`}
                        alt={asset.filename}
                        className="w-24 h-24 object-cover rounded border border-neutral-200"
                      />
                      <button
                        onClick={() => inspiration.remove(asset.filename)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-neutral-900 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-sm font-medium text-neutral-800 mb-1">
                Reference URLs
              </h2>
              <p className="text-xs text-neutral-500 mb-3">
                Link to websites, Dribbble shots, or Figma files for inspiration.
              </p>
              <textarea
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                placeholder={"https://example.com/design-inspiration\nhttps://dribbble.com/shots/..."}
                rows={3}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white focus:border-neutral-400 outline-none resize-none"
              />
            </div>

            <button
              onClick={() => setStep("palette")}
              className="px-6 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Next: Color Palette
            </button>
          </div>
        )}

        {/* Step 2: Color Palette */}
        {step === "palette" && (
          <div className="space-y-8 mt-8">
            <div>
              <h2 className="text-sm font-medium text-neutral-800 mb-1">
                Color Palette
              </h2>
              <p className="text-xs text-neutral-500 mb-4">
                Choose a preset or describe your own. This defines backgrounds, text, borders, and accent.
              </p>
              <div className="space-y-3">
                {PALETTE_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setSelectedPalette(preset.name)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-colors",
                      selectedPalette === preset.name
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-300 bg-white"
                    )}
                  >
                    <div className="flex gap-1 shrink-0">
                      {preset.colors.map((c, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 border border-neutral-200"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      <div
                        className="w-8 h-8 border border-neutral-200 ml-2"
                        style={{ backgroundColor: preset.accent }}
                      />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-neutral-800">
                        {preset.name}
                      </span>
                      <span className="text-xs text-neutral-400 ml-2">
                        accent: {preset.accent}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-neutral-500 block mb-1">
                Custom color notes (optional)
              </label>
              <textarea
                value={customColors}
                onChange={(e) => setCustomColors(e.target.value)}
                placeholder="e.g., Use brand blue #1E40AF as primary, keep backgrounds very light..."
                rows={3}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white focus:border-neutral-400 outline-none resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("references")}
                className="px-6 py-2.5 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep("typography")}
                className="px-6 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Next: Typography
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Typography */}
        {step === "typography" && (
          <div className="space-y-8 mt-8">
            <div>
              <h2 className="text-sm font-medium text-neutral-800 mb-1">
                Typography Direction
              </h2>
              <p className="text-xs text-neutral-500 mb-4">
                Choose a typographic direction. This sets the heading, body, and monospace fonts.
              </p>
              <div className="space-y-3">
                {TYPOGRAPHY_OPTIONS.map((option) => (
                  <button
                    key={option.name}
                    onClick={() => setSelectedTypography(option.name)}
                    className={cn(
                      "w-full p-4 rounded-lg border-2 text-left transition-colors",
                      selectedTypography === option.name
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-300 bg-white"
                    )}
                  >
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-sm font-medium text-neutral-800">
                        {option.name}
                      </span>
                      <span className="text-xs text-neutral-400 font-mono">
                        {option.heading} / {option.body}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500">{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("palette")}
                className="px-6 py-2.5 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep("personality")}
                className="px-6 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Next: Look &amp; Feel
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Look & Feel */}
        {step === "personality" && (
          <div className="space-y-8 mt-8">
            <div>
              <h2 className="text-sm font-medium text-neutral-800 mb-1">
                Look &amp; Feel
              </h2>
              <p className="text-xs text-neutral-500 mb-4">
                Choose the overall personality. This affects border radius, decoration style, layout density, and component aesthetics.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {PERSONALITY_OPTIONS.map((option) => (
                  <button
                    key={option.name}
                    onClick={() => setSelectedPersonality(option.name)}
                    className={cn(
                      "p-5 rounded-lg border-2 text-left transition-colors",
                      selectedPersonality === option.name
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-300 bg-white"
                    )}
                  >
                    <span className="text-sm font-medium text-neutral-800 block mb-1.5">
                      {option.name}
                    </span>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      {option.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-neutral-500 block mb-1">
                Anything else? (optional)
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Additional design direction, specific requirements, brand guidelines to follow..."
                rows={3}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white focus:border-neutral-400 outline-none resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("typography")}
                className="px-6 py-2.5 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={generatePlan}
                disabled={!canProceedToPlan}
                className={cn(
                  "px-6 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  canProceedToPlan
                    ? "bg-neutral-900 text-white hover:bg-neutral-800"
                    : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                )}
              >
                Generate Plan
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Plan Review */}
        {step === "plan" && (
          <div className="space-y-6 mt-8">
            <div>
              <h2 className="text-sm font-medium text-neutral-800 mb-1">
                Design Plan
              </h2>
              <p className="text-xs text-neutral-500 mb-3">
                Review the proposed design decisions before generating the full system.
              </p>
              <div className="border border-neutral-200 rounded-lg bg-white p-4 max-h-[500px] overflow-y-auto text-sm">
                {generation.status === "generating" ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                      <span className="text-neutral-500">Analyzing inputs and building design plan...</span>
                    </div>
                    {generation.output && (
                      <AssistantContent text={generation.output} isStreaming={true} />
                    )}
                  </div>
                ) : (
                  <AssistantContent text={plan || generation.output} isStreaming={false} />
                )}
              </div>
            </div>

            {generation.status === "complete" && (
              <div className="flex gap-3">
                <button
                  onClick={() => setStep("personality")}
                  className="px-6 py-2.5 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Revise Inputs
                </button>
                <button
                  onClick={executePlan}
                  className="px-6 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  Generate Design System
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 6: Execution */}
        {step === "execute" && (
          <div className="space-y-6 mt-8">
            <div>
              <h2 className="text-sm font-medium text-neutral-800 mb-3">
                Generating Design System
              </h2>
              <div className="border border-neutral-200 rounded-lg bg-white p-4 max-h-[500px] overflow-y-auto text-sm">
                {generation.status === "generating" && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    <span className="text-neutral-500">Writing design system files...</span>
                  </div>
                )}
                {generation.output && (
                  <AssistantContent text={generation.output} isStreaming={generation.status === "generating"} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Complete */}
        {step === "complete" && (
          <div className="space-y-6 mt-8 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-neutral-900">
              Design System Created
            </h2>
            <p className="text-sm text-neutral-500 max-w-md mx-auto">
              All design system files have been generated. Open the designer
              to preview your brand brief and make further edits.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate({ to: "/builder/designer" })}
                className="px-6 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Open Designer
              </button>
              <button
                onClick={() => navigate({ to: "/builder" })}
                className="px-6 py-2.5 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Back to Slides
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const STEPS: { key: WizardStep; label: string }[] = [
  { key: "references", label: "References" },
  { key: "palette", label: "Palette" },
  { key: "typography", label: "Type" },
  { key: "personality", label: "Feel" },
  { key: "plan", label: "Plan" },
  { key: "execute", label: "Generate" },
  { key: "complete", label: "Done" },
];

function StepIndicator({ current }: { current: WizardStep }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center gap-1.5">
      {STEPS.map((s, i) => (
        <div key={s.key} className="flex items-center gap-1.5">
          <div
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium transition-colors",
              i < currentIndex && "bg-green-500 text-white",
              i === currentIndex && "bg-neutral-900 text-white",
              i > currentIndex && "bg-neutral-200 text-neutral-400"
            )}
          >
            {i < currentIndex ? (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          <span
            className={cn(
              "text-[10px]",
              i <= currentIndex ? "text-neutral-700" : "text-neutral-400"
            )}
          >
            {s.label}
          </span>
          {i < STEPS.length - 1 && (
            <div
              className={cn(
                "w-5 h-px",
                i < currentIndex ? "bg-green-500" : "bg-neutral-200"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

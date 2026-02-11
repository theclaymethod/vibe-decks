import { useState } from "react";
import { motion } from "motion/react";
import {
  SlideContainer,
  Divider,
  TwoColumnLayout,
  GridSection,
  HeaderBar,
} from "./layout";
import {
  HoverCard,
  HoverCaption,
  AnimatedEntry,
  StaggerContainer,
  AccordionItem,
  ExpandableCard,
} from "./interactions";
import { slideUpVariants } from "./animations";
import {
  HeroTitle,
  SectionHeader,
  Eyebrow,
  BodyText,
  MonoText,
  TechCode,
  Quote,
  Label,
  ListItem,
  PipeList,
  CategoryLabel,
  SectionMarker,
} from "./typography";
import {
  FeatureCard,
  StatCard,
  QuoteCard,
  ProcessCard,
} from "./cards";
import {
  IndustrialIcon,
  IconRow,
  LogoMark,
  CrosshairMark,
  RuleGrid,
  FeatureBlock,
  CategoryGrid,
} from "./decorative";

function BriefSection({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-20">
      <div className="flex items-baseline gap-6 mb-6">
        <TechCode size="lg">{String(number).padStart(2, "0")}</TechCode>
        <SectionHeader className="text-[56px]">{title}</SectionHeader>
      </div>
      <Divider thickness="thick" className="mb-10" />
      {children}
    </div>
  );
}

function ColorSwatch({
  name,
  value,
  cssVar,
  textDark = true,
}: {
  name: string;
  value: string;
  cssVar: string;
  textDark?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <div
        className="w-full h-28 border-2 flex items-end p-3"
        style={{
          backgroundColor: value,
          borderColor: "var(--color-border)",
        }}
      >
        <span
          className="text-[14px] font-mono font-medium"
          style={{ color: textDark ? "#0A0A0A" : "#FFFFFF" }}
        >
          {value}
        </span>
      </div>
      <div className="mt-2">
        <div
          className="text-[16px] font-semibold"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-text-primary)" }}
        >
          {name}
        </div>
        <div
          className="text-[13px] font-mono"
          style={{ color: "var(--color-text-muted)" }}
        >
          {cssVar}
        </div>
      </div>
    </div>
  );
}

function TypeSpecimen({
  label,
  component,
  spec,
}: {
  label: string;
  component: React.ReactNode;
  spec: string;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-baseline justify-between mb-3">
        <TechCode size="sm">{label}</TechCode>
        <span
          className="text-[13px] font-mono"
          style={{ color: "var(--color-text-muted)" }}
        >
          {spec}
        </span>
      </div>
      <Divider thickness="thin" className="mb-4" />
      {component}
    </div>
  );
}

function ReplayWrapper({ children }: { children: React.ReactNode }) {
  const [key, setKey] = useState(0);

  return (
    <div>
      <div key={key}>{children}</div>
      <button
        type="button"
        onClick={() => setKey((k) => k + 1)}
        className="mt-4 px-4 py-2 text-[16px] tracking-[0.1em] uppercase cursor-pointer"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--color-text-muted)",
          backgroundColor: "transparent",
          border: "1px solid var(--color-border-light)",
        }}
      >
        ↻ Replay
      </button>
    </div>
  );
}

export function DesignSystemShowcase() {
  return (
    <div style={{ width: 1920 }}>

      {/* Cover */}
      <SlideContainer mode="dark" className="h-[1080px]">
        <div className="flex flex-col justify-between h-full">
          <HeaderBar
            left={<LogoMark text="VibeDeck" />}
            right={<TechCode size="sm">DESIGN BRIEF V1.0</TechCode>}
          />
          <div className="flex-1 flex flex-col justify-center">
            <Eyebrow className="mb-6">Brand &amp; Design System</Eyebrow>
            <HeroTitle>Design Brief</HeroTitle>
            <BodyText size="lg" className="mt-8 max-w-[900px]">
              A comprehensive guide to our visual language, typographic system,
              color palette, and component library. This document defines how we
              communicate visually and ensures consistency across every slide.
            </BodyText>
          </div>
          <div className="flex items-center justify-between">
            <PipeList items={["Typography", "Color", "Components", "Decorative", "Modes"]} />
            <TechCode size="sm">CONFIDENTIAL</TechCode>
          </div>
        </div>
      </SlideContainer>

      {/* 01 — Brand Overview */}
      <SlideContainer mode="white" className="h-auto min-h-[1080px]">
        <BriefSection number={1} title="Brand Overview">
          <TwoColumnLayout
            ratio="3:2"
            left={
              <div className="space-y-6">
                <BodyText size="lg">
                  The visual identity is rooted in industrial design and Swiss typography.
                  We use high-contrast black and white as the primary palette, with signal yellow
                  as a single accent color. Every element earns its place on the slide — no
                  decoration without purpose.
                </BodyText>
                <BodyText>
                  The system favors stark geometry over soft gradients, monospaced labeling over
                  decorative flourishes, and generous negative space over visual density. Slides
                  should feel like architectural blueprints: precise, intentional, and confident.
                </BodyText>
                <BodyText>
                  Type hierarchy is enforced through scale contrast rather than weight variation.
                  Headlines are set in Bebas Neue at dramatic sizes. Body copy in Inter provides
                  neutral readability. JetBrains Mono handles technical labels and data.
                </BodyText>
              </div>
            }
            right={
              <div className="flex flex-col items-center justify-center gap-8">
                <CrosshairMark size="lg" />
                <CategoryGrid
                  items={[
                    { title: "Precision", icon: "cross" },
                    { title: "Contrast", icon: "star" },
                    { title: "Restraint", icon: "dots" },
                    { title: "Clarity", icon: "arrow" },
                  ]}
                />
              </div>
            }
          />
        </BriefSection>
      </SlideContainer>

      {/* 02 — Color Palette */}
      <SlideContainer mode="white" className="h-auto min-h-[1080px]">
        <BriefSection number={2} title="Color Palette">
          <BodyText className="mb-10 max-w-[1000px]">
            The palette is intentionally minimal. Black and white do the heavy lifting.
            Yellow is reserved for moments of emphasis — a highlighted label, an active state,
            an accent slide. Secondary grays provide hierarchy without introducing new hues.
            This constraint forces clarity: if a slide needs color to make sense, the layout
            needs rethinking.
          </BodyText>

          <Eyebrow className="mb-6">Primary</Eyebrow>
          <GridSection columns={3} gap="lg" className="mb-12">
            <ColorSwatch name="Black" value="#0A0A0A" cssVar="--color-black" textDark={false} />
            <ColorSwatch name="White" value="#FFFFFF" cssVar="--color-white" />
            <ColorSwatch name="Signal Yellow" value="#FCD94B" cssVar="--color-yellow" />
          </GridSection>

          <Eyebrow className="mb-6">Text Hierarchy</Eyebrow>
          <GridSection columns={4} gap="lg" className="mb-12">
            <ColorSwatch name="Primary" value="#0A0A0A" cssVar="--color-text-primary" textDark={false} />
            <ColorSwatch name="Secondary" value="#333333" cssVar="--color-text-secondary" textDark={false} />
            <ColorSwatch name="Muted" value="#888888" cssVar="--color-text-muted" textDark={false} />
            <ColorSwatch name="Inverse" value="#FFFFFF" cssVar="--color-text-inverse" />
          </GridSection>

          <Eyebrow className="mb-6">Backgrounds</Eyebrow>
          <GridSection columns={3} gap="lg">
            <ColorSwatch name="Primary BG" value="#FFFFFF" cssVar="--color-bg-primary" />
            <ColorSwatch name="Secondary BG" value="#F5F5F5" cssVar="--color-bg-secondary" />
            <ColorSwatch name="Dark BG" value="#0A0A0A" cssVar="--color-bg-dark" textDark={false} />
          </GridSection>
        </BriefSection>
      </SlideContainer>

      {/* 03 — Typography */}
      <SlideContainer mode="white" className="h-auto min-h-[1080px]">
        <BriefSection number={3} title="Typography">
          <BodyText className="mb-10 max-w-[1000px]">
            Three typefaces, each with a distinct role. Bebas Neue is the voice — bold,
            condensed, all-caps. It commands attention at hero scale and maintains
            authority at section headers. Inter is the workhorse — clean, neutral, optimized
            for screen reading at any size. JetBrains Mono provides technical precision
            for labels, codes, and data that needs to align cleanly.
          </BodyText>

          <TypeSpecimen
            label="HERO TITLE"
            spec="Bebas Neue · 140px · leading 0.85 · tracking -0.02em · uppercase"
            component={<HeroTitle>Aa Bb Cc</HeroTitle>}
          />
          <TypeSpecimen
            label="SECTION HEADER"
            spec="Bebas Neue · 72px · leading 0.9 · tracking -0.01em · uppercase"
            component={<SectionHeader>Section Header Text</SectionHeader>}
          />
          <TypeSpecimen
            label="EYEBROW"
            spec="Inter · 18px · tracking 0.15em · uppercase · semibold"
            component={<Eyebrow>Eyebrow Label</Eyebrow>}
          />
          <TypeSpecimen
            label="BODY LARGE"
            spec="Inter · 28px · leading 1.6"
            component={<BodyText size="lg">The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.</BodyText>}
          />
          <TypeSpecimen
            label="BODY MEDIUM"
            spec="Inter · 24px · leading 1.6"
            component={<BodyText>The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.</BodyText>}
          />
          <TypeSpecimen
            label="BODY SMALL"
            spec="Inter · 20px · leading 1.5"
            component={<BodyText size="sm">The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.</BodyText>}
          />
          <TypeSpecimen
            label="MONO TEXT"
            spec="Inter · 20px · leading 1.6"
            component={<MonoText>Mono 0123456789 — used for secondary technical text</MonoText>}
          />
          <TypeSpecimen
            label="TECH CODE"
            spec="JetBrains Mono · 14–22px · tracking 0.1em · uppercase"
            component={
              <div className="flex items-baseline gap-8">
                <TechCode size="lg">TECH LG</TechCode>
                <TechCode>TECH MD</TechCode>
                <TechCode size="sm">TECH SM</TechCode>
              </div>
            }
          />
          <TypeSpecimen
            label="QUOTE"
            spec="Bebas Neue · 52px · leading 1.2 · uppercase"
            component={
              <Quote attribution="Attribution Name, Role">
                Design is not just what it looks like. Design is how it works.
              </Quote>
            }
          />
        </BriefSection>
      </SlideContainer>

      {/* 04 — Labels & Lists */}
      <SlideContainer mode="white" className="h-auto min-h-[1080px]">
        <BriefSection number={4} title="Labels & Lists">
          <BodyText className="mb-10 max-w-[1000px]">
            Supporting typographic elements for structured content. Labels provide
            categorical emphasis. Lists use numbered markers with monospaced indices
            for technical precision. Pipe-separated lists work inline for metadata
            and navigation.
          </BodyText>

          <Eyebrow className="mb-6">Labels</Eyebrow>
          <div className="flex gap-4 mb-12">
            <Label>Default</Label>
            <Label variant="primary">Primary</Label>
            <Label variant="dark">Dark</Label>
          </div>

          <Eyebrow className="mb-6">Numbered List</Eyebrow>
          <div className="space-y-3 mb-12">
            <ListItem number={1}>Define the problem space and user needs clearly</ListItem>
            <ListItem number={2}>Map the solution to existing component primitives</ListItem>
            <ListItem number={3}>Compose the slide from design system building blocks</ListItem>
          </div>

          <Eyebrow className="mb-6">Pipe List</Eyebrow>
          <PipeList items={["Strategy", "Design", "Engineering", "Launch", "Growth"]} className="mb-12" />

          <Eyebrow className="mb-6">Category Label</Eyebrow>
          <div className="flex gap-12 mb-12">
            <CategoryLabel title="Category" subtitle="With a subtitle" />
            <CategoryLabel title="Standalone" />
          </div>

          <Eyebrow className="mb-6">Section Marker</Eyebrow>
          <div className="space-y-2">
            <SectionMarker number={1} label="Introduction" />
            <SectionMarker number={2} label="Problem Statement" />
            <SectionMarker number={3} label="Solution" />
          </div>
        </BriefSection>
      </SlideContainer>

      {/* 05 — Component Library */}
      <SlideContainer mode="white" className="h-auto min-h-[1080px]">
        <BriefSection number={5} title="Component Library">
          <BodyText className="mb-10 max-w-[1000px]">
            Components are the building blocks for slides. Each is designed to work
            independently or in combination. They inherit the active color mode
            through CSS variables — the same StatCard renders correctly on white,
            dark, or yellow backgrounds without any code changes.
          </BodyText>

          <Eyebrow className="mb-6">Feature Cards</Eyebrow>
          <BodyText size="sm" className="mb-4">
            For highlighting capabilities, benefits, or key points. Icon optional.
          </BodyText>
          <GridSection columns={3} className="mb-16">
            <FeatureCard
              icon={<IndustrialIcon symbol="star" size="lg" />}
              title="Feature Title"
              description="A concise description of the feature or capability being highlighted."
              className="border-2"
            />
            <FeatureCard
              icon={<IndustrialIcon symbol="cross" size="lg" />}
              title="Second Feature"
              description="Cards work best in groups of 2–4, placed inside a GridSection."
              className="border-2"
            />
            <FeatureCard
              title="Without Icon"
              description="Icons are optional. The card adapts to text-only content."
              className="border-2"
            />
          </GridSection>

          <Eyebrow className="mb-6">Stat Cards</Eyebrow>
          <BodyText size="sm" className="mb-4">
            For key metrics. The value is set in Bebas Neue at 96px for maximum impact.
          </BodyText>
          <GridSection columns={4} className="mb-16">
            <StatCard value="99.9%" label="Uptime" sublabel="Last 12 months" className="border-2" />
            <StatCard value="2.4M" label="Active Users" className="border-2" />
            <StatCard value="<50ms" label="P95 Latency" sublabel="Global average" className="border-2" />
            <StatCard value="150+" label="Countries" className="border-2" />
          </GridSection>

          <Eyebrow className="mb-6">Quote Cards</Eyebrow>
          <BodyText size="sm" className="mb-4">
            For testimonials and attributed quotes. The initial-letter avatar reinforces
            the personal attribution.
          </BodyText>
          <GridSection columns={2} className="mb-16">
            <QuoteCard
              quote="The system scales with our ambitions."
              attribution="Sarah Chen"
              role="VP Design, Acme Corp"
              className="border-2"
            />
            <QuoteCard
              quote="Clean, opinionated, and ready to ship."
              attribution="Marcus Johnson"
              role="CTO, StartupCo"
              className="border-2"
            />
          </GridSection>

          <Eyebrow className="mb-6">Process Cards</Eyebrow>
          <BodyText size="sm" className="mb-4">
            For sequential workflows. The numbered index uses monospace for alignment.
          </BodyText>
          <GridSection columns={4} className="mb-12">
            <ProcessCard number={1} title="Discover" description="Research and define." className="border-2" />
            <ProcessCard number={2} title="Design" description="Wireframe and iterate." className="border-2" />
            <ProcessCard number={3} title="Build" description="Implement with precision." className="border-2" />
            <ProcessCard number={4} title="Ship" description="Deploy and monitor." className="border-2" />
          </GridSection>
        </BriefSection>
      </SlideContainer>

      {/* 06 — Decorative Language */}
      <SlideContainer mode="white" className="h-auto min-h-[1080px]">
        <BriefSection number={6} title="Decorative Language">
          <BodyText className="mb-10 max-w-[1000px]">
            Decoration is restrained and systematic. Industrial icons are typographic glyphs —
            not illustrations. Registration marks and rule grids provide visual texture
            without competing with content. These elements say "precision engineering"
            without saying a word.
          </BodyText>

          <Eyebrow className="mb-6">Industrial Icon Set</Eyebrow>
          <BodyText size="sm" className="mb-4">
            Seven glyphs at three sizes. Used for markers, bullets, and subtle visual accents.
          </BodyText>
          <div className="flex items-end gap-14 mb-16">
            {(["star", "cross", "dots", "asterisk", "x", "arrow", "plus"] as const).map((sym) => (
              <div key={sym} className="flex flex-col items-center gap-4">
                <span className="text-[48px] inline-block" style={{ color: "var(--color-text-muted)" }}>
                  {sym === "star" ? "✦" : sym === "cross" ? "⊕" : sym === "dots" ? "::" : sym === "asterisk" ? "✱" : sym === "x" ? "×" : sym === "arrow" ? "→" : "+"}
                </span>
                <span className="text-[32px] inline-block" style={{ color: "var(--color-text-muted)" }}>
                  {sym === "star" ? "✦" : sym === "cross" ? "⊕" : sym === "dots" ? "::" : sym === "asterisk" ? "✱" : sym === "x" ? "×" : sym === "arrow" ? "→" : "+"}
                </span>
                <span className="text-[20px] inline-block" style={{ color: "var(--color-text-muted)" }}>
                  {sym === "star" ? "✦" : sym === "cross" ? "⊕" : sym === "dots" ? "::" : sym === "asterisk" ? "✱" : sym === "x" ? "×" : sym === "arrow" ? "→" : "+"}
                </span>
                <TechCode>{sym}</TechCode>
              </div>
            ))}
          </div>

          <Eyebrow className="mb-6">Icon Row</Eyebrow>
          <div className="flex items-center gap-8 mb-16">
            {(["star", "cross", "dots", "asterisk", "arrow"] as const).map((sym) => (
              <span key={sym} className="text-[36px] inline-block" style={{ color: "var(--color-text-muted)" }}>
                {sym === "star" ? "✦" : sym === "cross" ? "⊕" : sym === "dots" ? "::" : sym === "asterisk" ? "✱" : "→"}
              </span>
            ))}
          </div>

          <Eyebrow className="mb-6">Feature Blocks</Eyebrow>
          <BodyText size="sm" className="mb-4">
            Compact content blocks with optional eyebrow, icon, and description.
          </BodyText>
          <GridSection columns={3} className="mb-16">
            <FeatureBlock eyebrow="01" title="Speed" description="Optimized at every layer." icon="arrow" />
            <FeatureBlock eyebrow="02" title="Scale" description="Built for millions." icon="plus" />
            <FeatureBlock eyebrow="03" title="Security" description="Enterprise-grade." icon="star" />
          </GridSection>

          <Eyebrow className="mb-6">Structural Elements</Eyebrow>
          <BodyText size="sm" className="mb-4">
            Registration marks and rule grids add technical texture to layouts.
            Use sparingly — as background elements or visual anchors, never as primary content.
          </BodyText>
          <div className="flex items-center gap-16 mb-12">
            <CrosshairMark size="sm" />
            <CrosshairMark size="md" />
            <CrosshairMark size="lg" />
            <div className="w-64 h-64">
              <RuleGrid />
            </div>
          </div>

          <Eyebrow className="mb-6">Category Grid</Eyebrow>
          <CategoryGrid
            items={[
              { title: "Strategy", subtitle: "Planning & Research", icon: "star" },
              { title: "Design", subtitle: "Visual & UX", icon: "cross" },
              { title: "Engineering", subtitle: "Build & Ship", icon: "dots" },
              { title: "Growth", subtitle: "Scale & Optimize", icon: "arrow" },
            ]}
          />
        </BriefSection>
      </SlideContainer>

      {/* 07 — Color Modes */}
      <SlideContainer mode="dark" className="h-auto min-h-[1080px]">
        <BriefSection number={7} title="Color Modes">
          <BodyText className="mb-8 max-w-[1000px]">
            Three modes — white, dark, and yellow — control the entire palette through
            CSS custom properties. Components never reference literal colors. Every
            element reads from the active mode's variables, so switching context is a
            single attribute change on the slide container.
          </BodyText>

          <Eyebrow className="mb-4">Dark Mode (active)</Eyebrow>
          <BodyText size="sm" className="mb-6">
            The inverted palette. White text on black. Borders flip to white. Used for
            emphasis slides, section breaks, and dramatic contrast.
          </BodyText>

          <GridSection columns={3} className="mb-16">
            <StatCard value="42" label="Metric" className="border" />
            <FeatureCard
              icon={<IndustrialIcon symbol="star" size="lg" />}
              title="Feature"
              description="Cards inherit the dark theme automatically."
              className="border"
            />
            <ProcessCard number={1} title="Step" description="All components adapt." className="border" />
          </GridSection>

          <Quote attribution="Design Principle">
            Color is structural, not decorative. Modes define context.
          </Quote>
        </BriefSection>
      </SlideContainer>

      <SlideContainer mode="yellow" className="h-auto min-h-[1080px]">
        <BriefSection number={7} title="Yellow Mode">
          <BodyText className="mb-8 max-w-[1000px]">
            The accent mode. Signal yellow (#FCD94B) floods the background. Text stays
            black for maximum legibility. Use for title slides, callouts, or any moment
            that needs to break the rhythm of black-and-white.
          </BodyText>

          <GridSection columns={2} className="mb-12">
            <QuoteCard
              quote="Yellow demands attention."
              attribution="Creative Director"
              role="Brand Team"
              className="border-2"
            />
            <div className="flex flex-col justify-center space-y-4 p-6">
              <Label>Default Label</Label>
              <Label variant="dark">Dark Label</Label>
              <Divider />
              <PipeList items={["Bold", "Bright", "Intentional"]} />
            </div>
          </GridSection>
        </BriefSection>
      </SlideContainer>

      {/* 08 — Usage Guidelines */}
      <SlideContainer mode="white" className="h-auto min-h-[1080px]">
        <BriefSection number={8} title="Usage Guidelines">
          <TwoColumnLayout
            ratio="1:1"
            left={
              <div className="space-y-8">
                <div>
                  <Eyebrow className="mb-4">Do</Eyebrow>
                  <div className="space-y-3">
                    <ListItem number={1}>Use CSS variables for all colors — never hardcode hex values</ListItem>
                    <ListItem number={2}>Let negative space do the work — resist the urge to fill</ListItem>
                    <ListItem number={3}>Stick to the type scale — 140, 72, 52, 28, 24, 20, 18, 16, 14px</ListItem>
                    <ListItem number={4}>Use Tailwind for spacing and layout, style props for color</ListItem>
                    <ListItem number={5}>Compose slides from primitives — never build from scratch</ListItem>
                  </div>
                </div>
              </div>
            }
            right={
              <div className="space-y-8">
                <div>
                  <Eyebrow className="mb-4">Avoid</Eyebrow>
                  <div className="space-y-3">
                    <ListItem number={1}>Rounded corners — the system uses sharp geometry exclusively</ListItem>
                    <ListItem number={2}>Gradients, shadows, or blur effects</ListItem>
                    <ListItem number={3}>More than one accent color per slide</ListItem>
                    <ListItem number={4}>Decorative elements that don't serve information hierarchy</ListItem>
                    <ListItem number={5}>Tailwind color classes — always use CSS variable style props</ListItem>
                  </div>
                </div>
              </div>
            }
          />
        </BriefSection>
      </SlideContainer>

      {/* 09 — Interactive Primitives */}
      <SlideContainer mode="white" className="h-auto min-h-[1080px]">
        <BriefSection number={9} title="Interactive Primitives">
          <BodyText className="mb-6 max-w-[1000px]">
            Interactive behavior is composed via wrappers — static components stay untouched.
            Wrap any card or block in a HoverCard to add lift and shadow on hover, or in an
            AnimatedEntry to fade in on mount. Interactive states follow "relaxed rules" — shadows
            and soft radii are permitted to signal interactivity.
          </BodyText>
          <BodyText size="sm" className="mb-10 max-w-[1000px]">
            These wrappers compose around existing primitives. A FeatureCard inside a HoverCard
            gains hover behavior without any changes to the card itself.
          </BodyText>

          <Eyebrow className="mb-6">Hover Card — Lift Amounts</Eyebrow>
          <BodyText size="sm" className="mb-4">
            Three lift presets: sm (-4px), md (-8px), lg (-12px). Shadow enabled by default.
          </BodyText>
          <GridSection columns={3} className="mb-16">
            <HoverCard lift="sm">
              <FeatureCard
                icon={<IndustrialIcon symbol="star" size="lg" />}
                title="Small Lift"
                description="Subtle elevation for dense layouts. Lift: -4px."
                className="border-2"
              />
            </HoverCard>
            <HoverCard lift="md">
              <FeatureCard
                icon={<IndustrialIcon symbol="cross" size="lg" />}
                title="Medium Lift"
                description="Default. Good for card grids. Lift: -8px."
                className="border-2"
              />
            </HoverCard>
            <HoverCard lift="lg">
              <FeatureCard
                icon={<IndustrialIcon symbol="arrow" size="lg" />}
                title="Large Lift"
                description="Dramatic hover for hero cards. Lift: -12px."
                className="border-2"
              />
            </HoverCard>
          </GridSection>

          <Eyebrow className="mb-6">Animated Entry + Stagger</Eyebrow>
          <BodyText size="sm" className="mb-4">
            AnimatedEntry fades/slides children on mount. StaggerContainer sequences children
            so they animate in one after another.
          </BodyText>
          <ReplayWrapper>
            <StaggerContainer stagger={0.15} delay={0} className="grid grid-cols-4 gap-6">
              <motion.div variants={slideUpVariants}>
                <StatCard value="99%" label="Uptime" className="border-2" />
              </motion.div>
              <motion.div variants={slideUpVariants}>
                <StatCard value="2.4M" label="Users" className="border-2" />
              </motion.div>
              <motion.div variants={slideUpVariants}>
                <StatCard value="<50ms" label="Latency" className="border-2" />
              </motion.div>
              <motion.div variants={slideUpVariants}>
                <StatCard value="150+" label="Countries" className="border-2" />
              </motion.div>
            </StaggerContainer>
          </ReplayWrapper>
        </BriefSection>
      </SlideContainer>

      {/* 10 — Expandable Patterns */}
      <SlideContainer mode="white" className="h-auto min-h-[1080px]">
        <BriefSection number={10} title="Expandable Patterns">
          <BodyText className="mb-6 max-w-[1000px]">
            Progressive disclosure keeps interfaces clean. Accordion items collapse and expand
            on click — ideal for FAQ sections, settings panels, and long-form content that
            should not all be visible at once. Expandable cards zoom inline to reveal detail
            without navigating away.
          </BodyText>
          <BodyText size="sm" className="mb-10 max-w-[1000px]">
            Use accordions when content is mutually exclusive or secondary. Use expandable cards
            when the preview itself is the primary content and the detail is supplementary.
          </BodyText>

          <Eyebrow className="mb-6">Accordion</Eyebrow>
          <div className="max-w-[900px] mb-16">
            <AccordionItem
              trigger={
                <span
                  className="text-[24px] uppercase"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
                >
                  What design principles guide this system?
                </span>
              }
            >
              <BodyText size="sm">
                Precision over decoration. The system uses high-contrast black and white,
                sharp geometry, and generous negative space. Every element earns its place —
                no gradients, no blur, no rounded corners on static components. Interactive
                states get relaxed rules: shadows and soft radii signal that an element responds
                to user input.
              </BodyText>
            </AccordionItem>
            <AccordionItem
              trigger={
                <span
                  className="text-[24px] uppercase"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
                >
                  How do color modes work?
                </span>
              }
            >
              <BodyText size="sm">
                Three modes — white, dark, and yellow — controlled by CSS custom properties.
                Components never reference literal colors. A single data attribute on the
                SlideContainer switches the entire palette. Interactive wrappers inherit
                the active mode automatically.
              </BodyText>
            </AccordionItem>
            <AccordionItem
              trigger={
                <span
                  className="text-[24px] uppercase"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
                >
                  Can I nest interactive wrappers?
                </span>
              }
            >
              <BodyText size="sm">
                Yes. A HoverCard can wrap an ExpandableCard. A StaggerContainer can contain
                AnimatedEntry children. Wrappers are composable by design — they add behavior
                without modifying the wrapped component.
              </BodyText>
            </AccordionItem>
          </div>

          <Eyebrow className="mb-6">Expandable Card</Eyebrow>
          <BodyText size="sm" className="mb-4">
            Click the card to expand. Click again or click outside to collapse.
          </BodyText>
          <div className="max-w-[600px] mb-12">
            <ExpandableCard
              className="border-2"
              preview={
                <FeatureCard
                  icon={<IndustrialIcon symbol="plus" size="lg" />}
                  title="Expandable Feature"
                  description="Click to reveal additional detail below."
                />
              }
              detail={
                <div className="px-6 pb-6">
                  <Divider thickness="thin" className="mb-4" />
                  <BodyText size="sm">
                    The expanded state reveals supplementary content inline. Layout animations
                    keep the transition smooth. The card gains an elevated shadow to reinforce
                    the active state. This pattern works well for feature lists where each
                    item has a short preview and a longer explanation.
                  </BodyText>
                </div>
              }
            />
          </div>
        </BriefSection>
      </SlideContainer>

      {/* 11 — Hover & Caption */}
      <SlideContainer mode="white" className="h-auto min-h-[1080px]">
        <BriefSection number={11} title="Hover & Caption">
          <BodyText className="mb-6 max-w-[1000px]">
            Micro-interactions add delight without clutter. Hover captions slide in from the
            edge of a container on mouse enter — ideal for image galleries, portfolio grids,
            and any layout where descriptive text should appear on demand rather than
            permanently.
          </BodyText>
          <BodyText size="sm" className="mb-10 max-w-[1000px]">
            The dark overlay (rgba(0,0,0,0.85)) ensures caption text remains legible regardless
            of the content beneath. Position can be top or bottom.
          </BodyText>

          <Eyebrow className="mb-6">Hover Caption</Eyebrow>
          <BodyText size="sm" className="mb-4">
            Hover over the blocks below to reveal captions.
          </BodyText>
          <GridSection columns={3} className="mb-16">
            <HoverCaption
              caption={
                <span
                  className="text-[18px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Caption from bottom — default position
                </span>
              }
            >
              <div
                className="h-48 flex items-center justify-center"
                style={{ backgroundColor: "var(--color-bg-secondary)" }}
              >
                <SectionHeader className="text-[36px]">Block A</SectionHeader>
              </div>
            </HoverCaption>
            <HoverCaption
              position="top"
              caption={
                <span
                  className="text-[18px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Caption from top
                </span>
              }
            >
              <div
                className="h-48 flex items-center justify-center"
                style={{ backgroundColor: "var(--color-yellow)" }}
              >
                <SectionHeader className="text-[36px]">Block B</SectionHeader>
              </div>
            </HoverCaption>
            <HoverCaption
              caption={
                <span
                  className="text-[18px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Works on any content
                </span>
              }
            >
              <div
                className="h-48 flex items-center justify-center"
                style={{ backgroundColor: "var(--color-bg-dark)", color: "var(--color-white)" }}
              >
                <SectionHeader className="text-[36px]">Block C</SectionHeader>
              </div>
            </HoverCaption>
          </GridSection>

          <Eyebrow className="mb-6">Lift Comparison on Stat Cards</Eyebrow>
          <BodyText size="sm" className="mb-4">
            sm, md, and lg lift amounts compared side by side on stat cards.
          </BodyText>
          <GridSection columns={3} className="mb-12">
            <div className="text-center">
              <HoverCard lift="sm">
                <StatCard value="SM" label="Lift -4px" className="border-2" />
              </HoverCard>
              <TechCode size="sm" className="mt-3">lift="sm"</TechCode>
            </div>
            <div className="text-center">
              <HoverCard lift="md">
                <StatCard value="MD" label="Lift -8px" className="border-2" />
              </HoverCard>
              <TechCode size="sm" className="mt-3">lift="md"</TechCode>
            </div>
            <div className="text-center">
              <HoverCard lift="lg">
                <StatCard value="LG" label="Lift -12px" className="border-2" />
              </HoverCard>
              <TechCode size="sm" className="mt-3">lift="lg"</TechCode>
            </div>
          </GridSection>
        </BriefSection>
      </SlideContainer>

    </div>
  );
}

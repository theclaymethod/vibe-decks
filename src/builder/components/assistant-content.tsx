import { type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

type Segment =
  | { kind: "text"; text: string }
  | { kind: "tool"; tool: string; target: string }
  | { kind: "result"; text: string }
  | { kind: "question"; text: string }
  | { kind: "option"; label: string; description: string }
  | { kind: "plan"; text: string };

const TOOL_RE = /^\[(Read|Edit|Write|Bash|Glob|Grep|Task|Skill|TodoWrite|TodoRead)\]\s*(.*)$/;
const QUESTION_RE = /^\[Question\]\s*(.*)$/;
const OPTION_RE = /^\[Option\]\s*(.*)$/;
const PLAN_RE = /^\[Plan\]\s*(.*)$/;

export function parseSegments(raw: string): Segment[] {
  const lines = raw.split("\n");
  const segments: Segment[] = [];
  let textBuf = "";
  let lastTool: Segment | null = null;

  const flushText = () => {
    const trimmed = textBuf.trim();
    if (trimmed) segments.push({ kind: "text", text: trimmed });
    textBuf = "";
  };

  for (const line of lines) {
    const toolMatch = line.match(TOOL_RE);
    const questionMatch = line.match(QUESTION_RE);
    const optionMatch = line.match(OPTION_RE);
    const planMatch = line.match(PLAN_RE);

    if (questionMatch) {
      flushText();
      if (lastTool) { segments.push(lastTool); lastTool = null; }
      segments.push({ kind: "question", text: questionMatch[1] });
    } else if (optionMatch) {
      flushText();
      if (lastTool) { segments.push(lastTool); lastTool = null; }
      const raw = optionMatch[1];
      const dashIdx = raw.indexOf(" - ");
      const label = dashIdx >= 0 ? raw.slice(0, dashIdx) : raw;
      const description = dashIdx >= 0 ? raw.slice(dashIdx + 3) : "";
      segments.push({ kind: "option", label, description });
    } else if (planMatch) {
      flushText();
      if (lastTool) { segments.push(lastTool); lastTool = null; }
      segments.push({ kind: "plan", text: planMatch[1] });
    } else if (toolMatch) {
      flushText();
      if (lastTool) segments.push(lastTool);
      lastTool = { kind: "tool", tool: toolMatch[1], target: toolMatch[2] };
    } else if (lastTool && line.trim() && !line.match(TOOL_RE)) {
      segments.push(lastTool);
      lastTool = null;

      if (
        line.trim().startsWith("The file") ||
        line.trim().startsWith("Successfully") ||
        line.trim().match(/^\d+ files? /)
      ) {
        segments.push({ kind: "result", text: line.trim() });
      } else {
        textBuf += line + "\n";
      }
    } else {
      textBuf += line + "\n";
    }
  }

  if (lastTool) segments.push(lastTool);
  flushText();
  return segments;
}

const TOOL_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  Read: { label: "READ", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  Edit: { label: "EDIT", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  Write: { label: "WRITE", color: "text-green-600", bg: "bg-green-50 border-green-200" },
  Bash: { label: "RUN", color: "text-violet-600", bg: "bg-violet-50 border-violet-200" },
  Glob: { label: "FIND", color: "text-cyan-600", bg: "bg-cyan-50 border-cyan-200" },
  Grep: { label: "SEARCH", color: "text-cyan-600", bg: "bg-cyan-50 border-cyan-200" },
  Task: { label: "TASK", color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
  Skill: { label: "SKILL", color: "text-pink-600", bg: "bg-pink-50 border-pink-200" },
  TodoWrite: { label: "TODO", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  TodoRead: { label: "TODO", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
};

function ToolBlock({ tool, target }: { tool: string; target: string }) {
  const style = TOOL_STYLES[tool] ?? {
    label: tool.toUpperCase(),
    color: "text-neutral-600",
    bg: "bg-neutral-50 border-neutral-200",
  };

  return (
    <div className={cn("flex items-center gap-1.5 rounded border px-2 py-1 my-1", style.bg)}>
      <span
        className={cn(
          "text-[9px] font-bold uppercase tracking-wider shrink-0",
          style.color
        )}
      >
        {style.label}
      </span>
      <span className="text-[10px] font-mono text-neutral-600 truncate">
        {target}
      </span>
    </div>
  );
}

function ResultLine({ text }: { text: string }) {
  return (
    <div className="text-[10px] text-green-600 font-mono pl-2 border-l-2 border-green-200 my-1">
      {text}
    </div>
  );
}

function QuestionBlock({ text }: { text: string }) {
  return (
    <div className="my-2 px-3 py-2 rounded-lg bg-indigo-50 border border-indigo-200">
      <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-500 block mb-1">
        Question
      </span>
      <p className="text-xs text-indigo-900 leading-relaxed">{text}</p>
    </div>
  );
}

function OptionButton({
  label,
  description,
  onSelect,
}: {
  label: string;
  description: string;
  onSelect: (label: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(label)}
      className="w-full text-left my-0.5 px-3 py-1.5 rounded border border-indigo-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 transition-colors group"
    >
      <span className="text-xs font-medium text-indigo-700 group-hover:text-indigo-900">
        {label}
      </span>
      {description && (
        <span className="text-[10px] text-neutral-500 block mt-0.5">{description}</span>
      )}
    </button>
  );
}

function PlanIndicator({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1.5 my-2 px-3 py-2 rounded-lg bg-violet-50 border border-violet-200">
      <span className="text-[9px] font-bold uppercase tracking-wider text-violet-500 shrink-0">
        Plan Mode
      </span>
      <span className="text-[10px] text-violet-700">{text}</span>
    </div>
  );
}

interface QuestionGroup {
  question: string;
  options: Array<{ label: string; description: string }>;
}

type GroupedItem =
  | { kind: "segment"; segment: Segment }
  | { kind: "questions"; groups: QuestionGroup[] };

function groupQuestions(segments: Segment[]): GroupedItem[] {
  const items: GroupedItem[] = [];
  let i = 0;

  while (i < segments.length) {
    if (segments[i].kind === "question") {
      const groups: QuestionGroup[] = [];
      while (i < segments.length && segments[i].kind === "question") {
        const q = segments[i] as { kind: "question"; text: string };
        i++;
        const opts: Array<{ label: string; description: string }> = [];
        while (i < segments.length && segments[i].kind === "option") {
          const o = segments[i] as { kind: "option"; label: string; description: string };
          opts.push({ label: o.label, description: o.description });
          i++;
        }
        groups.push({ question: q.text, options: opts });
      }
      items.push({ kind: "questions", groups });
    } else {
      items.push({ kind: "segment", segment: segments[i] });
      i++;
    }
  }

  return items;
}

function QuestionWizard({
  groups,
  onSubmit,
}: {
  groups: QuestionGroup[];
  onSubmit: (formatted: string) => void;
}) {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Map<number, string>>(new Map());

  const current = groups[step];
  const selected = selections.get(step);
  const isLast = step === groups.length - 1;

  const handleSelect = (label: string) => {
    setSelections((prev) => new Map(prev).set(step, label));
  };

  const handleSubmit = () => {
    const lines = groups.map((g, i) => `${g.question}: ${selections.get(i) ?? ""}`);
    onSubmit(lines.join("\n"));
  };

  return (
    <div className="my-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-500">
          Question {step + 1} of {groups.length}
        </span>
        <div className="flex-1 h-1 rounded-full bg-neutral-100 overflow-hidden">
          <div
            className="h-full bg-indigo-400 rounded-full transition-all"
            style={{ width: `${((step + 1) / groups.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="px-3 py-2 rounded-lg bg-indigo-50 border border-indigo-200 mb-2">
        <p className="text-xs text-indigo-900 leading-relaxed">{current.question}</p>
      </div>

      <div className="space-y-0.5">
        {current.options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => handleSelect(opt.label)}
            className={cn(
              "w-full text-left px-3 py-1.5 rounded border transition-colors",
              selected === opt.label
                ? "bg-indigo-100 border-indigo-400"
                : "bg-white border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300"
            )}
          >
            <span className="text-xs font-medium text-indigo-700">{opt.label}</span>
            {opt.description && (
              <span className="text-[10px] text-neutral-500 block mt-0.5">
                {opt.description}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="px-2.5 py-1 rounded text-[10px] font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors"
          >
            Back
          </button>
        )}
        <div className="flex-1" />
        {isLast ? (
          <button
            onClick={handleSubmit}
            disabled={!selected}
            className={cn(
              "px-3 py-1 rounded text-[10px] font-medium transition-colors",
              selected
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
            )}
          >
            Submit
          </button>
        ) : (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!selected}
            className={cn(
              "px-3 py-1 rounded text-[10px] font-medium transition-colors",
              selected
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
            )}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

function WizardSummary({ groups, selections }: { groups: QuestionGroup[]; selections: string[] }) {
  return (
    <div className="my-2 space-y-1">
      {groups.map((g, i) => (
        <div key={i} className="px-3 py-1.5 rounded bg-indigo-50/50 border border-indigo-100">
          <span className="text-[10px] text-indigo-500 block">{g.question}</span>
          <span className="text-xs font-medium text-indigo-800">{selections[i] ?? "—"}</span>
        </div>
      ))}
    </div>
  );
}

function renderInlineMarkdown(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /(\*\*(.+?)\*\*)|(`(.+?)`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    if (match[2]) {
      parts.push(
        <strong key={key++} className="font-semibold text-neutral-900">
          {match[2]}
        </strong>
      );
    } else if (match[4]) {
      parts.push(
        <code
          key={key++}
          className="px-1 py-0.5 rounded bg-neutral-200/60 text-neutral-800 font-mono text-[10px]"
        >
          {match[4]}
        </code>
      );
    }
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    parts.push(text.slice(last));
  }
  return parts;
}

export function AssistantContent({
  text,
  isStreaming,
  isActionable = true,
  onSelectOption,
  answeredSelections,
}: {
  text: string;
  isStreaming: boolean;
  isActionable?: boolean;
  onSelectOption?: (label: string) => void;
  answeredSelections?: string[];
}) {
  const segments = parseSegments(text);
  const grouped = groupQuestions(segments);

  const nodes: ReactNode[] = grouped.map((item, i) => {
    if (item.kind === "questions") {
      const { groups } = item;

      if (answeredSelections) {
        return <WizardSummary key={`wiz-${i}`} groups={groups} selections={answeredSelections} />;
      }

      if (isActionable && !isStreaming && groups.length >= 2) {
        return (
          <QuestionWizard
            key={`wiz-${i}`}
            groups={groups}
            onSubmit={onSelectOption ?? (() => {})}
          />
        );
      }

      return (
        <div key={`qg-${i}`}>
          {groups.map((g, gi) => (
            <div key={gi}>
              <QuestionBlock text={g.question} />
              {g.options.map((opt) => (
                <OptionButton
                  key={opt.label}
                  label={opt.label}
                  description={opt.description}
                  onSelect={onSelectOption ?? (() => {})}
                />
              ))}
            </div>
          ))}
        </div>
      );
    }

    const seg = item.segment;
    switch (seg.kind) {
      case "tool":
        return <ToolBlock key={i} tool={seg.tool} target={seg.target} />;
      case "result":
        return <ResultLine key={i} text={seg.text} />;
      case "question":
        return <QuestionBlock key={i} text={seg.text} />;
      case "option":
        return (
          <OptionButton
            key={i}
            label={seg.label}
            description={seg.description}
            onSelect={onSelectOption ?? (() => {})}
          />
        );
      case "plan":
        return <PlanIndicator key={i} text={seg.text} />;
      case "text":
        return (
          <span key={i} className="whitespace-pre-wrap">
            {renderInlineMarkdown(seg.text)}
          </span>
        );
    }
  });

  return (
    <>
      {nodes}
      {isStreaming && (
        <span className="inline-block w-1 h-3 ml-0.5 bg-neutral-400 animate-pulse align-text-bottom" />
      )}
    </>
  );
}

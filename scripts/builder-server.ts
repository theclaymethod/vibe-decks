import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { spawn, type ChildProcess } from "node:child_process";
import { resolve, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync, writeFileSync, readFileSync, readdirSync, statSync, unlinkSync, existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const PORT = 3333;
const WIREFRAME_DIR = resolve(PROJECT_ROOT, ".builder-tmp");
const WIREFRAME_PATH = resolve(WIREFRAME_DIR, "wireframe.png");
const ASSETS_DIR = resolve(PROJECT_ROOT, "public/assets");

function log(tag: string, ...args: unknown[]): void {
  console.log(`[${new Date().toISOString().slice(11, 19)}] [${tag}]`, ...args);
}

function setCors(res: ServerResponse): void {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString()));
    req.on("error", reject);
  });
}

function streamClaude(
  claude: ChildProcess,
  req: IncomingMessage,
  res: ServerResponse,
  tag: string,
  extractSession?: boolean
): void {
  let buffer = "";
  let sessionExtracted = false;
  let chunkCount = 0;

  log(tag, `spawned pid=${claude.pid}`);

  claude.stdout?.on("data", (chunk: Buffer) => {
    const raw = chunk.toString();
    chunkCount++;
    if (chunkCount <= 3) {
      log(tag, `stdout chunk #${chunkCount} (${raw.length} bytes): ${raw.slice(0, 200)}`);
    }

    buffer += raw;
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.trim()) continue;

      if (extractSession && !sessionExtracted) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.type === "system" && parsed.subtype === "init" && parsed.session_id) {
            sessionExtracted = true;
            log(tag, `session_id extracted: ${parsed.session_id}`);
            res.write(
              `data: ${JSON.stringify({ type: "session", sessionId: parsed.session_id })}\n\n`
            );
          }
        } catch {
          // not JSON, pass through
        }
      }

      res.write(`data: ${line}\n\n`);
    }
  });

  claude.stderr?.on("data", (chunk: Buffer) => {
    const msg = chunk.toString().trim();
    if (msg) {
      log(tag, `stderr: ${msg}`);
      res.write(`data: ${JSON.stringify({ type: "stderr", message: msg })}\n\n`);
    }
  });

  claude.on("close", (code) => {
    log(tag, `exited code=${code}, ${chunkCount} stdout chunks total`);
    res.write(`data: ${JSON.stringify({ type: "done", exitCode: code })}\n\n`);
    res.end();
  });

  claude.on("error", (err) => {
    log(tag, `error: ${err.message}`);
    res.write(`data: ${JSON.stringify({ type: "error", message: err.message })}\n\n`);
    res.end();
  });

  req.on("close", () => {
    log(tag, "client disconnected, killing process");
    claude.kill();
  });
}

const server = createServer(async (req, res) => {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/api/generate") {
    log("generate", "request received");
    try {
      const body = JSON.parse(await readBody(req));
      let prompt: string = body.prompt;
      const image: string | undefined = body.image;

      if (!prompt) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "prompt is required" }));
        return;
      }

      log("generate", `prompt: ${prompt.slice(0, 100)}...`);

      if (image && image.startsWith("data:image/png;base64,")) {
        mkdirSync(WIREFRAME_DIR, { recursive: true });
        const base64Data = image.slice("data:image/png;base64,".length);
        writeFileSync(WIREFRAME_PATH, Buffer.from(base64Data, "base64"));
        prompt = `I've saved a wireframe screenshot of the slide layout at .builder-tmp/wireframe.png — read it to see the visual arrangement of elements.\n\n${prompt}`;
      }

      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });

      const claude = spawn(
        "claude",
        ["-p", prompt, "--verbose", "--output-format", "stream-json", "--dangerously-skip-permissions"],
        { cwd: PROJECT_ROOT, stdio: ["ignore", "pipe", "pipe"] }
      );

      streamClaude(claude, req, res, "generate");
    } catch (err) {
      log("generate", `error: ${err}`);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" })
      );
    }
    return;
  }

  if (req.method === "POST" && req.url === "/api/edit") {
    log("edit", "request received");
    try {
      const body = JSON.parse(await readBody(req));
      const { prompt, filePath, sessionId } = body as {
        prompt: string;
        filePath: string;
        sessionId?: string;
      };

      if (!prompt) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "prompt is required" }));
        return;
      }

      if (!filePath) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "filePath is required" }));
        return;
      }

      log("edit", `prompt: "${prompt.slice(0, 80)}..." file=${filePath} session=${sessionId ?? "new"}`);

      const fullPrompt = sessionId
        ? prompt
        : `Edit the slide at ${filePath}.\n\n${prompt}`;

      const args = sessionId
        ? ["--resume", sessionId, "-p", fullPrompt, "--verbose", "--output-format", "stream-json", "--dangerously-skip-permissions"]
        : ["-p", fullPrompt, "--verbose", "--output-format", "stream-json", "--dangerously-skip-permissions"];

      log("edit", `claude args: ${args.join(" ")}`);

      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });

      const claude = spawn("claude", args, { cwd: PROJECT_ROOT, stdio: ["ignore", "pipe", "pipe"] });

      streamClaude(claude, req, res, "edit", true);
    } catch (err) {
      log("edit", `error: ${err}`);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" })
      );
    }
    return;
  }

  if (req.method === "POST" && req.url === "/api/edit-design-system") {
    log("edit-ds", "request received");
    try {
      const body = JSON.parse(await readBody(req));
      const { prompt, sessionId } = body as {
        prompt: string;
        sessionId?: string;
      };

      if (!prompt) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "prompt is required" }));
        return;
      }

      log("edit-ds", `prompt: "${prompt.slice(0, 80)}..." session=${sessionId ?? "new"}`);

      const fullPrompt = sessionId
        ? prompt
        : `You are editing the design system for a slide deck.\n\nDesign system files:\n- src/design-system/typography.tsx\n- src/design-system/layout.tsx\n- src/design-system/cards.tsx\n- src/design-system/decorative.tsx\n- src/design-system/index.ts\n- src/design-system/showcase.tsx\n- src/deck/theme.css\n\nAfter making changes, append a structured entry to src/design-system/CHANGELOG.md with the date and a summary of what changed.\n\n${prompt}`;

      const args = sessionId
        ? ["--resume", sessionId, "-p", fullPrompt, "--verbose", "--output-format", "stream-json", "--dangerously-skip-permissions"]
        : ["-p", fullPrompt, "--verbose", "--output-format", "stream-json", "--dangerously-skip-permissions"];

      log("edit-ds", `claude args: ${args.join(" ")}`);

      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });

      const claude = spawn("claude", args, { cwd: PROJECT_ROOT, stdio: ["ignore", "pipe", "pipe"] });

      streamClaude(claude, req, res, "edit-ds", true);
    } catch (err) {
      log("edit-ds", `error: ${err}`);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" })
      );
    }
    return;
  }

  if (req.method === "POST" && req.url === "/api/apply-design-system") {
    log("apply-ds", "request received");
    try {
      const body = JSON.parse(await readBody(req));
      const { fileKey } = body as { fileKey: string };

      if (!fileKey) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "fileKey is required" }));
        return;
      }

      log("apply-ds", `fileKey: ${fileKey}`);

      const prompt = `Read src/deck/slides/${fileKey}.tsx. Understand its semantic intent.\nRead src/design-system/ files and src/design-system/CHANGELOG.md.\nRead the recent design system changes: run \`git diff HEAD~10 -- src/design-system/ src/deck/theme.css\`\nRewrite the slide using current design system primitives from @/design-system.\nDo NOT use templates from @/templates.\nPreserve the slide's semantic content and intent.`;

      const args = ["-p", prompt, "--verbose", "--output-format", "stream-json", "--dangerously-skip-permissions"];

      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });

      const claude = spawn("claude", args, { cwd: PROJECT_ROOT, stdio: ["ignore", "pipe", "pipe"] });

      streamClaude(claude, req, res, "apply-ds");
    } catch (err) {
      log("apply-ds", `error: ${err}`);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" })
      );
    }
    return;
  }

  if (req.method === "POST" && req.url === "/api/create-design-system") {
    log("create-ds", "request received");
    try {
      const body = JSON.parse(await readBody(req));
      const { description, urls, images, imagePaths, planOnly } = body as {
        description: string;
        urls?: string[];
        images?: string[];
        imagePaths?: string[];
        planOnly?: boolean;
      };

      if (!description) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "description is required" }));
        return;
      }

      log("create-ds", `desc: "${description.slice(0, 80)}..." planOnly=${planOnly ?? false}`);

      let imageFiles: string[] = [];
      if (imagePaths && imagePaths.length > 0) {
        imageFiles = imagePaths.map((p) => resolve(PROJECT_ROOT, "public" + p));
      } else if (images && images.length > 0) {
        mkdirSync(WIREFRAME_DIR, { recursive: true });
        imageFiles = images.map((img, i) => {
          const path = resolve(WIREFRAME_DIR, `ds-ref-${i}.png`);
          const base64 = img.startsWith("data:") ? img.replace(/^data:[^;]+;base64,/, "") : img;
          writeFileSync(path, Buffer.from(base64, "base64"));
          return path;
        });
      }

      const promptParts = [
        "Use careful analysis. Show your design reasoning before generating code.",
        "",
        `Description: ${description}`,
      ];

      if (urls && urls.length > 0) {
        promptParts.push("", "Reference URLs:", ...urls.map((u) => `- ${u}`));
      }

      if (imageFiles.length > 0) {
        promptParts.push("", "Reference images saved at:", ...imageFiles.map((f) => `- ${f}`));
        promptParts.push("Read these images to analyze the visual style.");
      }

      if (planOnly) {
        promptParts.push("", "IMPORTANT: Only analyze and produce a design plan. Do NOT write any files yet. Output a structured plan with design decisions for: color palette, typography scale, component styles, and overall aesthetic.");
      } else {
        promptParts.push("", "Regenerate all design system files:", "- src/design-system/typography.tsx", "- src/design-system/layout.tsx", "- src/design-system/cards.tsx", "- src/design-system/decorative.tsx", "- src/design-system/index.ts", "- src/design-system/showcase.tsx", "- src/deck/theme.css", "", "Update src/design-system/CHANGELOG.md with a summary of the new design system.");
      }

      const args = ["-p", promptParts.join("\n"), "--verbose", "--output-format", "stream-json", "--dangerously-skip-permissions"];

      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });

      const claude = spawn("claude", args, { cwd: PROJECT_ROOT, stdio: ["ignore", "pipe", "pipe"] });

      streamClaude(claude, req, res, "create-ds", true);
    } catch (err) {
      log("create-ds", `error: ${err}`);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" })
      );
    }
    return;
  }

  if (req.method === "POST" && req.url === "/api/assets/upload") {
    log("assets", "upload request");
    try {
      const body = JSON.parse(await readBody(req));
      const { filename: rawName, data, folder } = body as { filename: string; data: string; folder?: string };

      if (!rawName || !data) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "filename and data are required" }));
        return;
      }

      const targetDir = folder ? resolve(ASSETS_DIR, folder) : ASSETS_DIR;
      const urlPrefix = folder ? `/assets/${folder}` : "/assets";

      const sanitized = rawName
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9\-_.]/g, "")
        .toLowerCase();

      const ext = extname(sanitized);
      const base = sanitized.slice(0, sanitized.length - ext.length) || "file";
      mkdirSync(targetDir, { recursive: true });

      let finalName = sanitized;
      if (existsSync(resolve(targetDir, finalName))) {
        finalName = `${base}-${Date.now()}${ext}`;
      }

      const base64 = data.replace(/^data:[^;]+;base64,/, "");
      const buffer = Buffer.from(base64, "base64");
      const filePath = resolve(targetDir, finalName);
      writeFileSync(filePath, buffer);

      log("assets", `uploaded ${folder ? folder + "/" : ""}${finalName} (${buffer.length} bytes)`);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ path: `${urlPrefix}/${finalName}`, filename: finalName, size: buffer.length }));
    } catch (err) {
      log("assets", `upload error: ${err}`);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }));
    }
    return;
  }

  if (req.method === "GET" && (req.url === "/api/assets/list" || req.url?.startsWith("/api/assets/list?"))) {
    const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
    const folder = parsedUrl.searchParams.get("folder") ?? undefined;
    const targetDir = folder ? resolve(ASSETS_DIR, folder) : ASSETS_DIR;
    const urlPrefix = folder ? `/assets/${folder}` : "/assets";

    log("assets", `list request${folder ? ` (folder=${folder})` : ""}`);
    try {
      mkdirSync(targetDir, { recursive: true });
      const files = readdirSync(targetDir).filter((f) => !f.startsWith("."));

      const MIME_MAP: Record<string, string> = {
        ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
        ".gif": "image/gif", ".webp": "image/webp", ".svg": "image/svg+xml",
        ".pdf": "application/pdf", ".mp4": "video/mp4",
      };

      const assets = files.map((f) => {
        const stat = statSync(resolve(targetDir, f));
        const ext = extname(f).toLowerCase();
        return {
          filename: f,
          path: `${urlPrefix}/${f}`,
          size: stat.size,
          mime: MIME_MAP[ext] ?? "application/octet-stream",
          modified: stat.mtimeMs,
        };
      });

      assets.sort((a, b) => b.modified - a.modified);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ assets }));
    } catch (err) {
      log("assets", `list error: ${err}`);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }));
    }
    return;
  }

  if (req.method === "DELETE" && req.url?.startsWith("/api/assets/")) {
    const rawPath = decodeURIComponent(req.url.slice("/api/assets/".length));
    const parts = rawPath.split("/");
    const folder = parts.length > 1 ? parts.slice(0, -1).join("/") : undefined;
    const filename = parts[parts.length - 1];
    const targetDir = folder ? resolve(ASSETS_DIR, folder) : ASSETS_DIR;

    log("assets", `delete request: ${rawPath}`);
    try {
      const filePath = resolve(targetDir, filename);
      if (!filePath.startsWith(ASSETS_DIR)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid filename" }));
        return;
      }
      if (!existsSync(filePath)) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "File not found" }));
        return;
      }
      unlinkSync(filePath);
      log("assets", `deleted ${rawPath}`);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
    } catch (err) {
      log("assets", `delete error: ${err}`);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }));
    }
    return;
  }

  if (req.method === "GET" && req.url === "/api/design-brief") {
    log("design-brief", "read request");
    const briefPath = resolve(PROJECT_ROOT, "src/design-system/design-brief.md");
    if (existsSync(briefPath)) {
      const content = readFileSync(briefPath, "utf-8");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ content }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ content: null }));
    }
    return;
  }

  if (req.method === "POST" && req.url === "/api/assess-design-system") {
    log("assess-ds", "request received");
    try {
      const body = JSON.parse(await readBody(req));
      const { description, imagePaths } = body as {
        description: string;
        imagePaths?: string[];
      };

      if (!description) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "description is required" }));
        return;
      }

      const promptParts = [
        "You are a design system assessor. Your job is to evaluate whether a generated design system aligns with the user's intent and inspiration references.",
        "",
        "## User's Design Intent",
        description,
        "",
        "## Your Task",
        "1. Read each inspiration image listed below (if any) to understand the visual reference",
        "2. Read all design system files:",
        "   - src/deck/theme.css",
        "   - src/design-system/typography.tsx",
        "   - src/design-system/layout.tsx",
        "   - src/design-system/cards.tsx",
        "   - src/design-system/decorative.tsx",
        "   - src/design-system/showcase.tsx",
        "3. Assess alignment between inspiration/intent and implementation",
        "4. Write src/design-system/design-brief.md with this exact structure:",
        "",
        "```",
        "# Design Brief",
        "",
        "## Intent",
        "[Wizard selections — palette, typography, personality, custom notes]",
        "",
        "## Inspiration Analysis",
        "[What you observe in the reference images — dominant colors, type style, spacing feel, mood/tone]",
        "",
        "## Assessment",
        "",
        "### Color Palette",
        "[How theme.css variables align with inspiration. Specific hex comparisons.]",
        "",
        "### Typography",
        "[Font choices vs. reference material feel]",
        "",
        "### Component Style",
        "[Cards, decorative elements — do they match the intended mood?]",
        "",
        "### Alignment",
        "[High/Medium/Low with reasoning]",
        "",
        "## Recommendations",
        "[Specific actionable suggestions to improve alignment]",
        "",
        "## References",
        "[List of inspiration image paths assessed]",
        "```",
        "",
        "Write ONLY the design-brief.md file. Do not modify any other files.",
      ];

      if (imagePaths && imagePaths.length > 0) {
        const absolutePaths = imagePaths.map((p) => resolve(PROJECT_ROOT, "public" + p));
        promptParts.push("", "## Inspiration Images", ...absolutePaths.map((f) => `- ${f}`));
        promptParts.push("Read each image above to analyze the visual style.");
      }

      log("assess-ds", `spawning background assessor, desc="${description.slice(0, 80)}..."`);

      const claude = spawn(
        "claude",
        ["-p", promptParts.join("\n"), "--output-format", "stream-json", "--dangerously-skip-permissions"],
        { cwd: PROJECT_ROOT, stdio: ["ignore", "pipe", "pipe"] }
      );

      claude.stdout?.on("data", (chunk: Buffer) => {
        log("assess-ds", chunk.toString().slice(0, 200));
      });
      claude.stderr?.on("data", (chunk: Buffer) => {
        const msg = chunk.toString().trim();
        if (msg) log("assess-ds", `stderr: ${msg}`);
      });
      claude.on("close", (code) => {
        log("assess-ds", `exited code=${code}`);
      });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
    } catch (err) {
      log("assess-ds", `error: ${err}`);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }));
    }
    return;
  }

  log("404", `${req.method} ${req.url}`);
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  log("server", `running on http://localhost:${PORT}`);
  log("server", `project root: ${PROJECT_ROOT}`);
});

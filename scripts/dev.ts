import { createServer } from "node:net";
import { spawn, type ChildProcess } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { writeFileSync, unlinkSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const PORTS_FILE = resolve(PROJECT_ROOT, ".dev-ports");

function findFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(0, () => {
      const addr = server.address();
      if (!addr || typeof addr === "string") {
        reject(new Error("Failed to get port"));
        return;
      }
      const port = addr.port;
      server.close(() => resolve(port));
    });
    server.on("error", reject);
  });
}

async function main(): Promise<void> {
  const vitePort = await findFreePort();
  const builderPort = await findFreePort();
  const env = { ...process.env, BUILDER_PORT: String(builderPort) };

  writeFileSync(PORTS_FILE, JSON.stringify({ vite: vitePort, builder: builderPort }));

  const builder = spawn("tsx", ["scripts/builder-server.ts"], {
    cwd: PROJECT_ROOT,
    env,
    stdio: "inherit",
  });

  const vite = spawn("npx", ["vite", "dev", "--port", String(vitePort)], {
    cwd: PROJECT_ROOT,
    env,
    stdio: "inherit",
  });

  const children: ChildProcess[] = [builder, vite];

  function cleanup(): void {
    for (const child of children) {
      child.kill();
    }
    try { unlinkSync(PORTS_FILE); } catch {}
  }

  process.on("SIGINT", () => {
    cleanup();
    process.exit();
  });

  process.on("SIGTERM", () => {
    cleanup();
    process.exit();
  });

  builder.on("exit", (code) => {
    if (code !== null && code !== 0) {
      console.error(`Builder server exited with code ${code}`);
      cleanup();
      process.exit(code);
    }
  });

  vite.on("exit", (code) => {
    if (code !== null && code !== 0) {
      console.error(`Vite dev server exited with code ${code}`);
      cleanup();
      process.exit(code);
    }
  });
}

main();

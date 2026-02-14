import { createServer } from "node:net";
import { spawn, type ChildProcess } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { writeFileSync, unlinkSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const BUILDER_APP = resolve(PROJECT_ROOT, "apps/builder");
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
  const deckPort = await findFreePort();
  const builderVitePort = await findFreePort();
  const builderApiPort = await findFreePort();

  const baseEnv = {
    ...process.env,
    BUILDER_PORT: String(builderApiPort),
  };

  writeFileSync(
    PORTS_FILE,
    JSON.stringify({ deck: deckPort, builder: builderVitePort, api: builderApiPort })
  );

  console.log("");
  console.log("  \x1b[1m\x1b[36mpls-fix\x1b[0m");
  console.log("");
  console.log(`  \x1b[32m➜\x1b[0m  \x1b[1mDeck:\x1b[0m    http://localhost:${deckPort}/`);
  console.log(`  \x1b[35m➜\x1b[0m  \x1b[1mBuilder:\x1b[0m http://localhost:${builderVitePort}/`);
  console.log("");

  const builderApi = spawn("tsx", ["scripts/builder-server.ts"], {
    cwd: PROJECT_ROOT,
    env: baseEnv,
    stdio: "inherit",
  });

  const deck = spawn(
    "npx",
    ["vite", "dev", "--port", String(deckPort)],
    {
      cwd: PROJECT_ROOT,
      env: {
        ...baseEnv,
        VITE_BUILDER_URL: `http://localhost:${builderVitePort}`,
      },
      stdio: "inherit",
    }
  );

  const builderVite = spawn(
    "npx",
    ["vite", "dev", "--port", String(builderVitePort)],
    {
      cwd: BUILDER_APP,
      env: baseEnv,
      stdio: "inherit",
    }
  );

  const children: ChildProcess[] = [builderApi, deck, builderVite];

  function cleanup(): void {
    for (const child of children) {
      child.kill();
    }
    try {
      unlinkSync(PORTS_FILE);
    } catch {}
  }

  process.on("SIGINT", () => {
    cleanup();
    process.exit();
  });

  process.on("SIGTERM", () => {
    cleanup();
    process.exit();
  });

  for (const child of children) {
    child.on("exit", (code) => {
      if (code !== null && code !== 0) {
        cleanup();
        process.exit(code);
      }
    });
  }
}

main();

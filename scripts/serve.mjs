#!/usr/bin/env node
// Wraps `next dev` / `next start` so a busy port never hard-crashes the
// process with EADDRINUSE. Native `next start` just throws and exits;
// `next dev` silently jumps to another port with no way to say no. Here,
// a busy port asks (interactively) before picking a replacement, and
// falls back to silently auto-picking one when there's no TTY to ask
// (CI, background launch, `run_in_background`-style invocations).
import { createServer } from "node:net";
import { createInterface } from "node:readline";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { join, dirname } from "node:path";

const require = createRequire(import.meta.url);

const mode = process.argv[2]; // "dev" | "start"
if (mode !== "dev" && mode !== "start") {
  console.error("Usage: node scripts/serve.mjs <dev|start> [next args...]");
  process.exit(1);
}
const extraArgs = process.argv.slice(3);

const requestedPort = Number(process.env.PORT) || 3000;
const MAX_ATTEMPTS = 20;

function isPortFree(port) {
  return new Promise((resolve) => {
    const tester = createServer();
    tester.unref();
    tester.on("error", () => resolve(false));
    // No explicit host: Node's default bind is the dual-stack "::"
    // wildcard, which is what actually conflicts with another process's
    // listener. On Windows, binding the explicit "0.0.0.0" IPv4-only
    // wildcard instead succeeds independently of an existing dual-stack
    // "::" bind on the same port — a false "free" reading that let a busy
    // port slip through and hit the exact EADDRINUSE this script exists
    // to prevent.
    tester.listen(port, () => {
      tester.close(() => resolve(true));
    });
  });
}

async function findNextFreePort(startPort) {
  for (let port = startPort + 1; port < startPort + MAX_ATTEMPTS; port++) {
    if (await isPortFree(port)) return port;
  }
  throw new Error(`No free port found in range ${startPort + 1}-${startPort + MAX_ATTEMPTS}`);
}

function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (answer) => {
    rl.close();
    resolve(answer.trim());
  }));
}

async function resolvePort() {
  if (await isPortFree(requestedPort)) return requestedPort;

  const fallback = await findNextFreePort(requestedPort);

  if (!process.stdin.isTTY) {
    // No one to ask (background/CI launch) — auto-fallback rather than crash.
    console.log(
      `[serve] Port ${requestedPort} is in use — no interactive terminal to ask, starting on ${fallback} instead.`
    );
    return fallback;
  }

  const answer = await ask(
    `Port ${requestedPort} is already in use. Start on port ${fallback} instead? [Y/n] `
  );
  if (answer.toLowerCase() === "n" || answer.toLowerCase() === "no") {
    console.log("[serve] Aborted — free the port and try again, or set PORT to choose one.");
    process.exit(1);
  }
  return fallback;
}

const port = await resolvePort();
if (port !== requestedPort) {
  console.log(`[serve] Starting Next.js (${mode}) on port ${port}.`);
}

// Resolve the next binary directly rather than going through a shell —
// shell:true on Windows only concatenates argv into a string it re-parses,
// which mangles arguments containing spaces/quotes and triggers Node's
// DEP0190 warning on every run.
const nextPkgEntry = require.resolve("next/package.json");
const nextBin = join(dirname(nextPkgEntry), "dist", "bin", "next");

const child = spawn(
  process.execPath,
  [nextBin, mode, "-p", String(port), ...extraArgs],
  { stdio: "inherit" }
);

child.on("exit", (code) => process.exit(code ?? 0));

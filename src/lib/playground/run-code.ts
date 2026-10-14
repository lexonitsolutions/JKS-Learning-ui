import { ApiError } from "@/lib/api/base-url";
import { runCode, type TestRow } from "@/lib/data/code-api";
import type { RunView, TestView } from "@/components/playground/output-panel";
import { describeRuntime, type PlaygroundFile, type PlaygroundLanguageId } from "./languages";
import { runAbapIsolated, runJavaScriptIsolated } from "./isolated-run";

/** Output comparison ignores CRLF vs LF and trailing whitespace (mirrors the server). */
export function normalizeOutput(s: string): string {
  return (s ?? "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.replace(/\s+$/, ""))
    .join("\n")
    .trim();
}

/** Picks the file that is executed: the one with a main entry point, else the open file. */
export function pickEntryFile(language: PlaygroundLanguageId, files: PlaygroundFile[], activeName: string): PlaygroundFile {
  const real = files.filter((f) => f.name !== "PROBLEM.md");
  const active = real.find((f) => f.name === activeName);
  if (language === "java" || language === "csharp" || language === "cpp") {
    const withMain = real.find((f) => /static\s+void\s+Main\s*\(|static\s+void\s+main\s*\(|int\s+main\s*\(/i.test(f.content));
    if (withMain) return withMain;
  }
  return active ?? real[0];
}

/** Runs one program with the engine that really supports the language. */
export async function runProgram(opts: {
  language: Exclude<PlaygroundLanguageId, "web">;
  code: string;
  stdin: string;
  serverLanguages: Set<string>;
}): Promise<RunView> {
  const { language, code, stdin, serverLanguages } = opts;
  const rt = describeRuntime(language, serverLanguages);

  if (language === "javascript") {
    const r = await runJavaScriptIsolated(code);
    return { status: r.status, stdout: r.stdout, stderr: r.stderr, timeMs: r.timeMs, where: rt.where };
  }
  if (language === "abap") {
    const r = await runAbapIsolated(code);
    return { status: r.status, stdout: r.stdout, stderr: r.stderr, timeMs: r.timeMs, where: rt.where };
  }

  if (!rt.available) {
    return { status: "unavailable", stdout: "", stderr: "", message: rt.note, where: rt.where };
  }
  try {
    const r = await runCode(language, code, stdin);
    return {
      status: r.status === "unavailable" ? "unavailable" : r.status,
      stdout: r.stdout,
      stderr: r.stderr,
      timeMs: r.timeMs,
      message: r.message,
      where: rt.where,
    };
  } catch (err) {
    const message = err instanceof ApiError || err instanceof Error ? err.message : "The execution service failed.";
    return { status: "unavailable", stdout: "", stderr: "", message, where: rt.where };
  }
}

/**
 * Ungraded in-browser check for ABAP examples. ABAP has no stdin here, so a
 * test can only be checked when it needs no input.
 */
export async function runLocalAbapChecks(
  code: string,
  tests: { input: string; expectedOutput: string }[],
): Promise<TestView> {
  const run = await runAbapIsolated(code);
  const rows: TestRow[] = tests.map((t, index) => {
    if (t.input.trim() !== "") {
      return {
        index,
        hidden: false,
        passed: false,
        input: t.input,
        expectedOutput: t.expectedOutput,
        error: "This test needs input, which ABAP in the browser does not support.",
      };
    }
    const ok = run.status === "ok" && normalizeOutput(run.stdout) === normalizeOutput(t.expectedOutput);
    return {
      index,
      hidden: false,
      passed: ok,
      input: t.input,
      expectedOutput: t.expectedOutput,
      actualOutput: run.status === "ok" ? run.stdout : run.stderr,
    };
  });
  return {
    heading: "ABAP example check",
    kind: "local",
    graded: true,
    passed: rows.filter((r) => r.passed).length,
    total: rows.length,
    rows,
  };
}

/* ── Web preview ─────────────────────────────────────────────────────── */

const escScript = (s: string) => s.replace(/<\/script/gi, "<\\/script");

/** Inlines the project's CSS/JS into its HTML for the sandboxed preview frame. */
export function buildPreviewDoc(files: PlaygroundFile[]): string {
  const real = files.filter((f) => f.name !== "PROBLEM.md");
  const html = real.find((f) => /^index\.html?$/i.test(f.name)) ?? real.find((f) => /\.html?$/i.test(f.name));
  if (!html) return "<p style='font-family:sans-serif'>Add an index.html file to see a preview.</p>";
  const byName = new Map(real.map((f) => [f.name.toLowerCase(), f.content]));

  const doc = html.content
    .replace(/<link\b[^>]*href=["']([^"']+)["'][^>]*>/gi, (tag, href: string) => {
      const css = byName.get(href.replace(/^\.\//, "").toLowerCase());
      return css !== undefined && /stylesheet/i.test(tag) ? `<style>\n${css}\n</style>` : tag;
    })
    .replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*>\s*<\/script>/gi, (tag, src: string) => {
      const js = byName.get(src.replace(/^\.\//, "").toLowerCase());
      return js !== undefined ? `<script>\n${escScript(js)}\n</script>` : tag;
    });

  const capture = `<script>
(function(){
  var send=function(level,args){try{parent.postMessage({__jksPreview:true,level:level,text:Array.prototype.map.call(args,function(a){try{return typeof a==='object'?JSON.stringify(a):String(a)}catch(e){return String(a)}}).join(' ')},'*')}catch(e){}};
  ['log','info','warn','error'].forEach(function(l){var o=console[l];console[l]=function(){send(l,arguments);o.apply(console,arguments)}});
  window.addEventListener('error',function(e){send('error',[e.message])});
})();
</script>`;
  return /<head[^>]*>/i.test(doc) ? doc.replace(/<head[^>]*>/i, (m) => `${m}${capture}`) : `${capture}${doc}`;
}

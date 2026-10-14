"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Group,
  Panel,
  Separator,
  useDefaultLayout,
  usePanelRef,
} from "react-resizable-panels";
import {
  AlertTriangle,
  CheckCircle2,
  CloudOff,
  Loader2,
  PanelBottom,
  PanelLeft,
  PanelRight,
  Play,
  RotateCcw,
  Send,
  TestTube2,
  X,
} from "lucide-react";
import {
  fetchCodeConfig,
  fetchCodeContext,
  fetchWorkspace,
  refFromSearch,
  runVisibleTests,
  saveWorkspace,
  submitCode,
  workspaceKey,
  type CodeConfig,
  type CodeContext,
} from "@/lib/data/code-api";
import {
  PLAYGROUND_LANGUAGES,
  describeRuntime,
  getLanguage,
  type PlaygroundFile,
  type PlaygroundLanguageId,
} from "@/lib/playground/languages";
import { buildPreviewDoc, pickEntryFile, runLocalAbapChecks, runProgram } from "@/lib/playground/run-code";
import { CodeEditor } from "./code-editor";
import { FileExplorer, MAX_FILES, type ExplorerFile } from "./file-explorer";
import { OutputPanel, type OutputTab, type RunView, type TestView } from "./output-panel";
import { ProblemPanel } from "./problem-panel";
import { useMediaQuery } from "./use-media-query";

const PROBLEM_FILE = "PROBLEM.md";
const SAVE_DELAY_MS = 1200;

const EXT_TO_MONACO: Record<string, string> = {
  html: "html",
  htm: "html",
  css: "css",
  js: "javascript",
  mjs: "javascript",
  ts: "typescript",
  py: "python",
  java: "java",
  cpp: "cpp",
  cc: "cpp",
  c: "c",
  cs: "csharp",
  sql: "sql",
  abap: "abap",
  md: "markdown",
  json: "json",
  txt: "plaintext",
};

const monacoFor = (name: string, fallback: string) => EXT_TO_MONACO[name.split(".").pop()?.toLowerCase() ?? ""] ?? fallback;

const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong. Please try again.");

/** The saved workspace stores "html" for the web project; the UI calls it "web". */
const toUiLanguage = (l: string): PlaygroundLanguageId => (l === "html" ? "web" : (l as PlaygroundLanguageId));
const toStoredLanguage = (l: PlaygroundLanguageId) => (l === "web" ? "html" : l);

type MobileView = "files" | "editor" | "output" | "problem";

export function PlaygroundShell() {
  const search = useSearchParams();
  const ref = useMemo(() => refFromSearch(new URLSearchParams(search.toString())), [search]);
  const contextKey = ref ? workspaceKey(ref) : "playground";
  const taskMode = ref !== null;

  const isDesktop = useMediaQuery("(min-width: 768px)");

  /* ── Loaded data ─────────────────────────────────────────────────── */
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [config, setConfig] = useState<CodeConfig | null>(null);
  const [ctx, setCtx] = useState<CodeContext | null>(null);

  /* ── Workspace ───────────────────────────────────────────────────── */
  const [lang, setLang] = useState<PlaygroundLanguageId>("javascript");
  const [files, setFiles] = useState<PlaygroundFile[]>(getLanguage("javascript").template);
  const [activeName, setActiveName] = useState<string>(getLanguage("javascript").template[0].name);
  const [openTabs, setOpenTabs] = useState<string[]>([getLanguage("javascript").template[0].name]);
  const [primaryName, setPrimaryName] = useState<string>(getLanguage("javascript").template[0].name);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const ready = useRef(false);

  /* ── Output ──────────────────────────────────────────────────────── */
  const [run, setRun] = useState<RunView | null>(null);
  const [tests, setTests] = useState<TestView | null>(null);
  const [stdin, setStdin] = useState("");
  const [outTab, setOutTab] = useState<OutputTab>("output");
  const [previewDoc, setPreviewDoc] = useState("");
  const [previewKey, setPreviewKey] = useState(0);
  const [busy, setBusy] = useState<null | "run" | "tests" | "submit">(null);
  const [banner, setBanner] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  /* ── Layout ──────────────────────────────────────────────────────── */
  const [mobileView, setMobileView] = useState<MobileView>("editor");
  const explorerRef = usePanelRef();
  const outputRef = usePanelRef();
  const problemRef = usePanelRef();
  const panelIds = taskMode ? ["explorer", "center", "problem"] : ["explorer", "center"];
  const mainLayout = useDefaultLayout({ id: taskMode ? "jks-pg-main-task" : "jks-pg-main", panelIds });
  const centerLayout = useDefaultLayout({ id: "jks-pg-center", panelIds: ["editor", "output"] });

  const serverLanguages = useMemo(
    () => new Set((config?.languages ?? []).filter((l) => l.runtime === "server").map((l) => l.id as string)),
    [config],
  );

  /* ── Initial load / restore ──────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    ready.current = false;
    setLoading(true);
    setLoadError(null);
    setRun(null);
    setTests(null);
    setBanner(null);

    (async () => {
      try {
        const [cfg, context] = await Promise.all([
          fetchCodeConfig().catch(() => null),
          ref ? fetchCodeContext(ref) : Promise.resolve(null),
        ]);
        if (cancelled) return;
        setConfig(cfg);
        setCtx(context);

        const ws = await fetchWorkspace(contextKey).catch(() => null);
        if (cancelled) return;

        if (context) {
          const q = context.question;
          const uiLang = q.language as PlaygroundLanguageId;
          const primary = getLanguage(uiLang).template[0].name;
          const restored =
            ws && toUiLanguage(ws.language) === uiLang
              ? ws.files.filter((f) => f.name !== PROBLEM_FILE)
              : null;
          const nextFiles =
            restored && restored.some((f) => f.name === primary)
              ? restored
              : [{ name: primary, content: q.starterCode }];
          setLang(uiLang);
          setFiles(nextFiles);
          setPrimaryName(primary);
          setActiveName(primary);
          setOpenTabs([PROBLEM_FILE, primary]);
        } else {
          const uiLang = ws ? toUiLanguage(ws.language) : "javascript";
          const tpl = getLanguage(uiLang).template;
          const nextFiles = ws && ws.files.length > 0 ? ws.files : tpl;
          setLang(uiLang);
          setFiles(nextFiles);
          const active = ws?.activeFile && nextFiles.some((f) => f.name === ws.activeFile) ? ws.activeFile : nextFiles[0].name;
          setActiveName(active);
          setOpenTabs([active]);
          setPrimaryName(nextFiles[0].name);
        }
      } catch (err) {
        if (!cancelled) setLoadError(errMsg(err));
      } finally {
        if (!cancelled) {
          setLoading(false);
          // Let the first render settle before changes count as edits.
          setTimeout(() => {
            ready.current = true;
          }, 0);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextKey]);

  /* ── Autosave (debounced) ────────────────────────────────────────── */
  useEffect(() => {
    if (!ready.current || loading) return;
    setSaveState("saving");
    const t = setTimeout(async () => {
      try {
        await saveWorkspace(contextKey, {
          language: toStoredLanguage(lang),
          files: files.filter((f) => f.name !== PROBLEM_FILE),
          activeFile: activeName === PROBLEM_FILE ? undefined : activeName,
        });
        setSaveState("saved");
      } catch {
        setSaveState("error");
      }
    }, SAVE_DELAY_MS);
    return () => clearTimeout(t);
  }, [files, activeName, lang, contextKey, loading]);

  /* ── Web preview console ─────────────────────────────────────────── */
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!e.data || e.data.__jksPreview !== true) return;
      const line = `${e.data.level === "error" || e.data.level === "warn" ? `[${e.data.level}] ` : ""}${String(e.data.text)}\n`;
      setRun((prev) => ({
        status: "ok",
        stdout: `${prev?.stdout ?? ""}${line}`,
        stderr: prev?.stderr ?? "",
        where: "Browser preview (sandboxed)",
      }));
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  /* ── Derived ─────────────────────────────────────────────────────── */
  const problemText = useMemo(() => {
    if (!ctx) return "";
    const q = ctx.question;
    return [
      `# ${ctx.task?.title ?? ctx.course?.title ?? "Problem"}`,
      "",
      q.prompt,
      q.instructions ? `\n## What to complete\n${q.instructions}` : "",
      q.visibleTests.length
        ? `\n## Example tests\n${q.visibleTests.map((t, i) => `${i + 1}. input: ${t.input || "(none)"}\n   expected: ${t.expectedOutput}`).join("\n")}`
        : "",
    ].join("\n");
  }, [ctx]);

  const allFiles: PlaygroundFile[] = useMemo(
    () => (taskMode ? [{ name: PROBLEM_FILE, content: problemText }, ...files] : files),
    [taskMode, problemText, files],
  );
  const explorerFiles: ExplorerFile[] = allFiles.map((f) => ({
    name: f.name,
    locked: f.name === PROBLEM_FILE,
    protectedFile: taskMode && f.name === primaryName,
  }));

  const activeFile = allFiles.find((f) => f.name === activeName) ?? allFiles[0];
  const langInfo = getLanguage(lang);
  const runtime = describeRuntime(lang, serverLanguages);
  const isWeb = lang === "web";
  const canSubmit = taskMode && !!ctx?.canSubmit;
  const primaryFile = files.find((f) => f.name === primaryName) ?? files[0];
  const canRunTests = taskMode && !!ctx && ctx.question.visibleTests.length > 0;

  /* ── File operations ─────────────────────────────────────────────── */
  const openFile = useCallback((name: string) => {
    setActiveName(name);
    setOpenTabs((t) => (t.includes(name) ? t : [...t, name]));
    setMobileView("editor");
  }, []);

  const createFile = (name: string) => {
    if (files.length >= MAX_FILES) return;
    setFiles((f) => [...f, { name, content: "" }]);
    openFile(name);
  };

  const renameFile = (from: string, to: string) => {
    setFiles((f) => f.map((x) => (x.name === from ? { ...x, name: to } : x)));
    setOpenTabs((t) => t.map((n) => (n === from ? to : n)));
    setActiveName((a) => (a === from ? to : a));
  };

  const deleteFile = (name: string) => {
    if (files.length <= 1) return;
    setFiles((f) => f.filter((x) => x.name !== name));
    closeTab(name);
  };

  const closeTab = (name: string) => {
    setOpenTabs((tabs) => {
      const next = tabs.filter((n) => n !== name);
      if (name === activeName) {
        const idx = tabs.indexOf(name);
        setActiveName(next[Math.max(0, idx - 1)] ?? files.find((f) => f.name !== name)?.name ?? PROBLEM_FILE);
      }
      return next;
    });
  };

  const editActive = (value: string) => {
    if (activeName === PROBLEM_FILE) return;
    setFiles((f) => f.map((x) => (x.name === activeName ? { ...x, content: value } : x)));
  };

  const changeLanguage = (next: PlaygroundLanguageId) => {
    if (next === lang || taskMode) return;
    const dirty = JSON.stringify(files) !== JSON.stringify(getLanguage(lang).template);
    if (dirty && !window.confirm("Switching language replaces the files in this workspace. Continue?")) return;
    const tpl = getLanguage(next).template;
    setLang(next);
    setFiles(tpl);
    setActiveName(tpl[0].name);
    setOpenTabs([tpl[0].name]);
    setPrimaryName(tpl[0].name);
    setRun(null);
    setTests(null);
    setOutTab(next === "web" ? "preview" : "output");
    if (next === "web") {
      setPreviewDoc(buildPreviewDoc(tpl));
      setPreviewKey((k) => k + 1);
    }
  };

  const resetStarter = () => {
    if (!ctx) return;
    if (!window.confirm("Reset your code to the original starter code? Your current changes will be lost.")) return;
    setFiles([{ name: primaryName, content: ctx.question.starterCode }]);
    setActiveName(primaryName);
    setOpenTabs([PROBLEM_FILE, primaryName]);
  };

  /* ── Actions ─────────────────────────────────────────────────────── */
  const ensureOutputVisible = () => {
    if (isDesktop && outputRef.current?.isCollapsed()) outputRef.current.expand();
    if (!isDesktop) setMobileView("output");
  };

  const handleRun = useCallback(async () => {
    if (busy) return;
    setBanner(null);
    ensureOutputVisible();

    if (isWeb) {
      setRun(null);
      setPreviewDoc(buildPreviewDoc(files));
      setPreviewKey((k) => k + 1);
      setOutTab("preview");
      return;
    }
    const entry = pickEntryFile(lang, allFiles, activeName);
    if (!entry) return;
    setBusy("run");
    setOutTab("output");
    setRun({ status: "running", stdout: "", stderr: "" });
    try {
      setRun(await runProgram({ language: lang as Exclude<PlaygroundLanguageId, "web">, code: entry.content, stdin, serverLanguages }));
    } finally {
      setBusy(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busy, isWeb, files, allFiles, activeName, lang, stdin, serverLanguages, isDesktop]);

  const handleRunTests = async () => {
    if (!ref || !ctx || busy || !primaryFile) return;
    setBanner(null);
    ensureOutputVisible();
    setBusy("tests");
    setOutTab("tests");
    try {
      if (lang === "abap") {
        setTests(await runLocalAbapChecks(primaryFile.content, ctx.question.visibleTests));
      } else {
        const suite = await runVisibleTests(ref, primaryFile.content);
        setTests({
          heading: "Example tests",
          kind: "official",
          graded: suite.graded,
          passed: suite.passed,
          total: suite.total,
          rows: suite.results,
          note: suite.graded ? undefined : suite.reason,
        });
      }
    } catch (err) {
      setBanner({ kind: "error", text: errMsg(err) });
    } finally {
      setBusy(null);
    }
  };

  const handleSubmit = async () => {
    if (!ref || !ctx || busy || !primaryFile) return;
    const warning = ctx.question.hasHiddenTests
      ? "Submit this solution? It will also be checked against hidden tests."
      : "Submit this solution?";
    if (!window.confirm(`${warning}\n\nOnly the file "${primaryFile.name}" is submitted.`)) return;
    setBanner(null);
    setBusy("submit");
    try {
      const res = await submitCode(ref, primaryFile.content, lang);
      ensureOutputVisible();
      setOutTab("tests");
      setTests({
        heading: `Submission #${res.attempt}`,
        kind: "submission",
        graded: res.graded,
        passed: res.passed ?? 0,
        total: res.total ?? 0,
        rows: res.results,
        note: res.graded ? undefined : res.message,
      });
      setBanner({ kind: "ok", text: res.message });
      setCtx(await fetchCodeContext(ref).catch(() => ctx));
    } catch (err) {
      setBanner({ kind: "error", text: errMsg(err) });
    } finally {
      setBusy(null);
    }
  };

  /* ── Render pieces ───────────────────────────────────────────────── */
  const tabsBar = (
    <div role="tablist" aria-label="Open files" className="flex h-9 shrink-0 items-end overflow-x-auto border-b border-[#d4d4d4] bg-[#ececec]">
      {openTabs
        .filter((n) => allFiles.some((f) => f.name === n))
        .map((n) => {
          const active = n === activeName;
          return (
            <div
              key={n}
              className={`group flex h-9 shrink-0 items-center gap-1 border-r border-[#d4d4d4] px-3 text-[13px] ${
                active ? "border-t-2 border-t-[#3b7ddd] bg-white text-[#1f1f1f]" : "bg-[#ececec] text-[#616161] hover:bg-[#e4e4e4]"
              }`}
            >
              <button type="button" role="tab" aria-selected={active} onClick={() => setActiveName(n)} className="max-w-[160px] truncate">
                {n}
              </button>
              {n !== PROBLEM_FILE && (
                <button
                  type="button"
                  aria-label={`Close ${n}`}
                  onClick={() => closeTab(n)}
                  className="rounded p-0.5 text-[#8a8a8a] opacity-60 hover:bg-[#d6d6d6] hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          );
        })}
    </div>
  );

  const editorArea = (
    <div className="flex h-full min-h-0 flex-col bg-white">
      {tabsBar}
      <div className="min-h-0 flex-1">
        {activeFile && (
          <CodeEditor
            path={`${contextKey}/${activeFile.name}`}
            language={activeFile.name === PROBLEM_FILE ? "markdown" : monacoFor(activeFile.name, langInfo.monaco)}
            value={activeFile.content}
            readOnly={activeFile.name === PROBLEM_FILE}
            onChange={editActive}
            onRun={handleRun}
          />
        )}
      </div>
    </div>
  );

  const explorerPane = (
    <FileExplorer
      files={explorerFiles}
      activeName={activeName}
      onOpen={openFile}
      onCreate={createFile}
      onRename={renameFile}
      onDelete={deleteFile}
      fileCount={files.length}
    />
  );

  const outputPane = (
    <OutputPanel
      tab={outTab}
      onTab={setOutTab}
      run={run}
      tests={tests}
      stdin={stdin}
      onStdin={setStdin}
      showPreview={isWeb}
      previewDoc={previewDoc}
      previewKey={previewKey}
      hasTests={canRunTests || tests !== null}
      onClear={() => {
        setRun(null);
        setTests(null);
      }}
    />
  );

  const problemPane = ctx ? <ProblemPanel ctx={ctx} runtimeNote={runtime.note} /> : null;

  /* ── Early states ────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center gap-2 text-sm text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading your workspace…
      </div>
    );
  }
  if (loadError) {
    return (
      <div role="alert" className="mx-auto mt-10 max-w-lg rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">
        <p className="font-bold">Could not open this coding task</p>
        <p className="mt-1">{loadError}</p>
      </div>
    );
  }

  const sep = "w-px bg-[#d4d4d4] transition-colors hover:bg-[#3b7ddd] data-[separator=active]:bg-[#3b7ddd]";
  const hsep = "h-px bg-[#d4d4d4] transition-colors hover:bg-[#3b7ddd] data-[separator=active]:bg-[#3b7ddd]";

  const togglePanel = (panel: { isCollapsed: () => boolean; expand: () => void; collapse: () => void } | null) => {
    if (!panel) return;
    if (panel.isCollapsed()) panel.expand();
    else panel.collapse();
  };
  const iconBtn = "rounded p-1.5 text-[#616161] hover:bg-[#e2e2e2] focus-visible:outline-2 focus-visible:outline-[#3b7ddd]";
  const primaryBtn =
    "inline-flex items-center gap-1.5 rounded bg-[#2563EB] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1d4fd0] disabled:opacity-50";
  const ghostBtn =
    "inline-flex items-center gap-1.5 rounded border border-[#c8c8c8] bg-white px-3 py-1.5 text-xs font-semibold text-[#2b2b2b] hover:bg-[#f0f0f0] disabled:opacity-50";

  return (
    <div className="flex h-[calc(100vh-7.5rem)] min-h-[520px] flex-col overflow-hidden rounded-xl border border-[#d4d4d4] bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-[#d4d4d4] bg-[#f3f3f3] px-2 py-1.5">
        {isDesktop && (
          <div className="flex items-center gap-0.5">
            <button type="button" className={iconBtn} aria-label="Toggle explorer" title="Toggle explorer" onClick={() => togglePanel(explorerRef.current)}>
              <PanelLeft className="h-4 w-4" />
            </button>
            <button type="button" className={iconBtn} aria-label="Toggle output panel" title="Toggle output" onClick={() => togglePanel(outputRef.current)}>
              <PanelBottom className="h-4 w-4" />
            </button>
            {taskMode && (
              <button type="button" className={iconBtn} aria-label="Toggle problem panel" title="Toggle problem" onClick={() => togglePanel(problemRef.current)}>
                <PanelRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        <label className="sr-only" htmlFor="pg-lang">
          Language
        </label>
        <select
          id="pg-lang"
          value={lang}
          disabled={taskMode}
          onChange={(e) => changeLanguage(e.target.value as PlaygroundLanguageId)}
          title={taskMode ? "The language is set by the question" : "Language"}
          className="rounded border border-[#c8c8c8] bg-white px-2 py-1.5 text-xs font-semibold text-[#1f1f1f] outline-none disabled:opacity-70"
        >
          {PLAYGROUND_LANGUAGES.filter((l) => !taskMode || l.id === lang).map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>

        <button type="button" onClick={handleRun} disabled={busy !== null || (!runtime.available && !isWeb)} className={primaryBtn} title="Run (Ctrl+Enter)">
          {busy === "run" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
          Run
        </button>

        {taskMode && (
          <>
            {canRunTests && (
              <button type="button" onClick={handleRunTests} disabled={busy !== null} className={ghostBtn}>
                {busy === "tests" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <TestTube2 className="h-3.5 w-3.5" />}
                Run tests
              </button>
            )}
            <button type="button" onClick={resetStarter} disabled={busy !== null || !canSubmit} className={ghostBtn} title="Reset to starter code">
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={busy !== null || !canSubmit}
              title={canSubmit ? "Submit your solution" : "This assessment has already been handed in"}
              className="inline-flex items-center gap-1.5 rounded bg-[#16825d] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#126b4d] disabled:opacity-50"
            >
              {busy === "submit" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              Submit
            </button>
          </>
        )}

        <span className="ml-auto flex items-center gap-1.5 text-[11px] text-[#6a6a6a]" role="status">
          {saveState === "saving" && (
            <>
              <Loader2 className="h-3 w-3 animate-spin" /> Saving…
            </>
          )}
          {saveState === "saved" && (
            <>
              <CheckCircle2 className="h-3 w-3 text-[#16825d]" /> Saved
            </>
          )}
          {saveState === "error" && (
            <>
              <CloudOff className="h-3 w-3 text-[#c42b1c]" /> Not saved
            </>
          )}
        </span>
      </div>

      {/* Honest runtime status */}
      {(!runtime.available || runtime.note) && (
        <div className="flex shrink-0 items-start gap-2 border-b border-[#f0d9a8] bg-[#fff8e6] px-3 py-1.5 text-[12px] text-[#6a4a00]">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            <strong>{runtime.where}.</strong> {runtime.note}
          </span>
        </div>
      )}
      {banner && (
        <div
          role="status"
          className={`shrink-0 border-b px-3 py-1.5 text-[12px] font-semibold ${
            banner.kind === "ok" ? "border-[#bfe3d1] bg-[#eefaf4] text-[#16825d]" : "border-[#f1c0bb] bg-[#fdf1f0] text-[#c42b1c]"
          }`}
        >
          {banner.text}
        </div>
      )}

      {/* Body */}
      <div className="min-h-0 flex-1">
        {isDesktop ? (
          <Group
            orientation="horizontal"
            id={taskMode ? "jks-pg-main-task" : "jks-pg-main"}
            defaultLayout={mainLayout.defaultLayout}
            onLayoutChanged={mainLayout.onLayoutChanged}
          >
            <Panel id="explorer" panelRef={explorerRef} defaultSize="18%" minSize="12%" maxSize="35%" collapsible collapsedSize="0%">
              {explorerPane}
            </Panel>
            <Separator className={sep} />
            <Panel id="center" minSize="30%">
              <Group orientation="vertical" id="jks-pg-center" defaultLayout={centerLayout.defaultLayout} onLayoutChanged={centerLayout.onLayoutChanged}>
                <Panel id="editor" minSize="25%">
                  {editorArea}
                </Panel>
                <Separator className={hsep} />
                <Panel id="output" panelRef={outputRef} defaultSize="32%" minSize="10%" collapsible collapsedSize="0%">
                  {outputPane}
                </Panel>
              </Group>
            </Panel>
            {taskMode && problemPane && (
              <>
                <Separator className={sep} />
                <Panel id="problem" panelRef={problemRef} defaultSize="26%" minSize="16%" maxSize="45%" collapsible collapsedSize="0%">
                  {problemPane}
                </Panel>
              </>
            )}
          </Group>
        ) : (
          <div className="flex h-full flex-col">
            <div role="tablist" aria-label="Playground view" className="flex shrink-0 border-b border-[#d4d4d4] bg-[#f3f3f3]">
              {(
                [
                  ["files", "Files"],
                  ["editor", "Editor"],
                  ["output", "Output"],
                  ...(taskMode ? ([["problem", "Problem"]] as const) : []),
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={mobileView === id}
                  onClick={() => setMobileView(id)}
                  className={`flex-1 border-b-2 py-2 text-xs font-semibold ${
                    mobileView === id ? "border-[#3b7ddd] text-[#1f1f1f]" : "border-transparent text-[#616161]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="min-h-0 flex-1">
              {mobileView === "files" && explorerPane}
              {mobileView === "editor" && editorArea}
              {mobileView === "output" && outputPane}
              {mobileView === "problem" && problemPane}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

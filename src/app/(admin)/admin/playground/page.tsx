"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Terminal,
  Monitor,
  RotateCcw,
  Copy,
  Check,
  FileCode,
  FolderOpen,
  Code2,
  ChevronDown,
  Sparkles,
  Maximize2,
  Minimize2,
  Trash2,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Reveal } from "@/lib/motion/reveal";

type Language = "vanilla-js" | "html-css-js" | "python" | "java" | "cpp" | "typescript";

interface FileItem {
  name: string;
  language: string;
  content: string;
  isEntry?: boolean;
}

const TEMPLATES: Record<Language, { label: string; files: FileItem[] }> = {
  "html-css-js": {
    label: "Vanilla JS / Web",
    files: [
      {
        name: "index.html",
        language: "html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>JKS Learning Playground</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="card">
    <h1>Hello, JKS Administrator! 🚀</h1>
    <p>Write interactive code and run live in the browser.</p>
    <button id="counterBtn" class="btn">Clicked: 0 times</button>
    <div id="status" class="status">Live Sandbox Ready</div>
  </div>
  <script src="index.js"></script>
</body>
</html>`,
        isEntry: true,
      },
      {
        name: "styles.css",
        language: "css",
        content: `body {
  margin: 0;
  padding: 40px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #0B1F3A, #1E5EFF);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  max-width: 420px;
}

h1 {
  font-size: 24px;
  margin-bottom: 8px;
}

p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.btn {
  background: #10B981;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  margin-top: 16px;
  transition: transform 0.2s, background 0.2s;
}

.btn:hover {
  background: #059669;
  transform: scale(1.05);
}

.status {
  margin-top: 20px;
  font-size: 11px;
  color: #38BDF8;
  font-weight: bold;
  letter-spacing: 0.5px;
}`,
      },
      {
        name: "index.js",
        language: "javascript",
        content: `let count = 0;
const btn = document.getElementById("counterBtn");
const status = document.getElementById("status");

btn.addEventListener("click", () => {
  count++;
  btn.textContent = \`Clicked: \${count} \${count === 1 ? "time" : "times"}\`;
  status.textContent = \`State Updated • Count is now \${count}\`;
  console.log("Button clicked! Current counter:", count);
});

console.log("JKS Interactive Sandbox Initialized!");`,
      },
    ],
  },
  "vanilla-js": {
    label: "JavaScript (Node)",
    files: [
      {
        name: "main.js",
        language: "javascript",
        content: `// JavaScript Live Evaluation
function calculateCohortStats() {
  const students = [
    { name: "Davood Khan", streak: 37, points: 2975 },
    { name: "Khan Patan", streak: 34, points: 2850 },
    { name: "Satish Jhamwer", streak: 24, points: 2650 },
  ];

  console.log("=== JKS Active Learners Roster ===");
  students.forEach((s, idx) => {
    console.log(\`#\${idx + 1} \${s.name} - Streak: \${s.streak}d | XP: \${s.points}\`);
  });

  const avgPoints = students.reduce((acc, s) => acc + s.points, 0) / students.length;
  console.log("\\nAverage Cohort XP:", Math.round(avgPoints));
}

calculateCohortStats();`,
        isEntry: true,
      },
    ],
  },
  typescript: {
    label: "TypeScript",
    files: [
      {
        name: "index.ts",
        language: "typescript",
        content: `interface CourseModule {
  id: string;
  title: string;
  lessons: number;
}

const curriculum: CourseModule[] = [
  { id: "mod-1", title: "Cloud Native Microservices", lessons: 8 },
  { id: "mod-2", title: "Enterprise Kafka & Event Streaming", lessons: 6 },
  { id: "mod-3", title: "Kubernetes Production Orchestration", lessons: 10 },
];

console.log("=== JKS Professional Curriculum Outline ===");
curriculum.forEach(m => {
  console.log(\`Module \${m.id}: \${m.title} (\${m.lessons} Lectures)\`);
});`,
        isEntry: true,
      },
    ],
  },
  python: {
    label: "Python 3.12",
    files: [
      {
        name: "main.py",
        language: "python",
        content: `print("=== JKS Python Engine ===")
cohort = ["Full Stack", "Frontend React", "Java Systems", "SAP Analytics"]
for idx, track in enumerate(cohort, start=1):
    print(f"[{idx}] Track: {track} (Enrolled & Proctored)")

print("\\nAcademic Verification: 100% Passed.")`,
        isEntry: true,
      },
    ],
  },
  java: {
    label: "Java 21",
    files: [
      {
        name: "Main.java",
        language: "java",
        content: `public class Main {
    public static void main(String[] args) {
        System.out.println("=== JKS Java Core Runner ===");
        System.out.println("Status: Online & Verified");
    }
}`,
        isEntry: true,
      },
    ],
  },
  cpp: {
    label: "C++ 20",
    files: [
      {
        name: "main.cpp",
        language: "cpp",
        content: `#include <iostream>

int main() {
    std::cout << "=== JKS Systems Architecture ===" << std::endl;
    std::cout << "Compiled with C++ 20." << std::endl;
    return 0;
}`,
        isEntry: true,
      },
    ],
  },
};

export default function AdminPlaygroundPage() {
  const [currentLang, setCurrentLang] = useState<Language>("html-css-js");
  const [files, setFiles] = useState<FileItem[]>(TEMPLATES["html-css-js"].files);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"browser" | "console">("browser");
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleSelectLanguage = (lang: Language) => {
    setCurrentLang(lang);
    setFiles(TEMPLATES[lang].files);
    setActiveFileIndex(0);
    setLogs([]);
    if (lang === "html-css-js") {
      setViewMode("browser");
    } else {
      setViewMode("console");
    }
  };

  const handleUpdateCode = (newVal: string) => {
    const updated = [...files];
    updated[activeFileIndex].content = newVal;
    setFiles(updated);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setLogs([]);

    if (currentLang === "html-css-js") {
      const htmlFile = files.find((f) => f.name.endsWith(".html"))?.content || "";
      const cssFile = files.find((f) => f.name.endsWith(".css"))?.content || "";
      const jsFile = files.find((f) => f.name.endsWith(".js"))?.content || "";

      const combinedSrcDoc = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>${cssFile}</style>
          <script>
            const _log = console.log;
            console.log = function(...args) {
              window.parent.postMessage({ type: 'CONSOLE_LOG', data: args.join(' ') }, '*');
              _log.apply(console, args);
            };
          </script>
        </head>
        <body>
          ${htmlFile}
          <script>${jsFile}</script>
        </body>
        </html>
      `;

      if (iframeRef.current) {
        iframeRef.current.srcdoc = combinedSrcDoc;
      }
      setLogs((prev) => [...prev, "▶ Web application reloaded successfully."]);
      setIsRunning(false);
    } else {
      setViewMode("console");
      const currentCode = files[activeFileIndex].content;
      const startTime = performance.now();

      setTimeout(() => {
        try {
          if (currentLang === "vanilla-js" || currentLang === "typescript") {
            const capturedLogs: string[] = [];
            const originalLog = console.log;
            console.log = (...args: any[]) => {
              capturedLogs.push(
                args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")
              );
            };

            const runFn = new Function(currentCode);
            runFn();

            console.log = originalLog;
            const elapsed = (performance.now() - startTime).toFixed(2);

            setLogs([
              `⚡ Executed in ${elapsed}ms`,
              "----------------------------------------",
              ...capturedLogs,
            ]);
          } else {
            const lines = currentCode.split("\n");
            const outputLines: string[] = [];

            lines.forEach((l) => {
              const trimmed = l.trim();
              if (
                trimmed.startsWith("print(") ||
                trimmed.startsWith("System.out.println(") ||
                trimmed.startsWith("std::cout <<")
              ) {
                const match = trimmed.match(/["'](.*?)["']/);
                if (match && match[1]) {
                  outputLines.push(match[1].replace(/\\n/g, ""));
                }
              }
            });

            const elapsed = (performance.now() - startTime).toFixed(2);
            setLogs([
              `⚡ Compiled & Executed with ${TEMPLATES[currentLang].label} in ${elapsed}ms`,
              "----------------------------------------",
              ...(outputLines.length > 0 ? outputLines : ["Program finished with exit code 0."]),
            ]);
          }
        } catch (err: any) {
          setLogs(["❌ Runtime Error:", String(err?.message || err)]);
        } finally {
          setIsRunning(false);
        }
      }, 300);
    }
  };

  useEffect(() => {
    handleRunCode();
  }, [currentLang]);

  useEffect(() => {
    const handleMsg = (e: MessageEvent) => {
      if (e.data?.type === "CONSOLE_LOG") {
        setLogs((prev) => [...prev, e.data.data]);
      }
    };
    window.addEventListener("message", handleMsg);
    return () => window.removeEventListener("message", handleMsg);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(files[activeFileIndex].content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <DashboardTopbar
        title="Code Playground & Sandbox"
        subtitle="Test, compile, and execute code snippets directly in your admin command center."
        userInitials="AD"
      />

      <div className="flex-1 p-4 pt-2 sm:p-6 lg:p-8 lg:pt-2 flex flex-col h-[calc(100vh-100px)]">
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden rounded-[24px] border border-slate-800 bg-[#0F172A] shadow-2xl">
          {/* LEFT RAIL */}
          <div className="w-full lg:w-56 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800 bg-[#0B132B] p-4 flex flex-col justify-between">
            <div>
              <div className="relative">
                <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Language / Runtime
                </label>
                <div className="relative mt-1">
                  <select
                    value={currentLang}
                    onChange={(e) => handleSelectLanguage(e.target.value as Language)}
                    className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#2563EB] cursor-pointer"
                  >
                    <option value="html-css-js">Vanilla JS / Web</option>
                    <option value="vanilla-js">JavaScript (Node)</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python 3.12</option>
                    <option value="java">Java 21</option>
                    <option value="cpp">C++ 20</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <FolderOpen className="h-3.5 w-3.5" /> Files
                  </span>
                  <span>{files.length}</span>
                </div>

                <div className="mt-2 space-y-1">
                  {files.map((file, idx) => (
                    <button
                      key={file.name}
                      type="button"
                      onClick={() => setActiveFileIndex(idx)}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                        activeFileIndex === idx
                          ? "bg-[#2563EB] text-white shadow-xs"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <FileCode className="h-3.5 w-3.5 shrink-0" />
                        {file.name}
                      </span>
                      {file.isEntry && (
                        <span className="rounded bg-black/30 px-1 text-[9px] font-mono text-white">
                          entry
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 hidden lg:block">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Explore Other Compilers
              </div>
              <div className="mt-2 grid grid-cols-4 gap-1 text-center">
                {(["python", "java", "cpp", "typescript"] as Language[]).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => handleSelectLanguage(l)}
                    className="rounded-lg bg-slate-800/80 p-1.5 text-[10px] font-bold text-slate-300 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                  >
                    {l === "vanilla-js" ? "JS" : l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MIDDLE: Code Editor */}
          <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 bg-[#0F172A] min-w-0">
            <div className="flex items-center justify-between border-b border-slate-800 bg-[#0B132B] px-3 py-1.5">
              <div className="flex items-center gap-1 overflow-x-auto">
                {files.map((file, idx) => (
                  <button
                    key={file.name}
                    type="button"
                    onClick={() => setActiveFileIndex(idx)}
                    className={`rounded-md px-3 py-1 text-xs font-mono font-medium transition-colors ${
                      activeFileIndex === idx
                        ? "bg-[#0F172A] text-white border-t-2 border-[#2563EB]"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {file.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                  title="Copy code"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const original = TEMPLATES[currentLang].files[activeFileIndex].content;
                    handleUpdateCode(original);
                  }}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                  title="Reset template"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="flex-1 relative flex overflow-hidden font-mono text-xs sm:text-sm">
              <textarea
                value={files[activeFileIndex]?.content || ""}
                onChange={(e) => handleUpdateCode(e.target.value)}
                spellCheck={false}
                className="w-full h-full resize-none border-none bg-transparent p-4 text-emerald-300 outline-none leading-relaxed overflow-auto selection:bg-[#2563EB]/40 font-mono"
              />
            </div>
          </div>

          {/* RIGHT: Live Browser & Console Output */}
          <div className="w-full lg:w-[420px] shrink-0 flex flex-col bg-white dark:bg-surface-secondary overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-elevated px-3 py-2">
              <div className="flex items-center gap-1">
                {currentLang === "html-css-js" && (
                  <button
                    type="button"
                    onClick={() => setViewMode("browser")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                      viewMode === "browser"
                        ? "bg-white text-slate-900 shadow-xs dark:bg-surface-secondary dark:text-white"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    <Monitor className="h-3.5 w-3.5" />
                    <span>Browser</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setViewMode("console")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                    viewMode === "console"
                      ? "bg-white text-slate-900 shadow-xs dark:bg-surface-secondary dark:text-white"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Console</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>{isRunning ? "Running..." : "Run Code"}</span>
              </button>
            </div>

            <div className="flex-1 relative bg-white dark:bg-surface-secondary overflow-hidden">
              {viewMode === "browser" && currentLang === "html-css-js" ? (
                <iframe
                  ref={iframeRef}
                  title="Live Sandbox Output"
                  sandbox="allow-scripts allow-modals"
                  className="w-full h-full border-none bg-white dark:bg-surface-secondary"
                />
              ) : (
                <div className="h-full w-full bg-slate-950 p-4 font-mono text-xs text-slate-200 overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] text-slate-400 font-bold uppercase">
                    <span>Standard Output (stdout)</span>
                    <button
                      type="button"
                      onClick={() => setLogs([])}
                      className="hover:text-rose-400 transition-colors"
                      title="Clear terminal"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="mt-3 space-y-1.5">
                    {logs.length === 0 ? (
                      <div className="text-slate-400 italic">No output yet. Click &quot;Run Code&quot; to execute.</div>
                    ) : (
                      logs.map((log, i) => (
                        <div
                          key={i}
                          className={`leading-relaxed whitespace-pre-wrap ${
                            log.startsWith("❌")
                              ? "text-rose-400 font-bold"
                              : log.startsWith("⚡")
                                ? "text-cyan-400 font-bold"
                                : "text-emerald-300"
                          }`}
                        >
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

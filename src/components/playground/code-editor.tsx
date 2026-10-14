"use client";

import { useEffect, useRef } from "react";
import Editor, { loader, type OnMount } from "@monaco-editor/react";
import { Loader2 } from "lucide-react";

// Monaco is loaded on demand from a pinned CDN build (matches the installed
// monaco-editor version), so it is not part of the app bundle.
loader.config({ paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.57.0/min/vs" } });

interface Props {
  /** Changes when a different file is opened, so Monaco keeps a model per file. */
  path: string;
  language: string;
  value: string;
  readOnly?: boolean;
  onChange: (value: string) => void;
  onRun: () => void;
}

/** Light, VS Code-style editor: line numbers, highlighting, auto-closing brackets, tabs/indent. */
export function CodeEditor({ path, language, value, readOnly, onChange, onRun }: Props) {
  const runRef = useRef(onRun);
  useEffect(() => {
    runRef.current = onRun;
  });

  const handleMount: OnMount = (editor, monaco) => {
    // Ctrl/Cmd + Enter runs the program.
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => runRef.current());
  };

  return (
    <Editor
      height="100%"
      theme="vs"
      path={path}
      language={language}
      value={value}
      onChange={(v) => onChange(v ?? "")}
      onMount={handleMount}
      loading={
        <div className="flex h-full items-center justify-center gap-2 text-xs text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading editor…
        </div>
      }
      options={{
        readOnly,
        automaticLayout: true,
        fontSize: 13,
        fontFamily: "Consolas, 'Cascadia Code', 'SF Mono', Menlo, monospace",
        lineNumbers: "on",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        tabSize: 4,
        insertSpaces: true,
        autoIndent: "full",
        autoClosingBrackets: "always",
        autoClosingQuotes: "always",
        bracketPairColorization: { enabled: true },
        renderLineHighlight: "line",
        smoothScrolling: true,
        padding: { top: 8 },
        wordWrap: "off",
        accessibilitySupport: "auto",
      }}
    />
  );
}

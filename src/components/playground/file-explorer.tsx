"use client";

import { useState } from "react";
import { FileCode2, FileText, Lock, Pencil, Plus, Trash2, X } from "lucide-react";

export interface ExplorerFile {
  name: string;
  /** Shown but cannot be edited, renamed or deleted (e.g. the problem statement). */
  locked?: boolean;
  /** Can be edited but not renamed or deleted (e.g. the file that gets submitted). */
  protectedFile?: boolean;
}

const NAME_RE = /^[A-Za-z0-9_][A-Za-z0-9_ .\-]*$/;
export const MAX_FILES = 20;

export function validateFileName(name: string, existing: string[], ignore?: string): string | null {
  const n = name.trim();
  if (!n) return "Enter a file name.";
  if (n.length > 80) return "That name is too long.";
  if (!NAME_RE.test(n) || n.includes("..")) return "Use letters, numbers, dots, dashes and underscores.";
  if (existing.some((e) => e.toLowerCase() === n.toLowerCase() && e !== ignore)) return "A file with that name exists.";
  return null;
}

interface Props {
  files: ExplorerFile[];
  activeName: string;
  onOpen: (name: string) => void;
  onCreate: (name: string) => void;
  onRename: (from: string, to: string) => void;
  onDelete: (name: string) => void;
  /** Number of real (non-locked) files, for the limit. */
  fileCount: number;
}

export function FileExplorer({ files, activeName, onOpen, onCreate, onRename, onDelete, fileCount }: Props) {
  const [creating, setCreating] = useState(false);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  const names = files.map((f) => f.name);

  function commit() {
    const problem = validateFileName(draft, names, renaming ?? undefined);
    if (problem) {
      setError(problem);
      return;
    }
    if (renaming) onRename(renaming, draft.trim());
    else onCreate(draft.trim());
    cancel();
  }

  function cancel() {
    setCreating(false);
    setRenaming(null);
    setDraft("");
    setError(null);
  }

  const atLimit = fileCount >= MAX_FILES;

  return (
    <div className="flex h-full flex-col bg-[#f3f3f3] text-[#2b2b2b]" aria-label="File explorer">
      <div className="flex h-9 shrink-0 items-center justify-between px-3 text-[11px] font-semibold uppercase tracking-wider text-[#616161]">
        <span>Explorer</span>
        <button
          type="button"
          onClick={() => {
            setRenaming(null);
            setDraft("");
            setError(null);
            setCreating(true);
          }}
          disabled={atLimit}
          title={atLimit ? `Limit of ${MAX_FILES} files reached` : "New file"}
          aria-label="New file"
          className="rounded p-1 text-[#616161] hover:bg-[#e2e2e2] disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto pb-2 text-[13px]">
        {files.map((f) => {
          const active = f.name === activeName;
          const editing = renaming === f.name;
          return (
            <li key={f.name} className="group">
              {editing ? (
                <div className="px-2 py-1">
                  <NameInput value={draft} onChange={setDraft} onCommit={commit} onCancel={cancel} error={error} />
                </div>
              ) : (
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 ${
                    active ? "bg-[#e4e6f1] text-[#1f1f1f]" : "hover:bg-[#e8e8e8]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onOpen(f.name)}
                    aria-current={active ? "true" : undefined}
                    className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
                    title={f.name}
                  >
                    {f.locked ? (
                      <FileText className="h-4 w-4 shrink-0 text-[#6a6a6a]" />
                    ) : (
                      <FileCode2 className="h-4 w-4 shrink-0 text-[#3b7ddd]" />
                    )}
                    <span className="truncate">{f.name}</span>
                    {(f.locked || f.protectedFile) && <Lock className="h-3 w-3 shrink-0 text-[#8a8a8a]" aria-label="protected" />}
                  </button>
                  {!f.locked && !f.protectedFile && (
                    <span className="flex shrink-0 gap-0.5 opacity-0 focus-within:opacity-100 group-hover:opacity-100">
                      <button
                        type="button"
                        aria-label={`Rename ${f.name}`}
                        onClick={() => {
                          setCreating(false);
                          setRenaming(f.name);
                          setDraft(f.name);
                          setError(null);
                        }}
                        className="rounded p-1 text-[#616161] hover:bg-[#d6d6d6]"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${f.name}`}
                        onClick={() => window.confirm(`Delete ${f.name}? This cannot be undone.`) && onDelete(f.name)}
                        className="rounded p-1 text-[#616161] hover:bg-[#d6d6d6] hover:text-[#c42b1c]"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </li>
          );
        })}
        {creating && (
          <li className="px-2 py-1">
            <NameInput value={draft} onChange={setDraft} onCommit={commit} onCancel={cancel} error={error} placeholder="filename.ext" />
          </li>
        )}
      </ul>
    </div>
  );
}

function NameInput({
  value,
  onChange,
  onCommit,
  onCancel,
  error,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  onCommit: () => void;
  onCancel: () => void;
  error: string | null;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1">
        <input
          autoFocus
          value={value}
          placeholder={placeholder}
          aria-label="File name"
          aria-invalid={!!error}
          maxLength={80}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onCommit();
            if (e.key === "Escape") onCancel();
          }}
          className="min-w-0 flex-1 rounded border border-[#3b7ddd] bg-white px-1.5 py-0.5 text-[13px] text-[#1f1f1f] outline-none"
        />
        <button type="button" onClick={onCancel} aria-label="Cancel" className="rounded p-1 text-[#616161] hover:bg-[#d6d6d6]">
          <X className="h-3 w-3" />
        </button>
      </div>
      {error && <p className="mt-0.5 text-[11px] text-[#c42b1c]">{error}</p>}
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  BookOpen,
  Check,
  X,
  Loader2,
  Sparkles,
  AlertCircle,
  ChevronDown,
  Layers,
  Tag,
} from "lucide-react";
import {
  fetchSyllabusTemplates,
  type SyllabusTemplate,
} from "@/lib/api/syllabus-api";

interface SyllabusTemplateSelectorProps {
  selectedTemplateId: string | null;
  onSelectTemplate: (template: SyllabusTemplate | null) => void;
  onImportModules?: (modules: any[]) => void;
}

export function SyllabusTemplateSelector({
  selectedTemplateId,
  onSelectTemplate,
  onImportModules,
}: SyllabusTemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState<SyllabusTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<SyllabusTemplate | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load templates on mount or search
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetchSyllabusTemplates(searchQuery)
      .then((data) => {
        if (isMounted) {
          setTemplates(data || []);
          if (selectedTemplateId) {
            const current = data.find((t) => t.id === selectedTemplateId);
            if (current) setSelectedTemplate(current);
          }
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Failed to load syllabus templates");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedTemplateId]);

  const handleSelect = (tmpl: SyllabusTemplate) => {
    setSelectedTemplate(tmpl);
    onSelectTemplate(tmpl);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleUnlink = () => {
    setSelectedTemplate(null);
    onSelectTemplate(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-surface-secondary/95 p-4 sm:p-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] space-y-3 backdrop-blur-xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-[#2563EB] dark:text-blue-400">
            <BookOpen className="h-4.5 w-4.5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Course Syllabus Template
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Link this course to a reusable curriculum template using its searchable keyword.
            </p>
          </div>
        </div>

        {selectedTemplate ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 shadow-2xs">
              <Check className="h-3.5 w-3.5 text-emerald-600" /> Linked: {selectedTemplate.title}
            </span>
            <button
              type="button"
              onClick={handleUnlink}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 cursor-pointer p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Unlink Syllabus"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <span className="text-[11px] font-semibold text-slate-400">
            No template linked (Optional)
          </span>
        )}
      </div>

      {selectedTemplate ? (
        <div className="rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/20 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {selectedTemplate.title}
                </span>
                <span className="font-mono text-[10.5px] px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                  keyword: {selectedTemplate.keyword}
                </span>
                {selectedTemplate.track && (
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    • {selectedTemplate.track}
                  </span>
                )}
              </div>
              {selectedTemplate.description && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {selectedTemplate.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {onImportModules && Array.isArray(selectedTemplate.modules) && selectedTemplate.modules.length > 0 && (
                <button
                  type="button"
                  onClick={() => onImportModules(selectedTemplate.modules)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer hover:scale-102"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Import {selectedTemplate.modules.length} Modules to Curriculum
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="text-xs font-bold text-[#2563EB] dark:text-blue-400 hover:underline cursor-pointer px-2 py-1"
              >
                Change Template
              </button>
            </div>
          </div>

          {Array.isArray(selectedTemplate.modules) && selectedTemplate.modules.length > 0 && (
            <div className="pt-2.5 border-t border-emerald-100 dark:border-emerald-900/40">
              <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <Layers className="h-3 w-3" /> Template Modules Structure ({selectedTemplate.modules.length} modules):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedTemplate.modules.map((m, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-surface-elevated border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 font-medium shadow-2xs"
                  >
                    <span className="text-[#2563EB] dark:text-blue-400 font-bold">{idx + 1}.</span> {m.title}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Custom Search & Dropdown Trigger */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!isOpen) setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search syllabus template by keyword (e.g. sap-s4hana, python-full-stack)..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-input-bg pl-10 pr-9 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB] focus:bg-white dark:focus:bg-input-bg transition-all shadow-2xs"
            />
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-[#2563EB]" />
              ) : (
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              )}
            </button>
          </div>

          {/* Elevated Results Popover Dropdown */}
          {isOpen && (
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-surface-secondary shadow-xl p-2.5 max-h-72 overflow-y-auto space-y-1 z-30 animate-in fade-in slide-in-from-top-1">
              <div className="px-2 py-1 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 mb-1">
                <span>Available Syllabus Templates</span>
                <span>{templates.length} found</span>
              </div>

              {error ? (
                <div className="p-3 text-xs text-rose-500 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : templates.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  <Tag className="h-6 w-6 mx-auto mb-1.5 text-slate-300 dark:text-slate-600" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    {searchQuery.trim()
                      ? `No template found for "${searchQuery}".`
                      : "No syllabus templates saved yet."}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Create reusable templates in the Syllabus Templates section.
                  </p>
                </div>
              ) : (
                templates.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    onClick={() => handleSelect(tmpl)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/50 dark:hover:bg-surface-hover transition-all group cursor-pointer border border-transparent hover:border-blue-100 dark:hover:border-blue-900/40"
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">
                          {tmpl.title}
                        </span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 font-bold border border-blue-200/60 dark:border-blue-900/60">
                          {tmpl.keyword}
                        </span>
                        {tmpl.track && (
                          <span className="text-[10px] font-semibold text-slate-400">
                            • {tmpl.track}
                          </span>
                        )}
                      </div>
                      {tmpl.description && (
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {tmpl.description}
                        </p>
                      )}
                      <span className="text-[10px] font-medium text-slate-400 mt-1 block">
                        {(tmpl.modules || []).length} modules structure included
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(tmpl);
                      }}
                      className="shrink-0 rounded-xl bg-slate-100 dark:bg-surface-elevated text-slate-700 dark:text-slate-200 group-hover:bg-[#2563EB] group-hover:text-white px-3.5 py-1.5 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                    >
                      Select
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

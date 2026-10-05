"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Search,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Loader2,
  Sparkles,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Tag,
  Layers,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import {
  fetchSyllabusTemplates,
  createSyllabusTemplate,
  updateSyllabusTemplate,
  deleteSyllabusTemplate,
  type SyllabusTemplate,
  type SyllabusModuleItem,
} from "@/lib/api/syllabus-api";

interface SyllabusManagerViewProps {
  role: "admin" | "instructor";
}

export function SyllabusManagerView({ role }: SyllabusManagerViewProps) {
  const [templates, setTemplates] = useState<SyllabusTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrack, setSelectedTrack] = useState("ALL");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Editor Modal / Panel State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [keyword, setKeyword] = useState("");
  const [description, setDescription] = useState("");
  const [track, setTrack] = useState("FULL_STACK");
  const [customTrack, setCustomTrack] = useState("");
  const [modules, setModules] = useState<SyllabusModuleItem[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  const loadTemplates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchSyllabusTemplates(searchQuery, selectedTrack);
      setTemplates(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load syllabus templates");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, [searchQuery, selectedTrack]);

  const openCreateModal = () => {
    setEditingTemplateId(null);
    setTitle("");
    setKeyword("");
    setDescription("");
    setTrack("FULL_STACK");
    setCustomTrack("");
    setModules([
      {
        title: "Module 1: Foundations & Core Concepts",
        topics: ["Introduction to Architecture", "Environment Setup", "Core Syntax"],
      },
    ]);
    setFormError(null);
    setIsEditorOpen(true);
  };

  const openEditModal = (tmpl: SyllabusTemplate) => {
    setEditingTemplateId(tmpl.id);
    setTitle(tmpl.title);
    setKeyword(tmpl.keyword);
    setDescription(tmpl.description || "");
    const isStandard = ["FULL_STACK", "FRONTEND", "SAP", "DOTNET"].includes(tmpl.track || "");
    if (isStandard) {
      setTrack(tmpl.track || "FULL_STACK");
      setCustomTrack("");
    } else {
      setTrack("CUSTOM");
      setCustomTrack(tmpl.track || "");
    }
    setModules(Array.isArray(tmpl.modules) ? tmpl.modules : []);
    setFormError(null);
    setIsEditorOpen(true);
  };

  const handleAddModule = () => {
    setModules([
      ...modules,
      {
        title: `Module ${modules.length + 1}: New Topic Area`,
        topics: ["Key Concept 1"],
      },
    ]);
  };

  const handleRemoveModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const handleUpdateModuleTitle = (index: number, newTitle: string) => {
    const updated = [...modules];
    updated[index].title = newTitle;
    setModules(updated);
  };

  const handleAddTopic = (moduleIndex: number) => {
    const updated = [...modules];
    updated[moduleIndex].topics = [...(updated[moduleIndex].topics || []), "New Topic"];
    setModules(updated);
  };

  const handleUpdateTopic = (moduleIndex: number, topicIndex: number, val: string) => {
    const updated = [...modules];
    updated[moduleIndex].topics[topicIndex] = val;
    setModules(updated);
  };

  const handleRemoveTopic = (moduleIndex: number, topicIndex: number) => {
    const updated = [...modules];
    updated[moduleIndex].topics = updated[moduleIndex].topics.filter((_, i) => i !== topicIndex);
    setModules(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError("Syllabus title is required.");
      return;
    }
    const cleanKeyword = keyword
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-");
    if (!cleanKeyword) {
      setFormError("A valid keyword is required (e.g. python-full-stack, sap-s4hana).");
      return;
    }

    if (modules.length === 0) {
      setFormError("Please add at least one module to the syllabus.");
      return;
    }

    const finalTrack = track === "CUSTOM" ? (customTrack.trim() || "CUSTOM") : track;

    setIsSaving(true);
    try {
      if (editingTemplateId) {
        await updateSyllabusTemplate(editingTemplateId, {
          title: title.trim(),
          keyword: cleanKeyword,
          description: description.trim() || undefined,
          track: finalTrack,
          modules,
        });
        setSuccessMessage("Syllabus template updated successfully!");
      } else {
        await createSyllabusTemplate({
          title: title.trim(),
          keyword: cleanKeyword,
          description: description.trim() || undefined,
          track: finalTrack,
          modules,
        });
        setSuccessMessage("New syllabus template created and saved successfully!");
      }
      setIsEditorOpen(false);
      loadTemplates();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setFormError(err.message || "Failed to save syllabus template.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (tmpl: SyllabusTemplate) => {
    if (
      !window.confirm(
        `Are you sure you want to delete syllabus template "${tmpl.title}"? Any linked courses will have their syllabus unlinked.`
      )
    ) {
      return;
    }

    try {
      await deleteSyllabusTemplate(tmpl.id);
      setSuccessMessage(`Syllabus template "${tmpl.title}" deleted.`);
      loadTemplates();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to delete syllabus template.");
    }
  };

  return (
    <>
      <DashboardTopbar
        title="Syllabus Templates"
        subtitle="Manage reusable syllabus templates, module structures, and search keywords for course curriculum."
        userInitials={role === "admin" ? "AD" : "IN"}
      />

      <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Alerts */}
        {successMessage && (
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <Check className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-4 text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Top Actions: Search, Filter, Create */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1 max-w-xl">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keyword (e.g. sap-s4hana) or title..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-secondary pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="relative">
              <select
                value={selectedTrack}
                onChange={(e) => setSelectedTrack(e.target.value)}
                className="appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-secondary pl-3.5 pr-8 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2563EB] shadow-2xs cursor-pointer"
              >
                <option value="ALL">All Tracks</option>
                <option value="FULL_STACK">Full Stack</option>
                <option value="FRONTEND">Frontend</option>
                <option value="SAP">SAP S/4HANA</option>
                <option value="DOTNET">.NET Mastery</option>
                {Array.from(
                  new Set(
                    templates
                      .map((t) => t.track)
                      .filter(
                        (tr): tr is string =>
                          Boolean(tr && !["FULL_STACK", "FRONTEND", "SAP", "DOTNET"].includes(tr))
                      )
                  )
                ).map((ct) => (
                  <option key={ct} value={ct}>
                    {ct} (Custom)
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-3 h-3.5 w-3.5 text-slate-400" />
            </div>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" /> Create Syllabus Template
          </button>
        </div>

        {/* Templates Grid */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="h-7 w-7 animate-spin text-[#2563EB] mb-2" />
            <p className="text-xs">Loading syllabus templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center max-w-lg mx-auto">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] mb-3">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No syllabus templates found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
              {searchQuery.trim()
                ? `No templates matched your search keyword "${searchQuery}".`
                : "Create reusable syllabus templates with unique keywords for fast course creation."}
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Create First Syllabus
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {templates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary p-5 shadow-xs hover:border-[#2563EB]/50 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                      keyword: {tmpl.keyword}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {tmpl.track || "GENERAL"}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                    {tmpl.title}
                  </h3>

                  {tmpl.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">
                      {tmpl.description}
                    </p>
                  )}

                  {/* Modules summary */}
                  <div className="mt-3.5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                      <span>Modules ({(tmpl.modules || []).length})</span>
                      <span>
                        {tmpl._count?.courses ?? 0} course{(tmpl._count?.courses ?? 0) === 1 ? "" : "s"} linked
                      </span>
                    </div>

                    <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                      {(tmpl.modules || []).slice(0, 4).map((m, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs py-0.5 text-slate-700 dark:text-slate-300"
                        >
                          <span className="truncate pr-2">
                            <span className="text-slate-400 font-semibold">{idx + 1}.</span> {m.title}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {(m.topics || []).length} topics
                          </span>
                        </div>
                      ))}
                      {(tmpl.modules || []).length > 4 && (
                        <p className="text-[10.5px] font-semibold text-slate-400 italic">
                          +{(tmpl.modules || []).length - 4} more modules
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10.5px] text-slate-400">
                    Updated {new Date(tmpl.updatedAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(tmpl)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-[#2563EB] hover:bg-slate-100 dark:hover:bg-surface-hover transition-colors cursor-pointer"
                      title="Edit Syllabus"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(tmpl)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Delete Syllabus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal / Dialog: Create & Edit Syllabus */}
        {isEditorOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
            <div className="bg-white dark:bg-surface-secondary rounded-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#2563EB]" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {editingTemplateId ? "Edit Syllabus Template" : "Create Syllabus Template"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {formError && (
                <div className="rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-3 text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Syllabus Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Python Full Stack"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Searchable Keyword <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="e.g. python-full-stack, sap-s4hana"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-input-bg p-2 text-xs font-mono text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Unique identifier used to search & select this syllabus during course creation.
                    </span>
                  </div>
                </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Curriculum Track / Domain</span>
                      {track === "CUSTOM" && (
                        <span className="text-[10px] font-bold text-[#2563EB] dark:text-blue-400">Custom Category</span>
                      )}
                    </label>

                    {/* Pro UI Track Dropdown Selector */}
                    <div className="relative">
                      <select
                        value={track}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTrack(val);
                          if (val !== "CUSTOM") {
                            setCustomTrack("");
                          }
                        }}
                        className="w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg pl-3.5 pr-10 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#2563EB] shadow-2xs cursor-pointer"
                      >
                        <option value="FULL_STACK">⚡ Full Stack Development</option>
                        <option value="FRONTEND">🎨 Frontend Engineering</option>
                        <option value="SAP">💼 SAP S/4HANA Enterprise</option>
                        <option value="DOTNET">🔷 .NET Enterprise Mastery</option>
                        <option value="CUSTOM">✨ + Custom Track (Enter Name Below)...</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-slate-400" />
                    </div>

                    {track === "CUSTOM" && (
                      <div className="mt-2.5 animate-in fade-in slide-in-from-top-1">
                        <input
                          type="text"
                          value={customTrack}
                          onChange={(e) => setCustomTrack(e.target.value)}
                          placeholder="Type custom track name (e.g. Data Engineering, DevOps, Cloud Architecture, AI/ML)..."
                          className="w-full rounded-xl border-2 border-[#2563EB] bg-white dark:bg-input-bg p-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none ring-4 ring-[#2563EB]/10 placeholder:font-normal placeholder:text-slate-400"
                          autoFocus
                        />
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Description & Overview
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief overview of curriculum objectives and scope..."
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-input-bg p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB] focus:bg-white dark:focus:bg-input-bg"
                    />
                  </div>

                {/* Modules Editor */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
                      Curriculum Modules ({modules.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleAddModule}
                      className="inline-flex items-center gap-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-2.5 py-1 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Module
                    </button>
                  </div>

                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {modules.map((m, mIdx) => (
                      <div
                        key={mIdx}
                        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-input-bg p-3 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={m.title}
                            onChange={(e) => handleUpdateModuleTitle(mIdx, e.target.value)}
                            placeholder={`Module ${mIdx + 1} Title`}
                            className="flex-1 font-bold text-slate-900 dark:text-white bg-transparent outline-none border-b border-transparent focus:border-[#2563EB]"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveModule(mIdx)}
                            className="text-slate-400 hover:text-rose-500 cursor-pointer p-1"
                            title="Remove module"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Topics */}
                        <div className="space-y-1.5 pl-2 border-l-2 border-blue-200 dark:border-blue-800">
                          <div className="flex items-center justify-between text-[10.5px] font-bold text-slate-400">
                            <span>Topics</span>
                            <button
                              type="button"
                              onClick={() => handleAddTopic(mIdx)}
                              className="text-[#2563EB] hover:underline cursor-pointer"
                            >
                              + Add Topic
                            </button>
                          </div>
                          {(m.topics || []).map((t, tIdx) => (
                            <div key={tIdx} className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-400">•</span>
                              <input
                                type="text"
                                value={t}
                                onChange={(e) => handleUpdateTopic(mIdx, tIdx, e.target.value)}
                                placeholder="Topic name"
                                className="flex-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-secondary px-2 py-1 text-xs text-slate-800 dark:text-white outline-none focus:border-[#2563EB]"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveTopic(mIdx, tIdx)}
                                className="text-slate-300 hover:text-rose-500 p-0.5 cursor-pointer"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    <span>{editingTemplateId ? "Save Changes" : "Create Template"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

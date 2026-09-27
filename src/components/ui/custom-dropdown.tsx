"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface DropdownOption {
  value: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  label?: string;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  disabled?: boolean;
  searchable?: boolean;
  minWidth?: string;
}

export function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
  icon,
  label,
  className = "",
  triggerClassName = "",
  menuClassName = "",
  disabled = false,
  searchable = false,
  minWidth = "min-w-[170px]",
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, searchable]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = searchable && searchTerm.trim()
    ? options.filter((opt) => opt.label.toLowerCase().includes(searchTerm.toLowerCase().trim()))
    : options;

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      {label && (
        <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
          {label}
        </span>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`group flex items-center justify-between gap-2.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all duration-200 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 disabled:opacity-50 disabled:cursor-not-allowed ${
          isOpen
            ? "border-[#2563EB] bg-blue-50/40 text-[#2563EB] shadow-xs dark:border-blue-500 dark:bg-blue-950/30 dark:text-blue-400"
            : value && value !== "ALL" && value !== "All"
            ? "border-blue-300 dark:border-blue-700/70 bg-white dark:bg-surface-elevated text-slate-800 dark:text-white shadow-xs hover:border-[#2563EB]"
            : "border-slate-200 dark:border-slate-700/80 bg-white dark:bg-surface-elevated text-slate-700 dark:text-slate-300 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white"
        } ${minWidth} ${triggerClassName}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 min-w-0 truncate">
          {icon && (
            <span className="shrink-0 text-slate-400 group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">
              {icon}
            </span>
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.count !== undefined && (
            <span className="ml-1 rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
              {selectedOption.count}
            </span>
          )}
        </div>

        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-400 transition-transform duration-200 group-hover:text-[#2563EB] dark:group-hover:text-blue-400 ${
            isOpen ? "rotate-180 text-[#2563EB] dark:text-blue-400" : ""
          }`}
        />
      </button>

      {/* Animated Dropdown Menu Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute left-0 top-full mt-1.5 z-50 w-full min-w-[200px] max-w-[320px] rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl ${menuClassName}`}
            role="listbox"
          >
            {/* Optional Search Bar for dropdowns with many items */}
            {searchable && (
              <div className="relative mb-1.5 px-1 pt-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Filter options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 py-1.5 pl-8 pr-3 text-xs text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:border-[#2563EB]"
                />
              </div>
            )}

            {/* Options List */}
            <div className="max-h-60 overflow-y-auto space-y-0.5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-3 text-center text-xs text-slate-400">
                  No matching options
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                      className={`group flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer text-left ${
                        isSelected
                          ? "bg-blue-50 text-[#2563EB] dark:bg-blue-950/60 dark:text-blue-400 font-bold"
                          : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-surface-hover dark:hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 truncate">
                        {opt.icon && (
                          <span className="shrink-0 text-slate-400 group-hover:text-current">
                            {opt.icon}
                          </span>
                        )}
                        <span className="truncate">{opt.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {opt.count !== undefined && (
                          <span
                            className={`rounded px-1.5 py-0.2 text-[10px] font-semibold ${
                              isSelected
                                ? "bg-blue-200/50 text-[#2563EB] dark:bg-blue-900/60 dark:text-blue-300"
                                : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {opt.count}
                          </span>
                        )}
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 text-[#2563EB] dark:text-blue-400 stroke-[2.5]" />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

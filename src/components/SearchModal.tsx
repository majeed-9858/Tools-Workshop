import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { ToolDefinition } from '../types/tools';
import { DynamicIcon } from './DynamicIcon';
import { searchTools } from '../data/toolsRegistry';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (tool: ToolDefinition) => void;
  initialQuery?: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTool,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = searchTools(query);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        onSelectTool(results[selectedIndex]);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, onSelectTool]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#16181d] rounded-2xl shadow-2xl border border-[#E5E7EB] dark:border-gray-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-[#E5E7EB] dark:border-gray-800 px-4 py-3.5 sm:py-4">
          <Search className="w-5 h-5 text-[#EF4444] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any tool... (e.g. merge pdf, jpg to png, compress, qr)"
            className="w-full text-base sm:text-lg text-[#111827] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none bg-transparent"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-md cursor-pointer"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-2 py-1 text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md cursor-pointer"
            >
              ESC
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-gray-100 dark:divide-gray-800">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <p className="text-sm font-medium mb-3 text-[#111827] dark:text-white">Popular Searches</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {['Merge PDF', 'JPG to PNG', 'Compress PDF', 'Image Compressor', 'PDF to Word', 'QR Code'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-[#EF4444] hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors font-medium border border-red-100 dark:border-red-900/40 cursor-pointer"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm font-medium text-[#111827] dark:text-white mb-1">No tools matched "{query}"</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Try searching by file format (e.g. PDF, JPG, DOCX, WebP) or action (e.g. merge, compress, resize).</p>
            </div>
          ) : (
            results.map((tool, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(tool);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected ? 'bg-red-50 dark:bg-red-950/40 text-[#EF4444]' : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-[#111827] dark:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#EF4444] text-white' : 'bg-red-50 dark:bg-red-950/40 text-[#EF4444]'
                      }`}
                    >
                      <DynamicIcon name={tool.iconName} className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#111827] dark:text-white truncate">{tool.name}</span>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">· {tool.categoryLabel}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{tool.shortDescription}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-[#EF4444] shrink-0 pl-2">
                    <span className="hidden sm:inline">Open</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="px-4 py-2.5 bg-gray-50 dark:bg-[#12141a] border-t border-[#E5E7EB] dark:border-gray-800 text-[11px] text-gray-500 dark:text-gray-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>Use <kbd className="px-1 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-[10px]">↑</kbd> <kbd className="px-1 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-[10px]">↓</kbd> to navigate</span>
            <span><kbd className="px-1 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-[10px]">↵</kbd> to select</span>
          </div>
          <span>Client-side private</span>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ToolDefinition, ToolCategory } from '../types/tools';
import { ToolCard } from './ToolCard';
import { Search } from 'lucide-react';

interface ToolGridProps {
  tools: ToolDefinition[];
  activeCategory: ToolCategory | 'all';
  onCategoryChange: (category: ToolCategory | 'all') => void;
  onSelectTool: (tool: ToolDefinition) => void;
}

export const ToolGrid: React.FC<ToolGridProps> = ({
  tools,
  activeCategory,
  onCategoryChange,
  onSelectTool,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const categories: { label: string; key: ToolCategory | 'all' }[] = [
    { label: 'All Tools', key: 'all' },
    { label: 'PDF Tools', key: 'pdf' },
    { label: 'Image Tools', key: 'image' },
    { label: 'Document Tools', key: 'document' },
    { label: 'Other Tools', key: 'utility' },
  ];

  const filteredTools = tools.filter((tool) => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const matchesQuery =
      filterQuery.trim() === '' ||
      tool.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      tool.shortDescription.toLowerCase().includes(filterQuery.toLowerCase()) ||
      tool.keywords.some((k) => k.toLowerCase().includes(filterQuery.toLowerCase()));

    return matchesCategory && matchesQuery;
  });

  return (
    <section id="tools-section" className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-[#E5E7EB] dark:border-gray-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#EF4444] block mb-1">
              Explore Our Workshop
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
              Browse All Utility Tools
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Select a category or search below to find the exact tool you need.
            </p>
          </div>

          {/* Quick filter search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter these tools..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-gray-800 text-[#111827] dark:text-white placeholder:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#EF4444]"
            />
          </div>
        </div>

        {/* Category Filter Tabs (Zero-pill discipline: segmented control buttons with clear click handlers) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-gray-100 dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700/60 rounded-xl mb-8 max-w-fit">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => onCategoryChange(cat.key)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-white dark:bg-gray-900 text-[#EF4444] shadow-xs scale-100'
                    : 'text-gray-600 dark:text-gray-300 hover:text-[#111827] dark:hover:text-white hover:bg-white/60 dark:hover:bg-gray-700/50 hover:scale-102'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Tools Count Indicator */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-6">
          <span>
            Showing <strong className="text-[#111827] dark:text-white">{filteredTools.length}</strong> {filteredTools.length === 1 ? 'tool' : 'tools'}
          </span>
          {filterQuery && (
            <button
              onClick={() => setFilterQuery('')}
              className="text-[#EF4444] hover:underline font-semibold cursor-pointer"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} onSelect={onSelectTool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#EEEEEE] p-8">
            <h3 className="text-base font-bold text-[#171717] mb-1">No tools found</h3>
            <p className="text-xs text-[#666666] mb-4">
              We couldn't find any tool matching your search query "{filterQuery}".
            </p>
            <button
              type="button"
              onClick={() => {
                setFilterQuery('');
                onCategoryChange('all');
              }}
              className="px-4 py-2 bg-[#E53935] text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

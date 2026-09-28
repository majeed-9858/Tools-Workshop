import React from 'react';
import { ToolDefinition } from '../types/tools';
import { ToolCard } from './ToolCard';
import { Flame } from 'lucide-react';

interface PopularToolsSectionProps {
  popularTools: ToolDefinition[];
  onSelectTool: (tool: ToolDefinition) => void;
}

export const PopularToolsSection: React.FC<PopularToolsSectionProps> = ({
  popularTools,
  onSelectTool,
}) => {
  return (
    <section className="py-14 sm:py-16 bg-white dark:bg-[#0e0e12] border-b border-[#E5E7EB] dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#EF4444] mb-1.5">
              <Flame className="w-4 h-4 text-[#EF4444]" />
              <span>Trending & Frequently Used</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
              Popular Tools
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Top-rated in-browser utilities chosen by users worldwide.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularTools.slice(0, 8).map((tool) => (
            <ToolCard key={tool.id} tool={tool} onSelect={onSelectTool} />
          ))}
        </div>
      </div>
    </section>
  );
};

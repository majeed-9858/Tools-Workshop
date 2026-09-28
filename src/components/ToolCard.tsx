import React, { useState, useRef } from 'react';
import { ToolDefinition } from '../types/tools';
import { DynamicIcon } from './DynamicIcon';
import { ArrowRight } from 'lucide-react';

interface ToolCardProps {
  tool: ToolDefinition;
  onSelect: (tool: ToolDefinition) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate subtle 3D tilt angles (max ~10 degrees for refined feel)
    const rotateX = ((mouseY / rect.height) - 0.5) * -12;
    const rotateY = ((mouseX / rect.width) - 0.5) * 12;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({
      x: (mouseX / rect.width) * 100,
      y: (mouseY / rect.height) * 100,
      opacity: 0.14,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onClick={() => onSelect(tool)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(tool);
        }
      }}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateY(${rotate.x !== 0 ? -4 : 0}px)`,
        transition:
          rotate.x === 0
            ? 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease, border-color 0.2s ease'
            : 'transform 0.08s ease-out',
      }}
      className="group relative flex flex-col justify-between p-6 bg-white dark:bg-[#16181d] rounded-2xl border border-[#E5E7EB] dark:border-gray-800 hover:border-[#EF4444]/40 hover:shadow-xl hover:shadow-red-500/10 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4444] overflow-hidden will-change-transform"
    >
      {/* Dynamic 3D Glare Light Reflection that tracks mouse cursor */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 rounded-2xl z-10"
        style={{
          opacity: glare.opacity,
          background: `radial-gradient(circle 240px at ${glare.x}% ${glare.y}%, rgba(239, 68, 68, 0.18), transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        {/* Header: Icon & Category Metadata (Unboxed text with · separator, zero-pill discipline) */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#EF4444] flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-[#EF4444] group-hover:text-white shadow-xs group-hover:shadow-md group-hover:shadow-red-500/20">
            <DynamicIcon name={tool.iconName} className="w-5 h-5" />
          </div>
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <span>{tool.categoryLabel}</span>
            {tool.popular && (
              <>
                <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                <span className="text-[#EF4444] font-semibold">Popular</span>
              </>
            )}
          </div>
        </div>

        {/* Tool Name */}
        <h3 className="text-base font-bold text-[#111827] dark:text-white group-hover:text-[#EF4444] transition-colors leading-snug mb-2">
          {tool.name}
        </h3>

        {/* Short Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {tool.shortDescription}
        </p>
      </div>

      {/* Footer Action */}
      <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between relative z-10">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {tool.type === 'file-upload' ? 'Browser engine' : 'Instant tool'}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#EF4444] group-hover:translate-x-1 transition-transform duration-200">
          <span>Use Tool</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200" />
        </span>
      </div>
    </div>
  );
};

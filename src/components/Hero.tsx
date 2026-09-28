import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  Sparkles,
  Lock,
  Zap,
  CheckCircle2,
} from 'lucide-react';

interface HeroProps {
  onSearchSubmit: (query: string) => void;
  onExploreClick: () => void;
  onPopularClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSearchSubmit,
  onExploreClick,
  onPopularClick,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [stageTilt, setStageTilt] = useState({ x: 0, y: 0 });

  const handleStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    setStageTilt({ x: y, y: x });
  };

  const handleStageMouseLeave = () => {
    setStageTilt({ x: 0, y: 0 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchSubmit(searchInput.trim());
    }
  };

  const quickPicks = [
    { label: 'PDF to Word', query: 'PDF to Word' },
    { label: 'Compress PDF', query: 'Compress PDF' },
    { label: 'Merge PDF', query: 'Merge PDF' },
    { label: 'JPG to PNG', query: 'JPG to PNG' },
    { label: 'QR Code', query: 'QR Code' },
    { label: 'Word Counter', query: 'Word Counter' },
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24 border-b border-gray-200 dark:border-gray-800 bg-[#FAFAFA] dark:bg-[#0D1117] transition-colors saas-grid-bg">
      {/* Soft Ambient Radial Blur */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[300px] bg-red-500/5 dark:bg-red-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: Modern SaaS Copy, Search & Quick Links     */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* Editorial / Technical Kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-4 bg-red-50 dark:bg-red-950/40 px-3 py-1 rounded-full border border-red-100 dark:border-red-900/50">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              <span>100% In-Browser Privacy · Zero Uploads</span>
            </div>

            {/* Main Headline from the Mockup */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.12] mb-5">
              PDF-to-Workshop <br className="hidden sm:inline" />
              <span className="text-red-500">online utility platform</span>
            </h1>

            {/* Subheadline / Value Proposition */}
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-normal leading-relaxed mb-8 max-w-xl">
              Clean, premium, modern SaaS-style background graphics, for your Tools Workshop. Convert, compress, merge, split, edit, and optimize files with fast, private browser-native utilities.
            </p>

            {/* Pill-Shaped Search & Action Bar */}
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-xl flex items-center bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 rounded-full p-1.5 sm:p-2 shadow-sm hover:shadow-md focus-within:border-gray-400 dark:focus-within:border-gray-500 focus-within:ring-2 focus-within:ring-red-500/20 transition-all mb-4"
            >
              <div className="pl-3 sm:pl-4 text-gray-400 dark:text-gray-500">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search your reference (e.g. merge pdf, jpg to png)..."
                className="w-full px-3 py-2 text-sm sm:text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                className="bg-gray-900 hover:bg-black text-white dark:bg-red-500 dark:hover:bg-red-600 font-semibold text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all shadow-sm hover:shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>Download</span>
                <ArrowRight className="w-4 h-4 hidden sm:inline" />
              </button>
            </form>

            {/* Quick Access References (Zero-pill discipline: unboxed text with subtle separators) */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-gray-500 dark:text-gray-400 mb-8">
              <span className="font-semibold text-gray-700 dark:text-gray-200">Quick access:</span>
              {quickPicks.map((pick, i) => (
                <React.Fragment key={pick.query}>
                  <button
                    type="button"
                    onClick={() => onSearchSubmit(pick.query)}
                    className="hover:text-red-500 dark:hover:text-red-400 transition-colors font-medium cursor-pointer"
                  >
                    {pick.label}
                  </button>
                  {i < quickPicks.length - 1 && (
                    <span aria-hidden="true" className="text-gray-300 dark:text-gray-700">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-5 pt-3 border-t border-gray-200/70 dark:border-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero Server Uploads</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>55+ Free Utilities</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>100% Private Sandbox</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Interactive 3D Isometric Tool Node Scene  */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 relative perspective-1200">
            <div
              onMouseMove={handleStageMouseMove}
              onMouseLeave={handleStageMouseLeave}
              style={{
                transform: `rotateX(${stageTilt.x}deg) rotateY(${stageTilt.y}deg)`,
                transition: stageTilt.x === 0 ? 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'transform 0.08s ease-out',
              }}
              className="preserve-3d relative rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 shadow-2xl overflow-hidden transition-all duration-300 group"
            >
              {/* High-Resolution Mockup Design Visual */}
              <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-950">
                <img
                  src="https://res.cloudinary.com/vvumcwr6/image/upload/v1790504279/Gemini_Generated_Image_4iwef34iwef34iwe_iwg00f.jpg"
                  alt="Tools Workshop - 3D Isometric Utility Node Architecture"
                  className="w-full h-[360px] sm:h-[460px] lg:h-[500px] object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                  loading="eager"
                />

                {/* Subtle Vignette Gradient for Depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent pointer-events-none" />

                {/* Top Floating Glass Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-700 shadow-sm text-[11px] font-semibold text-gray-900 dark:text-white pointer-events-auto">
                    <Lock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Client-Side Sandbox</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-700 shadow-sm text-[11px] font-semibold text-gray-900 dark:text-white pointer-events-auto">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Engine Active · 55+ Tools</span>
                  </div>
                </div>

                {/* Bottom Floating Info Strip */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pointer-events-none z-10">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-950/80 backdrop-blur-md border border-white/10 text-white text-xs font-medium pointer-events-auto shadow-md">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span>PDF ⇄ DOCX · Image · Code · Utilities</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-950/80 backdrop-blur-md border border-white/10 text-emerald-400 text-xs font-semibold pointer-events-auto self-start sm:self-auto shadow-md">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>100% In-Browser Execution</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

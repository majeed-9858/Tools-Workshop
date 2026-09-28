import React, { useState, useEffect } from 'react';
import { Wrench, Search, Menu, X, ShieldCheck, Sun, Moon, Download } from 'lucide-react';
import { ToolCategory } from '../types/tools';

interface HeaderProps {
  activeCategory: string;
  onSelectCategory: (category: ToolCategory | 'all' | 'about') => void;
  onOpenSearch: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  onOpenSearch,
  onGoHome,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Theme state: persists user preference in localStorage and toggles class on document.body
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tools-workshop-theme');
      if (stored === 'dark') return true;
      if (stored === 'light') return false;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Update class on document.body and document.documentElement, and persist in localStorage
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isDark) {
        document.body.classList.add('dark');
        document.documentElement.classList.add('dark');
        localStorage.setItem('tools-workshop-theme', 'dark');
      } else {
        document.body.classList.remove('dark');
        document.documentElement.classList.remove('dark');
        localStorage.setItem('tools-workshop-theme', 'light');
      }
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const navItems: { label: string; key: ToolCategory | 'all' | 'about' }[] = [
    { label: 'Homepage', key: 'all' },
    { label: 'PDF Tools', key: 'pdf' },
    { label: 'Image Tools', key: 'image' },
    { label: 'Document Tools', key: 'document' },
    { label: 'Other Utilities', key: 'utility' },
    { label: 'Why Us', key: 'about' },
  ];

  const handleNavClick = (key: ToolCategory | 'all' | 'about') => {
    setMobileMenuOpen(false);
    if (key === 'all') {
      onGoHome();
    } else {
      onSelectCategory(key);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0e0e11]/95 backdrop-blur-md border-b border-[#E5E7EB] dark:border-gray-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Zone 1: Brand Wordmark matching the Mockup Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onGoHome}
              className="flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4444] rounded-lg p-1 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EF4444] text-white flex items-center justify-center font-black text-xl shadow-md shadow-red-500/25 group-hover:scale-105 transition-transform">
                <span>T</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-[#111827] dark:text-white">
                Tools <span className="text-[#EF4444]">Workshop</span>
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navItems.map((item) => {
              const isActive = activeCategory === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  className={`text-sm font-semibold transition-colors relative py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4444] rounded cursor-pointer ${
                    isActive
                      ? 'text-[#EF4444]'
                      : 'text-gray-600 dark:text-gray-300 hover:text-[#111827] dark:hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EF4444] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Search Trigger Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 sm:px-3.5 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700/80 border border-gray-200 dark:border-gray-700 rounded-xl transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4444] cursor-pointer"
              title="Search tools (Press / to search)"
            >
              <Search className="w-4 h-4 text-[#EF4444]" />
              <span className="hidden sm:inline text-xs font-medium">Search...</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-gray-500 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={isDark}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              onClick={toggleTheme}
              className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4444] shadow-xs ${
                isDark
                  ? 'bg-[#27272a] border border-[#3f3f46]'
                  : 'bg-[#F0EDED] border border-[#DCD6D6]'
              }`}
            >
              <span className="sr-only">Toggle theme</span>
              <span className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
                <Sun className={`w-3.5 h-3.5 transition-opacity duration-200 ${isDark ? 'opacity-30 text-amber-400' : 'opacity-0 text-amber-500'}`} />
                <Moon className={`w-3.5 h-3.5 transition-opacity duration-200 ${isDark ? 'opacity-0 text-red-400' : 'opacity-30 text-slate-400'}`} />
              </span>
              <span
                className={`relative flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-md transition-transform duration-200 ${
                  isDark ? 'translate-x-6' : 'translate-x-0'
                }`}
              >
                {isDark ? (
                  <Moon className="w-3.5 h-3.5 text-[#EF4444]" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                )}
              </span>
            </button>

            {/* Download Project ZIP CTA */}
            <a
              href="/tools-workshop.zip"
              download="tools-workshop.zip"
              title="Download Project Source Code ZIP"
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-all border border-gray-200 dark:border-gray-700 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#EF4444]" />
              <span>Project ZIP</span>
            </a>

            {/* Dark Pill CTA Button matching Mockup */}
            <button
              onClick={() => {
                const el = document.getElementById('tools-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#111827] hover:bg-black dark:bg-white dark:text-[#111827] dark:hover:bg-gray-100 text-white font-semibold text-xs sm:text-sm rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <span>Explore Tools</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-[#111827] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4444]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#EEEEEE] px-4 pt-2 pb-5 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                activeCategory === item.key
                  ? 'bg-[#FFF0F0] text-[#E53935]'
                  : 'text-[#444444] hover:bg-[#FFF7F7]'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Mobile Theme Toggle Row */}
          <div className="pt-3 border-t border-[#EEEEEE] flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#555555]">
              {isDark ? <Moon className="w-4 h-4 text-[#E53935]" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>Theme: {isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isDark}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              onClick={toggleTheme}
              className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E53935] shadow-xs ${
                isDark
                  ? 'bg-[#27272a] border border-[#3f3f46]'
                  : 'bg-[#F0EDED] border border-[#DCD6D6]'
              }`}
            >
              <span className="sr-only">Toggle theme</span>
              <span
                className={`relative flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-md transition-transform duration-200 ${
                  isDark ? 'translate-x-6' : 'translate-x-0'
                }`}
              >
                {isDark ? (
                  <Moon className="w-3.5 h-3.5 text-[#E53935]" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                )}
              </span>
            </button>
          </div>

          {/* Mobile Download ZIP Button */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
            <a
              href="/tools-workshop.zip"
              download="tools-workshop.zip"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-xs font-semibold shadow-xs"
            >
              <Download className="w-4 h-4 text-[#EF4444]" />
              <span>Download Project ZIP</span>
            </a>
          </div>

          <div className="pt-2 border-t border-[#EEEEEE] flex items-center gap-2 text-xs font-medium text-emerald-700 px-3 py-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Files processed privately in your browser</span>
          </div>
        </div>
      )}
    </header>
  );
};

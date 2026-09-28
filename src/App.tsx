import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PopularToolsSection } from './components/PopularToolsSection';
import { ToolGrid } from './components/ToolGrid';
import { ToolView } from './components/ToolView';
import { WhyUsSection } from './components/WhyUsSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { PrivacySection } from './components/PrivacySection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { ToolDefinition, ToolCategory } from './types/tools';
import { TOOLS_REGISTRY, POPULAR_TOOLS, getToolBySlug } from './data/toolsRegistry';

export default function App() {
  const [selectedTool, setSelectedTool] = useState<ToolDefinition | null>(null);
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState('');

  // Handle URL hash changes for deep linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('tool/')) {
        const slug = hash.replace('tool/', '');
        const matched = getToolBySlug(slug);
        if (matched) {
          setSelectedTool(matched);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (hash.startsWith('category/')) {
        const cat = hash.replace('category/', '') as ToolCategory | 'all';
        setActiveCategory(cat);
        setSelectedTool(null);
      } else {
        setSelectedTool(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync homepage SEO when no tool is active
  useEffect(() => {
    if (!selectedTool) {
      const defaultTitle = 'Tools Workshop – Fast, Private & Free Online File Tools';
      const defaultDesc =
        'All-in-one fast, private, and secure online utility workshop to merge, split, compress, and convert PDFs, images, documents, and developer utilities.';

      document.title = defaultTitle;
      const titleElem = document.querySelector('title');
      if (titleElem) titleElem.textContent = defaultTitle;

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', defaultDesc);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', defaultTitle);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', defaultDesc);

      const twTitle = document.querySelector('meta[name="twitter:title"]');
      if (twTitle) twTitle.setAttribute('content', defaultTitle);

      const twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) twDesc.setAttribute('content', defaultDesc);
    }
  }, [selectedTool]);

  // Global keyboard shortcut for search (Cmd+K, Ctrl+K, or /)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleSelectTool = (tool: ToolDefinition) => {
    setSelectedTool(tool);
    window.location.hash = `tool/${tool.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSelectedTool(null);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (category: ToolCategory | 'all' | 'about') => {
    setSelectedTool(null);
    if (category === 'about') {
      const el = document.getElementById('why-us-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveCategory(category);
      window.location.hash = category === 'all' ? '' : `category/${category}`;
      const el = document.getElementById('tools-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHeroSearch = (query: string) => {
    setSearchInitialQuery(query);
    setIsSearchOpen(true);
  };

  const handleExploreAll = () => {
    setSelectedTool(null);
    setActiveCategory('all');
    const el = document.getElementById('tools-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePopularClick = () => {
    setSelectedTool(null);
    const el = document.getElementById('popular-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-[#0D1117] text-[#111827] dark:text-[#F3F4F6] transition-colors">
      {/* Header */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={handleCategorySelect}
        onOpenSearch={() => {
          setSearchInitialQuery('');
          setIsSearchOpen(true);
        }}
        onGoHome={handleBackToHome}
      />

      {/* Main Content: Dedicated Tool View vs Full Homepage */}
      <main className="flex-1">
        {selectedTool ? (
          <ToolView
            tool={selectedTool}
            onBack={handleBackToHome}
            onSelectCategory={(cat) => {
              setSelectedTool(null);
              setActiveCategory(cat);
              window.location.hash = `category/${cat}`;
            }}
          />
        ) : (
          <>
            {/* 1. Hero Section */}
            <Hero
              onSearchSubmit={handleHeroSearch}
              onExploreClick={handleExploreAll}
              onPopularClick={handlePopularClick}
            />

            {/* 2. Popular Tools Section */}
            <div id="popular-section">
              <PopularToolsSection
                popularTools={POPULAR_TOOLS}
                onSelectTool={handleSelectTool}
              />
            </div>

            {/* 3. All Tool Categories & Grid */}
            <ToolGrid
              tools={TOOLS_REGISTRY}
              activeCategory={activeCategory}
              onCategoryChange={(cat) => setActiveCategory(cat)}
              onSelectTool={handleSelectTool}
            />

            {/* 4. Why Tools Workshop */}
            <div id="why-us-section">
              <WhyUsSection />
            </div>

            {/* 5. How It Works */}
            <HowItWorksSection />

            {/* 6. Privacy & Security */}
            <PrivacySection />

            {/* 7. Interactive FAQ */}
            <FaqSection />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectToolSlug={(slug) => {
          const tool = getToolBySlug(slug);
          if (tool) handleSelectTool(tool);
        }}
        onOpenFaq={() => {
          setSelectedTool(null);
          setTimeout(() => {
            const el = document.getElementById('faq-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }}
        onOpenPrivacy={() => {
          setSelectedTool(null);
          setTimeout(() => {
            const el = document.getElementById('why-us-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }}
      />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTool={handleSelectTool}
        initialQuery={searchInitialQuery}
      />
    </div>
  );
}

import React from 'react';
import { Wrench, ShieldCheck, Heart } from 'lucide-react';
import { ToolDefinition } from '../types/tools';

interface FooterProps {
  onSelectToolSlug: (slug: string) => void;
  onOpenFaq: () => void;
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectToolSlug,
  onOpenFaq,
  onOpenPrivacy,
}) => {
  return (
    <footer className="bg-white dark:bg-[#0c0e14] border-t border-[#E5E7EB] dark:border-gray-800 pt-14 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#EF4444] text-white flex items-center justify-center font-black text-lg shadow-sm">
                <span>T</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-[#111827] dark:text-white">
                Tools <span className="text-[#EF4444]">Workshop</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
              Your all-in-one online file and productivity toolbox. Convert, compress, merge, and transform files quickly and privately.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/60 max-w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Zero server retention · Client-side engine</span>
            </div>
          </div>

          {/* PDF Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-white mb-3">
              PDF Tools
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {[
                { label: 'Merge PDF', slug: 'merge-pdf' },
                { label: 'Split PDF', slug: 'split-pdf' },
                { label: 'Compress PDF', slug: 'compress-pdf' },
                { label: 'PDF to Word', slug: 'pdf-to-word' },
                { label: 'PDF to JPG', slug: 'pdf-to-jpg' },
              ].map((item) => (
                <li key={item.slug}>
                  <button
                    onClick={() => onSelectToolSlug(item.slug)}
                    className="hover:text-[#EF4444] transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Image Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-white mb-3">
              Image Tools
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {[
                { label: 'JPG to PNG', slug: 'jpg-to-png' },
                { label: 'PNG to JPG', slug: 'png-to-jpg' },
                { label: 'WebP to JPG', slug: 'webp-to-jpg' },
                { label: 'Image Compressor', slug: 'image-compressor' },
                { label: 'Resize Image', slug: 'resize-image' },
              ].map((item) => (
                <li key={item.slug}>
                  <button
                    onClick={() => onSelectToolSlug(item.slug)}
                    className="hover:text-[#EF4444] transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-white mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-[#EF4444] transition-colors cursor-pointer">
                  About Tools Workshop
                </button>
              </li>
              <li>
                <button onClick={onOpenFaq} className="hover:text-[#EF4444] transition-colors cursor-pointer">
                  FAQ
                </button>
              </li>
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-[#EF4444] transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-[#EF4444] transition-colors cursor-pointer">
                  Terms of Service
                </button>
              </li>
              <li>
                <a
                  href="/tools-workshop.zip"
                  download="tools-workshop.zip"
                  className="inline-flex items-center gap-1 font-semibold text-[#EF4444] hover:text-[#DC2626] transition-colors"
                >
                  <span>Download Source (.ZIP)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 border-t border-[#E5E7EB] dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
          <p>© 2026 Tools Workshop. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with modern web standards and client-side privacy.
          </p>
        </div>
      </div>
    </footer>
  );
};

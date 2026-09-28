import React from 'react';
import { Zap, Sparkles, Shield, Gift } from 'lucide-react';

export const WhyUsSection: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Fast',
      description:
        'Process files quickly with an optimized interface powered by local browser execution and immediate downloads.',
    },
    {
      icon: Sparkles,
      title: 'Easy',
      description:
        'Simple tools that require no complicated software, installations, or steep learning curves. Just drag, drop, and convert.',
    },
    {
      icon: Shield,
      title: 'Secure',
      description:
        'Process files responsibly and minimize unnecessary data retention. Client-side processing keeps your documents private.',
    },
    {
      icon: Gift,
      title: 'Free Tools',
      description:
        'Provide useful utilities with a clear and simple experience. No hidden subscriptions, forced accounts, or watermarks.',
    },
  ];

  return (
    <section className="py-16 bg-gray-50/50 dark:bg-[#0B0D13] border-b border-[#E5E7EB] dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EF4444] block mb-2">
            Why Tools Workshop
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
            Engineered for Speed, Privacy, and Simplicity
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Everything you need to manage digital assets without clunky software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group bg-white dark:bg-[#16181d] rounded-2xl p-6 border border-[#E5E7EB] dark:border-gray-800 shadow-xs flex flex-col justify-between hover:border-[#EF4444]/40 card-hover-lift cursor-default"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#EF4444] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-[#EF4444] group-hover:text-white transition-all duration-200 shadow-xs group-hover:shadow-md group-hover:shadow-red-500/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#111827] dark:text-white group-hover:text-[#EF4444] transition-colors mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

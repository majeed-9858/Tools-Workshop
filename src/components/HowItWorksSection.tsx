import React from 'react';
import { UploadCloud, Cpu, Download } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: UploadCloud,
      title: 'Upload File',
      description:
        'Choose or drag your file directly from your computer or phone into the workshop workspace.',
    },
    {
      num: '02',
      icon: Cpu,
      title: 'Process Locally',
      description:
        'Tools Workshop processes the file in real-time, executing transformations, compressions, or conversions instantly.',
    },
    {
      num: '03',
      icon: Download,
      title: 'Download Result',
      description:
        'Download your finished result immediately with original fidelity preserved and zero unnecessary delays.',
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-[#0e0e12] border-b border-[#E5E7EB] dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EF4444] block mb-2">
            Seamless Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
            How Tools Workshop Works
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Three simple steps to transform, convert, and manage your documents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Subtle connecting horizontal line on desktop */}
          <div className="hidden md:block absolute top-1/3 left-1/6 right-1/6 h-0.5 border-t-2 border-dashed border-[#EF4444]/20 -z-0 pointer-events-none" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-gray-50/70 dark:bg-[#16181d] rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center group hover:border-[#EF4444]/40 card-hover-lift z-10"
              >
                {/* Natural editorial step indicator with hover bounce */}
                <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/40 text-[#EF4444] group-hover:bg-[#EF4444] group-hover:text-white font-mono text-xs font-bold flex items-center justify-center mb-4 transition-all duration-200 shadow-xs">
                  {step.num}
                </div>

                <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/40 text-[#EF4444] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-[#EF4444] group-hover:text-white transition-all duration-200 shadow-xs group-hover:shadow-md group-hover:shadow-red-500/20">
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#111827] dark:text-white group-hover:text-[#EF4444] transition-colors mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

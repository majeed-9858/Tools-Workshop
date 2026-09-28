import React from 'react';
import { ShieldCheck, HardDrive, Lock, Trash2 } from 'lucide-react';

export const PrivacySection: React.FC = () => {
  const points = [
    {
      icon: ShieldCheck,
      title: 'Browser-Native Execution',
      desc: 'Most operations run directly on your hardware via modern WebAssembly and Canvas APIs. Your files never leave your computer.',
    },
    {
      icon: HardDrive,
      title: 'Zero Permanent Storage',
      desc: 'Tools Workshop does not keep databases of uploaded media, PDFs, or user secrets. Files exist only in volatile RAM while you work.',
    },
    {
      icon: Lock,
      title: 'Strict Encryption & Decryption',
      desc: 'When locking or unlocking authorized documents, cryptographic keys are processed strictly within your local browser environment.',
    },
    {
      icon: Trash2,
      title: 'Automatic Session Cleanup',
      desc: 'As soon as you close your browser tab or click Process Another File, temporary memory buffers and object URLs are instantly revoked.',
    },
  ];

  return (
    <section className="py-16 bg-gray-50/50 dark:bg-[#0B0D13] border-b border-[#E5E7EB] dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-[#16181d] rounded-3xl p-8 sm:p-12 border border-[#E5E7EB] dark:border-gray-800 shadow-sm">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#EF4444] block mb-2">
              Privacy First Design
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
              Your Files Stay Your Files. Always.
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
              Unlike traditional cloud convert platforms that upload your sensitive contracts, photos, and spreadsheets to third-party data centers, Tools Workshop prioritizes private on-device execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {points.map((pt, i) => {
              const Icon = pt.icon;
              return (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#EF4444] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#111827] dark:text-white mb-1">
                      {pt.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      {pt.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

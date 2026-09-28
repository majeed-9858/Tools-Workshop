import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'What is Tools Workshop?',
      answer:
        'Tools Workshop is an all-in-one suite of modern online utilities for converting, merging, splitting, compressing, and transforming PDFs, images, documents, and developer code. It runs directly inside your browser for maximum speed and data privacy.',
    },
    {
      question: 'Is Tools Workshop free?',
      answer:
        'Yes, 100% free. There are no subscriptions, hidden limits, watermarks, or mandatory user accounts. You can use every tool as many times as you need.',
    },
    {
      question: 'What file formats are supported?',
      answer:
        'Tools Workshop supports PDF documents (.pdf), Word documents (.docx), text files (.txt, .md, .html), and all popular image formats including JPG/JPEG, PNG, and WebP, as well as JSON, XML, CSS, and CSV data.',
    },
    {
      question: 'How do I merge PDF files?',
      answer:
        'Click on "Merge PDF", select or drag 2 or more PDF documents into the upload area, arrange them in your desired order using the reorder buttons, and click "Merge PDF". Your unified PDF will be ready for download in seconds.',
    },
    {
      question: 'How do I convert JPG to PNG?',
      answer:
        'Select the "JPG to PNG" tool, drop your JPG image into the workspace, adjust quality settings if desired, and click "Convert Image". Your crystal-clear PNG with lossless encoding will download immediately.',
    },
    {
      question: 'Can I compress images?',
      answer:
        'Yes! The Image Compressor tool allows you to adjust compression quality from 20% to 100% and optionally scale maximum dimensions. You can see real-time comparisons of original file size, compressed size, and the exact percentage reduced.',
    },
    {
      question: 'Can I convert WebP to JPG?',
      answer:
        'Yes, select the "WebP to JPG" tool. Because JPG does not natively support transparency, our converter allows you to set any background color (default is pure white) and custom JPEG quality levels.',
    },
    {
      question: 'Are uploaded files stored?',
      answer:
        'No. All file processing is performed locally in your web browser session using client-side JavaScript, WebAssembly, and HTML5 Canvas. Your files are not saved to a remote server or persistent database.',
    },
    {
      question: 'What is the maximum file size?',
      answer:
        'Because processing takes place directly on your computer without slow server network uploads, you can comfortably process files up to 100 MB each depending on your device’s available memory.',
    },
    {
      question: 'Can I process multiple files?',
      answer:
        'Yes, multi-file batch processing is supported for tools like Merge PDF, JPG to PDF, PNG to PDF, and Image to PDF, where you can arrange, preview, and bundle multiple files simultaneously.',
    },
  ];

  return (
    <section id="faq-section" className="py-16 bg-white dark:bg-[#0e0e12] border-b border-[#E5E7EB] dark:border-gray-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EF4444] block mb-2">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Learn more about how Tools Workshop operates and how your data is protected.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-[#E5E7EB] dark:border-gray-800 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left bg-white dark:bg-[#16181d] hover:bg-gray-50/80 dark:hover:bg-[#1c1f26] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4444] cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-[#111827] dark:text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ml-4 ${
                      isOpen ? 'rotate-180 text-[#EF4444]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#12141a]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

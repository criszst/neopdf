import React from "react";
import { Search, FileText, Star, Download, ChevronLeft, ChevronRight } from "lucide-react";

interface PDFInterfacePreviewProps {
  className?: string;
}

const PDFInterfacePreview: React.FC<PDFInterfacePreviewProps> = ({ className }) => {
  return (
    <div className={"w-full min-w-xl overflow-hidden rounded-lg bg-[#0D0A1F]/90 text-white shadow-2xl"}>
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[#0D0A1F] px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-700">
            <FileText className="h-4 w-4" />
          </div>
          <span className="font-medium">NeoPDF</span>
        </div>
        <div className="relative flex-grow max-w-2xl mx-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <div className="w-full  rounded-full border border-white/20 bg-white/5 py-1.5 pl-10 pr-4">
            <span className="text-sm text-gray-400">Search documents...</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="sm:block hidden rounded-full bg-purple-700 px-4 py-1.5 text-sm font-medium">
            New PDF
          </button>
        </div>
      </div>

      {/* Main Interface */}
      <div className="flex h-[400px] md:flex">
        {/* Sidebar */}
        <div className="w-16  border-r border-white/10 bg-[#0D0A1F] p-2">
          <div className="flex flex-col items-center gap-6 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600/20">
              <FileText className="h-5 w-5 text-purple-400" />
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
              <Star className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
              <Download className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow">
          <div className="flex h-10 items-center justify-between border-b border-white/10 bg-[#0D0A1F]/70 px-4">
            <div className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4 text-gray-400" />
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400">Page 1 of 28</span>
              <div className="rounded bg-white/10 px-2 py-1 text-xs">
                100%
              </div>
            </div>
          </div>

          {/* Document Preview */}
          <div className="flex h-[360px] items-center justify-center bg-[#0D0A1F]/30 p-8">
            <div className="h-full w-full max-w-2xl rounded-lg bg-white shadow-lg">
              <div className="h-full w-full p-8">
                <div className="mb-6 h-8 w-3/4 rounded bg-gray-200"></div>
                <div className="mb-4 h-4 w-full rounded bg-gray-200"></div>
                <div className="mb-4 h-4 w-full rounded bg-gray-200"></div>
                <div className="mb-4 h-4 w-5/6 rounded bg-gray-200"></div>
                <div className="mb-8 h-4 w-full rounded bg-gray-200"></div>

                <div className="mb-4 h-32 w-full rounded bg-gray-100"></div>

                <div className="mb-4 h-4 w-full rounded bg-gray-200"></div>
                <div className="mb-4 h-4 w-full rounded bg-gray-200"></div>
                <div className="h-4 w-3/4 rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="sm:block hidden w-64 border-l border-white/10 bg-[#0D0A1F] p-4">
          <h3 className="mb-4 text-sm font-medium">Document Properties</h3>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-400">Name</p>
              <p className="text-sm">business-report-2024.pdf</p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Size</p>
              <p className="text-sm">2.4 MB</p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Created</p>
              <p className="text-sm">May 8, 2025</p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Pages</p>
              <p className="text-sm">28</p>
            </div>
          </div>

          <div className="mt-8">

            <button className="mb-2 w-full rounded bg-purple-700 py-2 text-sm font-medium">
              Download
            </button>
            
            <button className="w-full rounded bg-white/5 py-2 text-sm font-medium">
              Share
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default PDFInterfacePreview;
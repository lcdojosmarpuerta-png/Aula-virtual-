import React from 'react';
import { Phone } from 'lucide-react';

export const BottomBanner: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] no-print">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-1.5 sm:py-2 flex items-center justify-between gap-2 text-[11px] sm:text-xs">
        {/* Left side: Brand Logo & Credit text */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="h-6 sm:h-8 w-auto flex items-center bg-white rounded px-1 sm:px-1.5 py-0.5 border border-slate-100 shadow-2xs shrink-0">
            <img
              src="/assets/aistudio/1791899989619_db0f9485.jpg"
              alt="S&S Web Studio Logo"
              className="h-5 sm:h-6 w-auto object-contain"
            />
          </div>
          <div className="truncate text-slate-700">
            <span className="font-semibold text-slate-800">
              Creado por <span className="text-[#0284C7] font-bold">S&S Web Studio</span>
            </span>
          </div>
        </div>

        {/* Right side: Contact Phone & Link */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:04245104245"
            className="inline-flex items-center gap-1 sm:gap-1.5 font-bold text-slate-800 hover:text-[#0284C7] bg-slate-100/90 hover:bg-slate-200/80 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full transition-colors text-[10px] sm:text-xs"
          >
            <Phone className="w-3 h-3 text-[#0284C7]" />
            <span className="font-mono">0424-5104245</span>
          </a>
          <span className="hidden lg:inline text-[11px] text-slate-400">
            Ideas que conectan tu negocio al mundo.
          </span>
        </div>
      </div>
    </footer>
  );
};

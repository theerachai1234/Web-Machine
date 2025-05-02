// src/components/TopBar.tsx
import React from 'react';

export default function TopBar() {
  return (
    <header className="bg-[#eae5e2] text-white p-4 flex items-center justify-between">
      {/* โลโก้ */}
      <div className="flex items-center gap-2">
        <img src="/img/taobin.avif" alt="Logo" className="w-10 h-10" />
        <span className="text-xl font-semibold text-[#543b30]"> Machine Taobin </span>
      </div>
    </header>
  );
}
"use client";

import React from "react";
import { DesignLabTemplateId } from "@/types/design-lab";
import { DESIGN_TEMPLATES } from "@/lib/design-lab/templateData";

interface DesignLabModelSelectorProps {
  selectedTemplateId: DesignLabTemplateId;
  onSelectTemplate: (id: DesignLabTemplateId) => void;
}

export default function DesignLabModelSelector({
  selectedTemplateId,
  onSelectTemplate,
}: DesignLabModelSelectorProps) {
  const templates = Object.values(DESIGN_TEMPLATES);

  return (
    <aside className="w-full lg:w-72 xl:w-80 shrink-0 p-4 sm:p-5 flex flex-col gap-4 border-r border-white/[0.08] bg-[#0f1015]/80 backdrop-blur-xl z-20 overflow-y-auto custom-scrollbar select-none">
      <div className="flex items-center justify-between pb-1">
        <h2 className="text-sm font-bold text-white tracking-wide">
          Choose Template
        </h2>
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
          {templates.length} Available
        </span>
      </div>

      <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
        {templates.map((tpl) => {
          const isActive = selectedTemplateId === tpl.id;

          return (
            <button
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl.id)}
              className={`w-48 sm:w-56 lg:w-full shrink-0 flex items-center gap-3.5 p-3 rounded-2xl transition-all duration-300 text-left cursor-pointer border ${
                isActive
                  ? "bg-[#1f1915]/90 border-[#ff5500] shadow-[0_0_20px_rgba(255,85,0,0.22)] ring-1 ring-[#ff5500]/60"
                  : "bg-[#14161c]/80 hover:bg-[#1a1d24] border-white/[0.08] hover:border-white/20 text-gray-300"
              }`}
            >
              {/* Model Thumbnail Image */}
              <div className="w-16 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-black/50 border border-white/10 shrink-0 relative flex items-center justify-center">
                <img
                  src={tpl.imageUrl}
                  alt={tpl.name}
                  className="w-full h-full object-cover transform hover:scale-110 transition duration-300"
                  loading="lazy"
                />
                {isActive && (
                  <div className="absolute inset-0 bg-[#ff5500]/10 border border-[#ff5500]/40 rounded-xl" />
                )}
              </div>

              {/* Title & Subtitle */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3
                    className={`text-sm font-bold truncate transition ${
                      isActive ? "text-white" : "text-gray-200"
                    }`}
                  >
                    {tpl.name}
                  </h3>
                </div>

                <p className="text-xs text-gray-400 truncate mt-0.5 font-medium">
                  {tpl.subtitle}
                </p>

                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-gray-400">
                    {tpl.category}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Helpful Hint */}
      <div className="mt-auto hidden lg:block p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs text-gray-400 leading-relaxed">
        <p className="font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
          <span className="text-[#ff7733]">💡</span>
          <span>Parametric 3D CAD</span>
        </p>
        <p className="text-[11px] text-gray-400">
          Selected machine components are live-rendered with isolated parameters. Changes do not alter original repository CAD models.
        </p>
      </div>
    </aside>
  );
}

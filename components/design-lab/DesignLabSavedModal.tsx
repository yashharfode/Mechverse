"use client";

import React, { useState, useEffect } from "react";
import { FolderHeart, X, Trash2, Download, Copy, Play, Calendar } from "lucide-react";
import { DesignLabConfiguration } from "@/types/design-lab";
import { getSavedDesigns, deleteDesign, saveDesign, exportDesignJSON } from "@/lib/design-lab/designStorage";

interface DesignLabSavedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadConfig: (config: DesignLabConfiguration) => void;
  currentConfigId?: string;
}

export default function DesignLabSavedModal({
  isOpen,
  onClose,
  onLoadConfig,
  currentConfigId,
}: DesignLabSavedModalProps) {
  const [designs, setDesigns] = useState<DesignLabConfiguration[]>([]);

  useEffect(() => {
    if (isOpen) {
      setDesigns(getSavedDesigns());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteDesign(id);
    setDesigns(getSavedDesigns());
  };

  const handleDuplicate = (config: DesignLabConfiguration, e: React.MouseEvent) => {
    e.stopPropagation();
    const dup: DesignLabConfiguration = {
      ...config,
      id: undefined,
      name: `${config.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveDesign(dup);
    setDesigns(getSavedDesigns());
  };

  const handleExport = (config: DesignLabConfiguration, e: React.MouseEvent) => {
    e.stopPropagation();
    exportDesignJSON(config);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl border border-white/15 bg-[#0f1118] text-white shadow-2xl overflow-hidden my-auto max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0c0d12]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#ff5500]/20 border border-[#ff5500]/30 flex items-center justify-center text-[#ff7733]">
              <FolderHeart size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold">Saved Configurations</h2>
              <p className="text-xs text-gray-400">
                {designs.length} custom design{designs.length === 1 ? "" : "s"} stored in browser local storage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content List */}
        <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-3">
          {designs.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <FolderHeart size={36} className="text-gray-600 mx-auto stroke-1" />
              <p className="text-sm font-semibold text-gray-300">No saved designs yet</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Modify any machine template in Design Lab and click &quot;Save Design&quot; in the bottom right corner to persist your changes.
              </p>
            </div>
          ) : (
            designs.map((d) => {
              const isCurrent = d.id === currentConfigId;
              const dateStr = new Date(d.updatedAt || d.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={d.id}
                  onClick={() => {
                    onLoadConfig(d);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isCurrent
                      ? "bg-[#ff5500]/10 border-[#ff5500]/50 shadow-md"
                      : "bg-white/[0.03] hover:bg-white/[0.06] border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20 shadow"
                        style={{ backgroundColor: d.frameColor }}
                      />
                      <h3 className="text-sm font-bold text-white group-hover:text-[#ff7733] transition truncate">
                        {d.name}
                      </h3>
                      {isCurrent && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#ff5500]/20 text-[#ff7733] border border-[#ff5500]/30">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400">
                      <span className="capitalize font-mono text-[10px] bg-white/5 px-1.5 py-0.2 rounded border border-white/5">
                        {d.templateId.replace("-", " ")}
                      </span>
                      <span className="flex items-center gap-1 text-[10px]">
                        <Calendar size={10} />
                        <span>{dateStr}</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => handleExport(d, e)}
                      title="Download JSON"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
                    >
                      <Download size={13} />
                    </button>
                    <button
                      onClick={(e) => handleDuplicate(d, e)}
                      title="Duplicate Configuration"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
                    >
                      <Copy size={13} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(d.id!, e)}
                      title="Delete Saved Configuration"
                      className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition"
                    >
                      <Trash2 size={13} />
                    </button>
                    <div className="pl-1">
                      <div className="px-3 py-1.5 rounded-xl bg-[#ff5500] group-hover:brightness-110 text-white font-bold text-xs flex items-center gap-1 shadow">
                        <Play size={10} fill="currentColor" />
                        <span>Load</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

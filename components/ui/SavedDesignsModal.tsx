"use client";

import { AppTheme, SavedDesign } from "@/types/machine";
import { Bookmark, Calendar, Check, Play, Trash2, X } from "lucide-react";

interface SavedDesignsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedDesigns: SavedDesign[];
  onLoadDesign: (design: SavedDesign) => void;
  onDeleteDesign: (id: string) => void;
  theme?: AppTheme;
}

export default function SavedDesignsModal({
  isOpen,
  onClose,
  savedDesigns,
  onLoadDesign,
  onDeleteDesign,
  theme = "dark",
}: SavedDesignsModalProps) {
  if (!isOpen) return null;
  const isLight = theme === "light";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 ${
          isLight
            ? "border-slate-200 bg-white text-slate-900 shadow-slate-300/40"
            : "border-white/15 bg-[#111318] text-white"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between pb-4 border-b ${
            isLight ? "border-slate-200" : "border-white/10"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Bookmark size={18} />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                My Saved Designs
              </h3>
              <p className={`text-xs ${isLight ? "text-slate-500" : "text-gray-400"}`}>
                Configurations saved in your local browser garage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition ${
              isLight
                ? "text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Designs List */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
          {savedDesigns.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Bookmark size={32} className={`mx-auto ${isLight ? "text-slate-300" : "text-gray-600"}`} />
              <p className={`text-sm font-semibold ${isLight ? "text-slate-600" : "text-gray-400"}`}>
                No saved designs yet
              </p>
              <p className={`text-xs max-w-xs mx-auto ${isLight ? "text-slate-400" : "text-gray-500"}`}>
                Customize colors, rims, and body components in the Builder tab and click &quot;Save Design&quot;.
              </p>
            </div>
          ) : (
            savedDesigns.map((design) => (
              <div
                key={design.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition ${
                  isLight
                    ? "border-slate-200 bg-slate-50 hover:bg-slate-100/90 text-slate-900"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: design.settings.paintColor }}
                    />
                    <h4 className={`font-bold text-sm ${isLight ? "text-slate-900" : "text-white"}`}>
                      {design.name}
                    </h4>
                  </div>
                  <div
                    className={`flex items-center gap-2 text-[11px] ${
                      isLight ? "text-slate-500" : "text-gray-400"
                    }`}
                  >
                    <span
                      className={`uppercase font-mono text-[10px] px-1.5 py-0.5 rounded ${
                        isLight ? "bg-slate-200/80 text-slate-700" : "bg-white/5 text-gray-300"
                      }`}
                    >
                      {design.machineId}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(design.savedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onLoadDesign(design);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-md transition cursor-pointer"
                  >
                    <Play size={12} fill="white" />
                    <span>Apply</span>
                  </button>
                  <button
                    onClick={() => onDeleteDesign(design.id)}
                    title="Delete Design"
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      isLight
                        ? "text-slate-400 hover:text-red-500 hover:bg-red-50"
                        : "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                    }`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          className={`flex justify-end pt-2 border-t ${
            isLight ? "border-slate-200" : "border-white/10"
          }`}
        >
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              isLight
                ? "bg-slate-100 hover:bg-slate-200 text-slate-800"
                : "bg-white/10 hover:bg-white/15 text-white"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

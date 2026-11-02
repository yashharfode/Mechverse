"use client";

import React, { useState } from "react";
import {
  Sliders,
  Layers,
  RotateCcw,
  Save,
  Check,
  Eye,
  EyeOff,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { DesignLabConfiguration, DesignLabTemplate } from "@/types/design-lab";

interface DesignLabCustomizerPanelProps {
  template: DesignLabTemplate;
  config: DesignLabConfiguration;
  onChangeConfig: (newConfig: DesignLabConfiguration) => void;
  onReset: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

export default function DesignLabCustomizerPanel({
  template,
  config,
  onChangeConfig,
  onReset,
  onSave,
  isSaving = false,
}: DesignLabCustomizerPanelProps) {
  const [activeTab, setActiveTab] = useState<"customize" | "components">("customize");

  // Handle color change
  const handleColorSelect = (hex: string) => {
    onChangeConfig({
      ...config,
      frameColor: hex,
      updatedAt: new Date().toISOString(),
    });
  };

  // Handle motor change
  const handleMotorChange = (motorId: string) => {
    onChangeConfig({
      ...config,
      motorType: motorId,
      updatedAt: new Date().toISOString(),
    });
  };

  // Handle camera change
  const handleCameraChange = (cameraId: string) => {
    onChangeConfig({
      ...config,
      cameraType: cameraId,
      updatedAt: new Date().toISOString(),
    });
  };

  // Handle toggle options
  const handleOptionToggle = (optionKey: string) => {
    const current = !!config.options[optionKey];
    onChangeConfig({
      ...config,
      options: {
        ...config.options,
        [optionKey]: !current,
      },
      updatedAt: new Date().toISOString(),
    });
  };

  // Handle component hide/show toggle
  const handleComponentVisibility = (componentId: string) => {
    const isHidden = config.hiddenComponents.includes(componentId);
    const newHidden = isHidden
      ? config.hiddenComponents.filter((id) => id !== componentId)
      : [...config.hiddenComponents, componentId];

    onChangeConfig({
      ...config,
      hiddenComponents: newHidden,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <aside className="w-full lg:w-80 xl:w-96 shrink-0 p-4 sm:p-5 flex flex-col justify-between border-l border-white/[0.08] bg-[#0f1015]/80 backdrop-blur-xl z-20 overflow-y-auto custom-scrollbar select-none">
      <div className="space-y-6">
        {/* Two Top Level Tabs matching the screenshot: Customize / Components */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-black/40 border border-white/[0.08]">
          <button
            onClick={() => setActiveTab("customize")}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "customize"
                ? "bg-[#ff5500] text-white shadow-lg shadow-[#ff5500]/25"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Sliders size={14} />
            <span>Customize</span>
          </button>

          <button
            onClick={() => setActiveTab("components")}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "components"
                ? "bg-[#ff5500] text-white shadow-lg shadow-[#ff5500]/25"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Layers size={14} />
            <span>Components</span>
          </button>
        </div>

        {/* ================= TAB 1: CUSTOMIZE ================= */}
        {activeTab === "customize" ? (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Frame Color Swatches */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-gray-200 tracking-wide block">
                Frame Color
              </label>
              <div className="flex items-center gap-2.5 flex-wrap">
                {template.availableColors.map((color) => {
                  const isSelected = config.frameColor.toLowerCase() === color.hex.toLowerCase();
                  return (
                    <button
                      key={color.hex}
                      onClick={() => handleColorSelect(color.hex)}
                      title={color.name}
                      className={`w-9 h-9 rounded-xl transition-all transform active:scale-95 cursor-pointer relative flex items-center justify-center shadow-md ${
                        isSelected
                          ? "ring-2 ring-white ring-offset-2 ring-offset-[#0f1015] scale-105"
                          : "hover:scale-105 opacity-90 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && (
                        <Check
                          size={15}
                          className={color.hex === "#f8fafc" ? "text-black stroke-[3]" : "text-white stroke-[3]"}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Motor Selection */}
            {template.availableMotors.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-200 tracking-wide block">
                  Motor
                </label>
                <div className="relative">
                  <select
                    value={config.motorType}
                    onChange={(e) => handleMotorChange(e.target.value)}
                    className="w-full appearance-none bg-[#151720] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-[#ff5500] transition cursor-pointer pr-10"
                  >
                    {template.availableMotors.map((m) => (
                      <option key={m.id} value={m.id} className="bg-[#151720] text-white">
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
            )}

            {/* Camera Selection */}
            {template.availableCameras.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-200 tracking-wide block">
                  Camera
                </label>
                <div className="relative">
                  <select
                    value={config.cameraType}
                    onChange={(e) => handleCameraChange(e.target.value)}
                    className="w-full appearance-none bg-[#151720] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-[#ff5500] transition cursor-pointer pr-10"
                  >
                    {template.availableCameras.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#151720] text-white">
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
            )}

            {/* Options Toggle Switches */}
            {template.toggleOptions.length > 0 && (
              <div className="space-y-3 pt-1">
                <label className="text-xs font-bold text-gray-200 tracking-wide block">
                  Options
                </label>
                <div className="space-y-2.5">
                  {template.toggleOptions.map((opt) => {
                    const isChecked = !!config.options[opt.id];
                    return (
                      <div
                        key={opt.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{opt.icon}</span>
                          <span className="text-xs font-medium text-gray-200">
                            {opt.label}
                          </span>
                        </div>

                        {/* Interactive Pill Toggle */}
                        <button
                          type="button"
                          onClick={() => handleOptionToggle(opt.id)}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 ${
                            isChecked ? "bg-[#ff5500]" : "bg-white/20"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                              isChecked ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ================= TAB 2: COMPONENTS HIERARCHY ================= */
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-bold text-gray-200">
                Assembly Parts ({template.components.length})
              </span>
              <span className="text-[10px] font-mono text-gray-400">
                Click eye to toggle visibility
              </span>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto custom-scrollbar pr-0.5">
              {template.components.map((c) => {
                const isHidden = config.hiddenComponents.includes(c.id);
                return (
                  <div
                    key={c.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition ${
                      isHidden
                        ? "bg-black/30 border-white/5 opacity-50"
                        : "bg-white/[0.03] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <span className="text-xs font-medium text-gray-200 truncate block">
                        {c.name}
                      </span>
                      <span className="text-[9px] font-mono uppercase text-gray-500">
                        {c.category} {c.isOptional && "• Optional"}
                      </span>
                    </div>

                    <button
                      onClick={() => handleComponentVisibility(c.id)}
                      className={`p-1.5 rounded-lg border transition cursor-pointer ${
                        isHidden
                          ? "bg-white/5 border-white/10 text-gray-500 hover:text-white"
                          : "bg-[#ff5500]/15 border-[#ff5500]/30 text-[#ff7733]"
                      }`}
                      title={isHidden ? "Show Component" : "Hide Component"}
                    >
                      {isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ================= BOTTOM ACTION BUTTONS MATCHING SCREENSHOT ================= */}
      <div className="pt-6 mt-6 border-t border-white/[0.08] flex items-center gap-3">
        {/* Reset Button */}
        <button
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-bold text-xs transition cursor-pointer shadow-sm active:scale-95"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>

        {/* Save Design Button */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-bold text-xs transition cursor-pointer shadow-lg shadow-[#ff5500]/25 active:scale-95 disabled:opacity-50"
        >
          <Save size={14} />
          <span>{isSaving ? "Saving..." : "Save Design"}</span>
        </button>
      </div>
    </aside>
  );
}

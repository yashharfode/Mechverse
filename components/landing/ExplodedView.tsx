"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Layers, Disc, Cpu, Compass, Zap, Shield, BatteryCharging, ArrowRight } from "lucide-react";
import { AppTheme, MachineId } from "@/types/machine";
import { TOKENS } from "@/constants/designTokens";

interface ExplodedViewProps {
  onLaunchStudio: (machineId: MachineId) => void;
  theme?: AppTheme;
}

interface AssemblyLayer {
  id: string;
  name: string;
  description: string;
  layerTag: string;
  icon: React.ElementType;
}

const SUB_ASSEMBLIES: AssemblyLayer[] = [
  {
    id: "props",
    name: "55mm Micro Propellers",
    description: "High-efficiency, low-noise props",
    layerTag: "LAYER 06 • TOP",
    icon: Disc,
  },
  {
    id: "esp32",
    name: "ESP32-WROOM Controller",
    description: "Flight control, Wi-Fi & telemetry",
    layerTag: "LAYER 05 • CONTROL",
    icon: Cpu,
  },
  {
    id: "imu",
    name: "MPU-6050 6-DOF IMU",
    description: "Gyro + Accelerometer [I²C]",
    layerTag: "LAYER 04 • SENSOR",
    icon: Compass,
  },
  {
    id: "motors",
    name: "4× 8520 Coreless Motors",
    description: "8.5×20mm, 37,000 RPM (3.7V)",
    layerTag: "LAYER 03 • DRIVE",
    icon: Zap,
  },
  {
    id: "frame",
    name: "Polycarbonate Airframe",
    description: "Lightweight, durable (2.5mm)",
    layerTag: "LAYER 02 • FRAME",
    icon: Shield,
  },
  {
    id: "battery",
    name: "1S 500mAh LiPo",
    description: "3.7V • 25C • JST-PH",
    layerTag: "LAYER 01 • BOTTOM",
    icon: BatteryCharging,
  },
];

export default function ExplodedView({ onLaunchStudio, theme = "dark" }: ExplodedViewProps) {
  const isLight = theme === "light";
  const [activePreset, setActivePreset] = useState<string>("Full Explosion");
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);

  const presets = [
    { label: "Assembled", level: 0 },
    { label: "Airframe", level: 35 },
    { label: "Avionics", level: 65 },
    { label: "Full Explosion", level: 100 },
  ];

  return (
    <section
      id="exploded"
      className={`relative w-full py-16 sm:py-24 px-4 sm:px-6 md:px-12 border-t overflow-hidden transition-colors duration-300 ${
        isLight ? "border-slate-200 bg-[#f8fafc]" : "border-white/5 bg-[#060709]"
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${
                isLight ? "border-orange-500/25 bg-orange-50/80" : "border-orange-500/25 bg-[#0F1114]"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
              <span
                className={`text-[11px] font-mono tracking-widest uppercase font-semibold ${
                  isLight ? "text-slate-600" : "text-[#9AA0A9]"
                }`}
              >
                CAD EXPLORATION
              </span>
            </div>
            <h2
              className={`text-2xl sm:text-4xl md:text-5xl font-light tracking-tight ${
                isLight ? "text-slate-900" : "text-[#F4F5F7]"
              }`}
            >
              Interactive CAD{" "}
              <span className="font-semibold text-[#FF6A1A]">Explosion</span>.
            </h2>
            <p
              className={`text-xs sm:text-sm max-w-xl leading-relaxed ${
                isLight ? "text-slate-600" : "text-[#9AA0A9]"
              }`}
            >
              Inspect every mechanical layer and electronic surface. Explore how each component assembles into a working machine.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {presets.map((preset) => {
              const isActive = activePreset === preset.label;
              return (
                <button
                  key={preset.label}
                  onClick={() => setActivePreset(preset.label)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-150 cursor-pointer ${
                    isActive
                      ? isLight
                        ? "bg-[#FF6A1A] text-white border border-[#FF6A1A] shadow-sm font-semibold"
                        : "bg-[#161A22] text-white border border-white/30 shadow-sm"
                      : isLight
                      ? "bg-white text-slate-700 border border-slate-300 hover:text-slate-950 hover:border-slate-400"
                      : "bg-[#0B0D12] text-[#9AA0A9] border border-white/10 hover:text-white hover:border-white/20"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Column: High-Res Exploded CAD Viewport */}
          <div
            className={`lg:col-span-8 rounded-2xl border overflow-hidden relative min-h-[420px] sm:min-h-[540px] flex flex-col ${
              isLight
                ? "border-slate-200 bg-white shadow-xl shadow-slate-200/50"
                : "border-white/10 bg-[#08090C] shadow-2xl"
            }`}
          >
            {/* Top Left Badge */}
            <div
              className={`absolute top-4 left-4 z-20 flex items-center gap-2 backdrop-blur-md px-3.5 py-1.5 rounded-full border ${
                isLight
                  ? "bg-white/90 border-slate-200 text-slate-800 shadow-sm"
                  : "bg-[#0B0D12]/90 border-white/10 text-[#E2E8F0]"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span className="text-[10px] sm:text-xs font-mono tracking-wider uppercase font-semibold">
                CAD EXPLODED VIEW • AERO-450
              </span>
            </div>

            {/* Exploded Render Image */}
            <div className="relative w-full h-full min-h-[420px] sm:min-h-[540px]">
              <Image
                src="/images/landing/exploded-aero450.jpg"
                alt="CAD Exploded View AERO-450"
                fill
                priority
                className={`object-cover object-center transition-all duration-700 select-none ${
                  activePreset === "Assembled"
                    ? "scale-95 filter brightness-90"
                    : activePreset === "Airframe"
                    ? "scale-100"
                    : activePreset === "Avionics"
                    ? "scale-105"
                    : "scale-100"
                }`}
              />

              {/* Dynamic Preset Overlay Badge */}
              <div className="absolute bottom-4 left-4 sm:left-6 z-20 flex items-center gap-3">
                <div
                  className={`px-3 py-1 rounded-full backdrop-blur-md border text-[10px] font-mono ${
                    isLight
                      ? "bg-white/90 border-slate-200 text-slate-700 shadow-sm"
                      : "bg-[#07090E]/85 border-white/10 text-neutral-300"
                  }`}
                >
                  SEPARATION:{" "}
                  <span className="text-[#FF6A1A] font-bold">
                    {activePreset === "Assembled"
                      ? "0% (LOCKED)"
                      : activePreset === "Airframe"
                      ? "35% (CHASSIS)"
                      : activePreset === "Avionics"
                      ? "65% (STACK)"
                      : "100% (FULL)"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 6 Sub-Assembly Layer Cards */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-3">
            <div
              className={`text-[11px] font-mono tracking-wider uppercase font-semibold ${
                isLight ? "text-slate-500" : "text-[#7B828F]"
              }`}
            >
              DISASSEMBLED SUB-ASSEMBLIES
            </div>

            <div className="flex flex-col gap-2">
              {SUB_ASSEMBLIES.map((layer) => {
                const IconComponent = layer.icon;
                const isHighlighted = selectedLayer === layer.id;

                return (
                  <div
                    key={layer.id}
                    onClick={() => setSelectedLayer(isHighlighted ? null : layer.id)}
                    className={`p-3 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 ${
                      isHighlighted
                        ? isLight
                          ? "bg-orange-50/80 border-orange-500/50 shadow-md"
                          : "bg-[#141822] border-orange-500/50 shadow-md"
                        : isLight
                        ? "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 shadow-sm"
                        : "bg-[#0A0D12] border-white/5 hover:border-white/15 hover:bg-[#0E121A]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 text-[#FF6A1A] ${
                          isLight ? "bg-orange-50 border-orange-200" : "bg-[#141820] border-white/10"
                        }`}
                      >
                        <IconComponent size={16} />
                      </div>
                      <div className="min-w-0">
                        <div
                          className={`text-xs font-semibold truncate ${
                            isLight ? "text-slate-900" : "text-[#F4F5F7]"
                          }`}
                        >
                          {layer.name}
                        </div>
                        <div
                          className={`text-[10px] truncate mt-0.5 ${
                            isLight ? "text-slate-500" : "text-[#7B828F]"
                          }`}
                        >
                          {layer.description}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`shrink-0 px-2.5 py-1 rounded-md border text-[9px] font-mono tracking-wider uppercase font-medium ${
                        isLight
                          ? "bg-slate-100 border-slate-200 text-slate-600"
                          : "bg-[#121620] border-white/10 text-[#A0A6B2]"
                      }`}
                    >
                      {layer.layerTag}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onLaunchStudio("aero-450")}
              className={`w-full py-3 rounded-xl border text-xs font-mono font-semibold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer uppercase mt-2 ${
                isLight
                  ? "border-slate-300 bg-white hover:bg-slate-100 text-slate-800 shadow-sm"
                  : "border-white/10 bg-[#0F1218] hover:bg-[#161C26] hover:border-orange-500/40 text-white"
              }`}
            >
              <span>INSPECT IN 3D STUDIO</span>
              <ArrowRight size={14} className="text-[#FF6A1A]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { TOKENS } from "@/constants/designTokens";
import { AppTheme, MachineId } from "@/types/machine";

interface CTAProps {
  onLaunchStudio: (machineId?: MachineId) => void;
  theme?: AppTheme;
}

export default function CTA({ onLaunchStudio, theme = "dark" }: CTAProps) {
  const isLight = theme === "light";

  return (
    <section
      className={`relative w-full py-20 sm:py-28 px-4 sm:px-6 md:px-12 border-t overflow-hidden text-center transition-colors duration-300 ${
        isLight ? "border-slate-200 bg-[#f8fafc]" : "border-white/10 bg-[#07080A]"
      }`}
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(255,106,26,0.08) 0%, transparent 65%)`,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center space-y-6 sm:space-y-8">
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-md ${
            isLight ? "border-orange-500/25 bg-orange-50/80 text-slate-700 font-medium" : "border-orange-500/30 bg-[#0F1114]/90 text-[#9AA0A9]"
          }`}
        >
          <Sparkles size={12} className="text-[#FF6A1A] animate-pulse" />
          <span className="text-[11px] font-mono-tech tracking-widest uppercase">
            Start Engineering
          </span>
        </div>

        <h2
          className={`text-3xl sm:text-5xl md:text-6xl font-light tracking-tight max-w-2xl ${
            isLight ? "text-slate-900" : "text-[#F4F5F7]"
          }`}
        >
          Build Real Machines{" "}
          <span className="font-semibold text-[#FF6A1A]">
            Beyond Ordinary
          </span>
          .
        </h2>

        <p
          className={`text-xs sm:text-base max-w-xl leading-relaxed ${
            isLight ? "text-slate-600" : "text-slate-400"
          }`}
        >
          Select any machine, inspect its complete internal 3D assembly, run 400Hz physics, and follow step-by-step
          build tutorials with verified Indian supplier BOMs from just ₹1,955.
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-3xl pt-2">
          {[
            { label: "8+ MACHINES", sub: "Drones & Robotics" },
            { label: "₹1,955 ENTRY", sub: "Verified Indian BOM" },
            { label: "400Hz SIM", sub: "Flight Physics Loop" },
            { label: "ZERO-APP AR", sub: "In-Browser WebAR" },
          ].map((stat, i) => (
            <div
              key={i}
              className={`p-3 sm:p-4 rounded-xl border flex flex-col items-center text-center ${
                isLight
                  ? "border-slate-200 bg-white shadow-md shadow-slate-200/50"
                  : "border-white/10 bg-[#0F1114]/80 backdrop-blur-md shadow-lg"
              }`}
            >
              <span
                className={`text-xs sm:text-sm font-mono font-bold tracking-wider ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                {stat.label}
              </span>
              <span
                className={`text-[10px] sm:text-[11px] font-mono mt-0.5 ${
                  isLight ? "text-slate-500" : "text-[#9AA0A9]"
                }`}
              >
                {stat.sub}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => onLaunchStudio()}
            className="w-full sm:w-auto justify-center px-8 py-4 rounded-xl text-xs font-mono-tech font-semibold tracking-wider text-white flex items-center gap-2.5 transition-all transform active:scale-95 cursor-pointer uppercase shadow-2xl hover:brightness-110"
            style={{
              backgroundColor: TOKENS.colors.accent,
              boxShadow: `0 0 30px ${TOKENS.colors.accentGlow}`,
            }}
          >
            <span>Launch Mechverse Studio</span>
            <ArrowRight size={15} />
          </button>

          <a
            href="#catalog"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className={`w-full sm:w-auto justify-center px-6 py-4 rounded-xl text-xs font-mono-tech font-medium tracking-wider flex items-center gap-2 transition-all cursor-pointer uppercase border ${
              isLight
                ? "border-slate-300 bg-white hover:bg-slate-100 text-slate-800 shadow-sm"
                : "border-white/10 bg-[#0F1114] hover:bg-[#161A1F] hover:border-white/30 text-slate-300 hover:text-white"
            }`}
          >
            <span>Browse All 8 Machines</span>
          </a>
        </div>
      </div>
    </section>
  );
}

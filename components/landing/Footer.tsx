"use client";

import React from "react";
import { TOKENS } from "@/constants/designTokens";
import { AppTheme, MachineId } from "@/types/machine";

interface FooterProps {
  onLaunchStudio: (machineId?: MachineId) => void;
  theme?: AppTheme;
}

export default function Footer({ onLaunchStudio, theme = "dark" }: FooterProps) {
  const isLight = theme === "light";

  return (
    <footer
      className={`w-full border-t py-8 sm:py-12 px-4 sm:px-6 md:px-12 text-xs font-mono transition-colors duration-300 ${
        isLight
          ? "border-slate-200 bg-white text-slate-600"
          : "border-white/5 bg-[#07080A] text-[#9AA0A9]"
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Tagline */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3 text-center sm:text-left">
          <div
            className="w-6 h-6 rounded flex items-center justify-center text-white font-black text-sm italic shrink-0 shadow-sm"
            style={{ backgroundColor: TOKENS.colors.accent }}
          >
            M
          </div>
          <span className={`font-semibold tracking-wider ${isLight ? "text-slate-900" : "text-white"}`}>
            MECHVERSE
          </span>
          <span className={`hidden sm:inline ${isLight ? "text-slate-400" : "text-[#5C626B]"}`}>·</span>
          <span className={`text-[11px] sm:text-xs ${isLight ? "text-slate-500" : "text-[#5C626B]"}`}>
            3D Engineering & Hardware Simulation
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] sm:text-xs">
          <a
            href="#hero"
            className={`transition-colors ${isLight ? "hover:text-slate-950" : "hover:text-white"}`}
          >
            Top
          </a>
          <a
            href="#showcase"
            className={`transition-colors ${isLight ? "hover:text-slate-950" : "hover:text-white"}`}
          >
            Showcase
          </a>
          <a
            href="#reveal"
            className={`transition-colors ${isLight ? "hover:text-slate-950" : "hover:text-white"}`}
          >
            Reveal
          </a>
          <a
            href="#exploded"
            className={`transition-colors ${isLight ? "hover:text-slate-950" : "hover:text-white"}`}
          >
            CAD Exploded
          </a>
          <a
            href="#catalog"
            className={`transition-colors ${isLight ? "hover:text-slate-950" : "hover:text-white"}`}
          >
            Catalog
          </a>
          <button
            onClick={() => onLaunchStudio()}
            className="hover:text-[#FF6A1A] transition-colors cursor-pointer text-left"
          >
            Studio
          </button>
          <a
            href="https://github.com/yashharfode/Mechverse"
            target="_blank"
            rel="noreferrer"
            className={`transition-colors ${isLight ? "hover:text-slate-950" : "hover:text-white"}`}
          >
            GitHub
          </a>
          <a
            href="https://github.com/yashharfode/Mechverse/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer"
            className={`transition-colors ${isLight ? "hover:text-slate-950" : "hover:text-white"}`}
          >
            License
          </a>
        </div>

        {/* Copyright */}
        <div className={isLight ? "text-slate-500" : "text-[#5C626B]"}>
          © 2026 Yash. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

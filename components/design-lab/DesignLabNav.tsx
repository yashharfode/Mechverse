"use client";

import React from "react";
import Link from "next/link";
import { FolderHeart, Download, User } from "lucide-react";

interface DesignLabNavProps {
  onOpenSavedModal: () => void;
  onExportJSON: () => void;
  savedCount: number;
}

export default function DesignLabNav({
  onOpenSavedModal,
  onExportJSON,
  savedCount,
}: DesignLabNavProps) {
  return (
    <header className="h-16 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0c0d11]/90 backdrop-blur-xl flex items-center justify-between shrink-0 z-40 select-none">
      {/* Brand & Section Indicator */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          {/* Orange Modern M Logo */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ff5500] to-[#ff7733] flex items-center justify-center text-white shadow-lg shadow-[#ff5500]/25 group-hover:scale-105 transition">
            <svg width="18" height="15" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0 24L7.5 0H12.5L14 7L15.5 0H20.5L28 24H21.5L17.5 9L15 20H13L10.5 9L6.5 24H0Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="font-extrabold tracking-[0.16em] text-sm sm:text-base text-white uppercase">
            MECHVERSE
          </span>
        </Link>

        <div className="h-4 w-px bg-white/20 ml-1" />

        <span className="text-sm font-semibold tracking-wide text-[#ff7733] pl-1">
          Design Lab
        </span>
      </div>

      {/* Nav Navigation Links & Action Buttons */}
      <div className="flex items-center gap-3 sm:gap-6 text-xs font-medium">
        <Link
          href="/"
          className="text-gray-400 hover:text-white transition tracking-wider hidden md:block"
        >
          Explore
        </Link>

        <Link
          href="/#catalog"
          className="text-gray-400 hover:text-white transition tracking-wider hidden md:block"
        >
          Catalog
        </Link>

        {/* Active Design Lab Pill */}
        <div className="px-3.5 py-1.5 rounded-full bg-[#ff5500]/15 border border-[#ff5500]/40 text-[#ff7733] font-bold tracking-wider shadow-sm shadow-[#ff5500]/20 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500] animate-pulse" />
          <span>Design Lab</span>
        </div>

        {/* My Saved Designs Action */}
        <button
          onClick={onOpenSavedModal}
          title="Open Saved Configurations"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition cursor-pointer text-xs"
        >
          <FolderHeart size={13} className="text-[#ff7733]" />
          <span className="hidden sm:inline">Saved</span>
          {savedCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#ff5500]/20 text-[#ff7733] font-bold text-[10px]">
              {savedCount}
            </span>
          )}
        </button>

        {/* Export JSON Action */}
        <button
          onClick={onExportJSON}
          title="Export Design Configuration as JSON"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition cursor-pointer text-xs"
        >
          <Download size={13} className="text-gray-400" />
          <span>Export JSON</span>
        </button>

        {/* User Avatar Circle */}
        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-gray-300 shrink-0">
          <User size={15} />
        </div>
      </div>
    </header>
  );
}

"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  CarFront,
  Fan,
  Bot,
  RotateCcw,
  Bookmark,
  Sparkles,
  Swords,
  Plane,
  Hexagon,
  Smartphone,
  Sun,
  Moon,
  Camera,
  Crosshair,
  ChevronDown,
  Layers,
  Check,
  Compass,
  Wrench,
  Grid,
  Cable,
  X,
  ExternalLink,
  Sliders,
} from "lucide-react";
import { MachineId, AppTheme } from "@/types/machine";
import { isModelVisible } from "@/constants/modelVisibility";

interface NavbarProps {
  currentTab: "landing" | "home" | "explore" | "builder";
  setCurrentTab: (tab: "landing" | "home" | "explore" | "builder") => void;
  selectedMachineId: MachineId;
  onSelectMachine: (id: MachineId) => void;
  onReset: () => void;
  onOpenSavedDesigns: () => void;
  savedCount: number;
  theme?: AppTheme;
  onToggleTheme?: () => void;
  onOpenAR?: () => void;
}

interface ProjectLibraryItem {
  id: MachineId;
  name: string;
  category: string;
  badge: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accentColor: string;
  imageUrl: string;
  specs: string;
}

const PROJECT_LIBRARY: ProjectLibraryItem[] = [
  {
    id: "robo-racer",
    name: "Robo-Racer Bot",
    category: "AI Autonomous Rover (SolidWorks CAD)",
    badge: "₹2,888",
    icon: Crosshair,
    accentColor: "from-orange-500 to-amber-500",
    imageUrl: "/images/models/robo-racer.jpg",
    specs: "ESP32 Rover • Dual N20 • LiDAR CAD",
  },
  {
    id: "esp32-drone",
    name: "AERO-ESP Drone",
    category: "Smartphone Wi-Fi Quadcopter",
    badge: "₹1,955",
    icon: Smartphone,
    accentColor: "from-amber-500 to-orange-500",
    imageUrl: "/images/models/esp32-drone.jpg",
    specs: "56g Nano Quad • ESP32 SoftAP • 8520 Coreless",
  },
  {
    id: "drone-b",
    name: "Drone-B Octocopter",
    category: "Industrial Heavy Multi-Rotor",
    badge: "CAD ASSET",
    icon: Hexagon,
    accentColor: "from-indigo-500 to-purple-500",
    imageUrl: "/images/models/drone-b.jpg",
    specs: "Coaxial Carbon Hull • 400Hz Flight Avionics",
  },
  {
    id: "aero-450",
    name: "AERO-450 Drone",
    category: "Modular Pixhawk Quadcopter",
    badge: "APM 2.8",
    icon: Plane,
    accentColor: "from-emerald-500 to-teal-500",
    imageUrl: "/images/models/aero-450.jpg",
    specs: "APM 2.8 / Pixhawk • 2212 920KV • 3S 2200mAh",
  },
  {
    id: "robo-rumble",
    name: "Robo Rumble",
    category: "Combat Battle Robot Arena",
    badge: "4WD ARENA",
    icon: Swords,
    accentColor: "from-rose-500 to-red-600",
    imageUrl: "/images/models/robo-rumble.jpg",
    specs: "1.5kg Beetleweight • 4WD Ramp • Impact Ready",
  },
  {
    id: "sports-car",
    name: "Apex GT Supercar",
    category: "Twin-Turbo V6 Engine CAD",
    badge: "AUTOMOTIVE",
    icon: CarFront,
    accentColor: "from-red-600 to-orange-600",
    imageUrl: "/images/models/sports-car.jpg",
    specs: "Twin-Turbo V6 • Carbon Chassis • Aero Diffuser",
  },
  {
    id: "walking-robot",
    name: "Walking Robot",
    category: "Mechanical Leg Linkage",
    badge: "BIOMIMETIC",
    icon: Bot,
    accentColor: "from-yellow-500 to-amber-600",
    imageUrl: "/images/models/walking-robot.jpg",
    specs: "Theo Jansen 8-Leg Mechanism • 3V DC Geared",
  },
  {
    id: "electric-fan",
    name: "Electric Fan",
    category: "Aerodynamic Table Fan & Fluid",
    badge: "FLUID DYNAMICS",
    icon: Fan,
    accentColor: "from-sky-500 to-blue-600",
    imageUrl: "/images/models/electric-fan.jpg",
    specs: "3-Blade Aero Rotor • 3-Speed AC Induction Motor",
  },
  {
    id: "ropeway-robot",
    name: "Ropeway Robot",
    category: "Cable Inspection Climber",
    badge: "ROPEWAY CAD",
    icon: Cable,
    accentColor: "from-sky-500 to-indigo-600",
    imageUrl: "/images/models/ropeway-robot.jpg",
    specs: "Moving Arms • Cable Inspection • 12V 100RPM Geared",
  },
];

export default function Navbar({
  currentTab,
  setCurrentTab,
  selectedMachineId,
  onSelectMachine,
  onReset,
  onOpenSavedDesigns,
  savedCount,
  theme = "dark",
  onToggleTheme,
  onOpenAR,
}: NavbarProps) {
  const isLight = theme === "light";
  const [isProjectsOpen, setIsProjectsOpen] = useState<boolean>(false);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Active Project Data (Filter by visibility)
  const visibleProjectLibrary = PROJECT_LIBRARY.filter((p) => isModelVisible(p.id));
  const activeProject =
    visibleProjectLibrary.find((p) => p.id === selectedMachineId) || visibleProjectLibrary[0];
  const ActiveIcon = activeProject.icon;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProjectsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header
      className={`h-14 sm:h-16 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-50 transition-colors duration-300 backdrop-blur-md ${
        isLight
          ? "bg-white/95 border-b border-gray-200 shadow-sm"
          : "bg-[#0a0c10]/95 border-b border-white/10"
      }`}
    >
      {/* ================= LEFT: BRAND LOGO ================= */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <button
          onClick={() => setCurrentTab("landing")}
          className="flex items-center gap-2 sm:gap-3 text-left group cursor-pointer"
        >
          <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-xl p-1.5 sm:p-2 text-white shadow-lg shadow-red-600/20 group-hover:scale-105 transition shrink-0">
            <CarFront size={18} className="sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span
                className={`font-black tracking-wider text-sm sm:text-base transition ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                MECHVERSE
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 hidden md:inline-block">
                STUDIO
              </span>
            </div>
            <p
              className={`text-[8px] sm:text-[9px] tracking-wider uppercase hidden sm:block ${
                isLight ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Interactive 3D Engineering
            </p>
          </div>
        </button>

        {/* ================= PROJECTS / LIBRARY DROPDOWN TRIGGER ================= */}
        <div ref={dropdownRef} className="relative flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setIsProjectsOpen((prev) => !prev)}
            aria-expanded={isProjectsOpen}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border transition shadow-sm cursor-pointer ${
              isProjectsOpen
                ? "border-orange-500 bg-orange-500/10 text-orange-400"
                : isLight
                ? "bg-gray-100 hover:bg-gray-200/80 border-gray-300 text-gray-800"
                : "bg-white/5 hover:bg-white/10 border-white/15 text-white"
            }`}
          >
            <div className="w-5 h-5 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
              <ActiveIcon size={12} />
            </div>

            <div className="text-left flex items-center gap-1.5">
              <span className="text-xs font-bold whitespace-nowrap max-w-[90px] sm:max-w-[130px] truncate">
                {activeProject.name}
              </span>
              <span className="hidden lg:inline-block text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/30 border border-white/10 text-gray-400">
                {activeProject.badge}
              </span>
            </div>

            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform duration-200 shrink-0 ${
                isProjectsOpen ? "rotate-180 text-orange-400" : ""
              }`}
            />
          </button>

          {/* ================= VIEW CATALOG QUICK-LAUNCH BUTTON ================= */}
          <button
            onClick={() => setIsCatalogModalOpen(true)}
            title="View Visual Catalog of all 9 Models with Images & Specifications"
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border transition shadow-sm cursor-pointer text-xs font-bold ${
              isLight
                ? "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800"
                : "bg-white/5 hover:bg-white/10 border-white/15 text-white"
            }`}
          >
            <Grid size={13} className="text-orange-400 shrink-0" />
            <span className="hidden md:inline">View Catalog</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">
              {visibleProjectLibrary.length}
            </span>
          </button>

          {/* ================= CONSOLIDATED PROJECTS DROPDOWN MENU (100% OPAQUE SOLID HIGH-CONTRAST) ================= */}
          {isProjectsOpen && (
            <div
              className={`absolute left-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border p-2.5 z-[9999] animate-in fade-in slide-in-from-top-2 duration-150 ${
                isLight
                  ? "bg-white border-slate-300 shadow-[0_25px_60px_rgba(0,0,0,0.2)] text-slate-900"
                  : "bg-[#0d111a] border-slate-700 shadow-[0_30px_70px_rgba(0,0,0,0.95)] text-white"
              }`}
            >
              {/* Dropdown Header */}
              <div
                className={`px-3 py-2 rounded-xl border mb-2 flex items-center justify-between ${
                  isLight ? "bg-slate-100 border-slate-200" : "bg-[#070911] border-white/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-gray-400">
                    Project Library ({visibleProjectLibrary.length} Machines)
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsCatalogModalOpen(true);
                    setIsProjectsOpen(false);
                  }}
                  className="text-[10px] font-mono text-orange-400 hover:text-orange-300 font-bold bg-orange-500/10 hover:bg-orange-500/20 px-2 py-0.5 rounded border border-orange-500/20 transition flex items-center gap-1 cursor-pointer"
                >
                  <Grid size={10} />
                  <span>Grid View</span>
                </button>
              </div>

              {/* Machine Items List */}
              <div className="max-h-[380px] overflow-y-auto custom-scrollbar space-y-1.5 py-1 pr-0.5">
                {visibleProjectLibrary.map((item) => {
                  const ItemIcon = item.icon;
                  const isSelected = selectedMachineId === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectMachine(item.id);
                        setIsProjectsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl transition text-left cursor-pointer group border ${
                        isSelected
                          ? isLight
                            ? "bg-orange-50 border-orange-500 text-slate-950 shadow-sm"
                            : "bg-[#251b14] border-orange-500 text-white shadow-lg shadow-orange-500/10"
                          : isLight
                          ? "bg-slate-50 hover:bg-slate-100/90 border-slate-200 text-slate-800"
                          : "bg-[#151926] hover:bg-[#1e2538] border-slate-800 hover:border-orange-500/40 text-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Visual Thumbnail */}
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-black/40 relative">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            loading="lazy"
                          />
                        </div>

                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold truncate block group-hover:text-orange-400 transition">
                              {item.name}
                            </span>
                            <span
                              className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border shrink-0 ${
                                isLight
                                  ? "bg-amber-100 text-amber-800 border-amber-300"
                                  : "bg-black/70 text-amber-300 border-amber-500/30"
                              }`}
                            >
                              {item.badge}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] block truncate font-medium ${
                              isLight ? "text-slate-600" : "text-slate-300"
                            }`}
                          >
                            {item.category}
                          </span>
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-orange-500/20 border border-orange-500 flex items-center justify-center shrink-0 ml-1.5">
                          <Check size={12} className="text-orange-400 stroke-[3]" />
                        </div>
                      ) : (
                        <ChevronDown
                          size={13}
                          className="text-gray-500 opacity-0 group-hover:opacity-100 -rotate-90 transition shrink-0 ml-1.5"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Secondary Navigation Footer within Library Dropdown */}
              <div
                className={`pt-2.5 mt-2 border-t grid grid-cols-2 gap-2 ${
                  isLight ? "border-slate-200" : "border-white/10"
                }`}
              >
                <button
                  onClick={() => {
                    setIsCatalogModalOpen(true);
                    setIsProjectsOpen(false);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                    isLight
                      ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
                      : "bg-[#151926] hover:bg-[#1e2538] text-slate-200 hover:text-white border-slate-800"
                  }`}
                >
                  <Grid size={13} className="text-orange-400" />
                  <span>Visual Catalog</span>
                </button>

                <button
                  onClick={() => {
                    onOpenSavedDesigns();
                    setIsProjectsOpen(false);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                    isLight
                      ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
                      : "bg-[#151926] hover:bg-[#1e2538] text-slate-200 hover:text-white border-slate-800"
                  }`}
                >
                  <Bookmark size={13} className="text-orange-400" />
                  <span>Saved ({savedCount})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= CENTER: ESSENTIAL CONTROLS (SIMULATOR & BUILDER) ================= */}
      <nav className="flex items-center gap-1 sm:gap-1.5 bg-black/20 p-1 rounded-xl border border-white/10">
        <button
          onClick={() => setCurrentTab("explore")}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            currentTab === "explore"
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-md shadow-orange-500/20"
              : isLight
              ? "text-gray-600 hover:text-black hover:bg-gray-200/60"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Compass size={14} />
          <span>Simulator</span>
        </button>

        <button
          onClick={() => setCurrentTab("builder")}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            currentTab === "builder"
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-md shadow-orange-500/20"
              : isLight
              ? "text-gray-600 hover:text-black hover:bg-gray-200/60"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Wrench size={14} />
          <span>Builder</span>
        </button>

        <a
          href="/design-lab"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition text-[#ff5500] hover:text-white hover:bg-[#ff5500]/20"
          title="Open Parametric Design Lab"
        >
          <Sliders size={13} className="text-[#ff5500]" />
          <span className="hidden md:inline">Design Lab</span>
        </a>
      </nav>

      {/* ================= RIGHT: WEB AR, VIEW RESET & THEME ================= */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Web AR Direct Launch Button */}
        {onOpenAR && (
          <button
            onClick={onOpenAR}
            title="Launch Interactive Web AR (Floor Anchored)"
            className="flex items-center gap-1.5 rounded-xl border border-orange-500/40 bg-orange-500/10 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-orange-400 hover:bg-orange-500 hover:text-black transition shadow-sm cursor-pointer"
          >
            <Camera size={14} className="shrink-0 animate-pulse" />
            <span className="hidden xs:inline">Web AR</span>
          </button>
        )}

        {/* Reset Camera / Explosion */}
        <button
          onClick={onReset}
          title="Reset Camera & Assembly"
          aria-label="Reset View"
          className={`p-2 rounded-xl border transition cursor-pointer ${
            isLight
              ? "bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700"
              : "bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 hover:text-white"
          }`}
        >
          <RotateCcw size={14} />
        </button>

        {/* Theme Toggle (Dark / Light) */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            title={`Switch to ${isLight ? "Dark" : "Light"} Mode`}
            aria-label="Toggle Theme"
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isLight
                ? "bg-gray-100 hover:bg-gray-200 border-gray-300 text-amber-600"
                : "bg-white/5 hover:bg-white/10 border-white/10 text-amber-400 hover:text-amber-300"
            }`}
          >
            {isLight ? <Moon size={14} /> : <Sun size={14} />}
          </button>
        )}
      </div>
    </header>

    {/* ================= VISUAL MODEL CATALOG MODAL (ALL 9 MACHINES WITH IMAGES & SPECS) ================= */}
    {isCatalogModalOpen && (
      <div
        className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
        onClick={() => setIsCatalogModalOpen(false)}
      >
        <div
          className={`relative w-full max-w-5xl rounded-3xl border shadow-2xl my-auto max-h-[92vh] flex flex-col overflow-hidden ${
            isLight
              ? "bg-white border-slate-300 text-slate-900 shadow-slate-900/20"
              : "bg-[#0b0f19] border-white/15 text-white shadow-black/80"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div
            className={`p-4 sm:p-6 border-b flex items-center justify-between shrink-0 ${
              isLight ? "border-slate-200 bg-slate-50/80" : "border-white/10 bg-[#070a12]/80"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-500 shadow-md">
                <Grid size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black tracking-wide uppercase">
                    3D Machine Catalog
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 font-bold border border-orange-500/30">
                    9 CAD Models
                  </span>
                </div>
                <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                  Select any machine below to inspect in interactive 3D, exploded view, and circuit schematics
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCatalogModalOpen(false)}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                isLight
                  ? "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600 hover:text-slate-900"
                  : "bg-white/5 hover:bg-white/10 border-white/10 text-gray-400 hover:text-white"
              }`}
              title="Close Catalog"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body - Machine Cards Grid */}
          <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleProjectLibrary.map((item) => {
                const ItemIcon = item.icon;
                const isSelected = selectedMachineId === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectMachine(item.id);
                      setCurrentTab("explore");
                      setIsCatalogModalOpen(false);
                    }}
                    className={`group relative rounded-2xl border p-3.5 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden ${
                      isSelected
                        ? "border-orange-500 bg-orange-500/[0.08] shadow-lg shadow-orange-500/10 ring-1 ring-orange-500"
                        : isLight
                        ? "bg-slate-50 hover:bg-white border-slate-200 hover:border-orange-500/60 shadow-sm hover:shadow-md"
                        : "bg-[#101422] hover:bg-[#161c2e] border-white/10 hover:border-orange-500/50 shadow-md"
                    }`}
                  >
                    {/* Image Preview with Hover Zoom */}
                    <div className="w-full h-36 rounded-xl overflow-hidden bg-black/40 border border-white/10 relative shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Top Badges */}
                      <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-black/80 text-orange-400 border border-orange-500/30 backdrop-blur-sm">
                          {item.badge}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500 text-black shadow-md flex items-center gap-1">
                            <Check size={10} className="stroke-[3]" /> Active
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Metadata Content */}
                    <div className="pt-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <div className="w-4 h-4 rounded bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                            <ItemIcon size={10} />
                          </div>
                          <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition truncate">
                            {item.name}
                          </h3>
                        </div>

                        <p className={`text-[11px] leading-tight font-medium ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                          {item.category}
                        </p>

                        <p className={`text-[10px] font-mono mt-2 pt-2 border-t leading-relaxed ${
                          isLight ? "text-slate-500 border-slate-200" : "text-slate-400 border-white/10"
                        }`}>
                          {item.specs}
                        </p>
                      </div>

                      {/* Launch Action */}
                      <div className="pt-3 mt-2 flex items-center justify-between border-t border-dashed border-white/10">
                        <span className={`text-[10px] font-mono uppercase tracking-wider ${
                          isSelected ? "text-emerald-400 font-bold" : isLight ? "text-slate-500" : "text-slate-400"
                        }`}>
                          {isSelected ? "Currently Loaded" : "Click to Inspect"}
                        </span>
                        <div className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                          isSelected
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            : "bg-orange-500 text-white group-hover:brightness-110 shadow-sm"
                        }`}>
                          <span>{isSelected ? "In Studio" : "Launch"}</span>
                          <span className="text-[10px]">→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal Footer */}
          <div
            className={`p-3 sm:p-4 border-t flex items-center justify-between shrink-0 text-xs font-mono ${
              isLight ? "border-slate-200 bg-slate-50 text-slate-600" : "border-white/10 bg-[#070a12] text-slate-400"
            }`}
          >
            <span>All models include full 3D interactive inspection, explosion & BOM</span>
            <button
              onClick={() => setIsCatalogModalOpen(false)}
              className="px-4 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
}

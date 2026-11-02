"use client";

import React from "react";
import { Shield, Zap, Wind, Swords, Flag, RotateCcw, Layers } from "lucide-react";
import { AppTheme, BattleCarId } from "@/types/machine";
import { BATTLE_CARS_SPEC } from "@/data/roboRumbleData";

interface RoboRumbleExplorerControlsProps {
  selectedCarId: BattleCarId;
  onSelectCar: (carId: BattleCarId) => void;
  onEnterArena: () => void;
  onEnterTrack?: () => void;
  onReset: () => void;
  onToggleExplode?: () => void;
  theme?: AppTheme;
}

export default function RoboRumbleExplorerControls({
  selectedCarId,
  onSelectCar,
  onEnterArena,
  onEnterTrack,
  onReset,
  onToggleExplode,
  theme = "dark",
}: RoboRumbleExplorerControlsProps) {
  const isLight = theme === "light";
  const currentSpec = BATTLE_CARS_SPEC[selectedCarId] || BATTLE_CARS_SPEC.striker;

  const cars = [
    {
      id: "striker",
      name: "STRIKER",
      role: "Wedge Pusher",
      icon: Shield,
      accent: "text-orange-400",
    },
    {
      id: "titan",
      name: "TITAN",
      role: "Heavy Tank",
      icon: Zap,
      accent: "text-slate-300",
    },
    {
      id: "viper",
      name: "VIPER",
      role: "Agile Speed",
      icon: Wind,
      accent: "text-sky-400",
    },
  ] as const;

  return (
    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-3xl pointer-events-auto">
      <div
        className={`rounded-2xl border backdrop-blur-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 space-y-2 transition ${
          isLight
            ? "border-slate-200 bg-white/95 text-slate-900 shadow-xl shadow-slate-200/50"
            : "border-white/15 bg-[#0e1118]/95 shadow-[0_20px_50px_rgba(0,0,0,0.85)] text-white"
        }`}
      >
        {/* Top Header: Car Selection Pills & Action Buttons */}
        <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          {/* Combat Class Selector */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={`text-[10px] font-mono uppercase tracking-wider hidden sm:inline ${
                isLight ? "text-slate-500" : "text-gray-400"
              }`}
            >
              Combat Class:
            </span>
            <div
              className={`flex items-center gap-1 p-1 rounded-xl border ${
                isLight ? "bg-slate-100 border-slate-200" : "bg-black/40 border-white/10"
              }`}
            >
              {cars.map((car) => {
                const Icon = car.icon;
                const isSelected = selectedCarId === car.id;
                return (
                  <button
                    key={car.id}
                    onClick={() => onSelectCar(car.id as BattleCarId)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition border cursor-pointer ${
                      isSelected
                        ? isLight
                          ? "bg-slate-900 text-white shadow-md border-slate-900"
                          : "bg-white text-black shadow-md border-white"
                        : isLight
                        ? "bg-transparent border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                        : "bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon size={12} className={isSelected ? (isLight ? "text-orange-400" : "text-orange-600") : car.accent} />
                    <span>{car.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Launch Buttons: Explode, Arena & Track */}
          <div className="flex items-center gap-1.5 shrink-0 ml-auto">
            {onToggleExplode && (
              <button
                onClick={onToggleExplode}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs transition hover:scale-[1.02] cursor-pointer ${
                  isLight
                    ? "bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-600 shadow-sm"
                    : "bg-red-600/20 hover:bg-red-600/35 border-red-500/40 text-red-300 hover:text-white"
                }`}
                title="Switch to Exploded 3D Assembly View"
              >
                <Layers size={13} className={isLight ? "text-rose-500" : "text-red-400"} />
                <span>Explode</span>
              </button>
            )}

            {onEnterTrack && (
              <button
                onClick={onEnterTrack}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/30 transition hover:scale-[1.02] cursor-pointer"
                title="Enter Obstacle Proving Ground Track"
              >
                <Flag size={13} />
                <span>Obstacle Track</span>
              </button>
            )}

            <button
              onClick={onEnterArena}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition hover:scale-[1.02] cursor-pointer"
              title="Launch Battle Arena Match"
            >
              <Swords size={13} />
              <span>Launch Arena</span>
            </button>
          </div>
        </div>

        {/* Live Spec Badges in a Sleek Single Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div
            className={`px-2.5 py-1.5 rounded-xl border flex items-center justify-between ${
              isLight ? "bg-slate-50 border-slate-200" : "bg-black/40 border-white/5"
            }`}
          >
            <span className={`text-[10px] uppercase font-mono ${isLight ? "text-slate-500" : "text-gray-400"}`}>
              Top Speed
            </span>
            <span className={`font-bold text-xs ${isLight ? "text-slate-900" : "text-white"}`}>
              {currentSpec.performanceMetrics.topSpeedKmH}{" "}
              <span className={`text-[9px] ${isLight ? "text-slate-500" : "text-gray-400"}`}>km/h</span>
            </span>
          </div>

          <div
            className={`px-2.5 py-1.5 rounded-xl border flex items-center justify-between ${
              isLight ? "bg-slate-50 border-slate-200" : "bg-black/40 border-white/5"
            }`}
          >
            <span className={`text-[10px] uppercase font-mono ${isLight ? "text-slate-500" : "text-gray-400"}`}>
              Push Force
            </span>
            <span className="font-bold text-orange-500 text-xs">
              {currentSpec.performanceMetrics.maxPushForceN}{" "}
              <span className={`text-[9px] ${isLight ? "text-slate-500" : "text-gray-400"}`}>N</span>
            </span>
          </div>

          <div
            className={`px-2.5 py-1.5 rounded-xl border flex items-center justify-between ${
              isLight ? "bg-slate-50 border-slate-200" : "bg-black/40 border-white/5"
            }`}
          >
            <span className={`text-[10px] uppercase font-mono ${isLight ? "text-slate-500" : "text-gray-400"}`}>
              Weight
            </span>
            <span className={`font-bold text-xs ${isLight ? "text-slate-900" : "text-white"}`}>
              {currentSpec.chassis.totalWeightGrams}{" "}
              <span className={`text-[9px] ${isLight ? "text-slate-500" : "text-gray-400"}`}>g</span>
            </span>
          </div>

          <div
            className={`px-2.5 py-1.5 rounded-xl border flex items-center justify-between ${
              isLight ? "bg-slate-50 border-slate-200" : "bg-black/40 border-white/5"
            }`}
          >
            <span className={`text-[10px] uppercase font-mono ${isLight ? "text-slate-500" : "text-gray-400"}`}>
              Drivetrain
            </span>
            <span className={`font-bold text-xs truncate ${isLight ? "text-sky-600" : "text-sky-400"}`}>
              {currentSpec.drivetrain.type.split(" ")[0]} 4WD
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  Play,
  Square,
  RotateCcw,
  Gauge,
  MoveHorizontal,
  Footprints,
} from "lucide-react";
import { AppTheme, RobotSimulationState } from "@/types/machine";
import { CameraPreset } from "../3d/SceneViewer";

interface RobotWalkingControlsProps {
  simulation: RobotSimulationState;
  onChangeSimulation: (simulation: RobotSimulationState) => void;
  onSelectCameraPreset: (preset: CameraPreset) => void;
  onReset: () => void;
  theme?: AppTheme;
}

export default function RobotWalkingControls({
  simulation,
  onChangeSimulation,
  onSelectCameraPreset,
  onReset,
  theme = "dark",
}: RobotWalkingControlsProps) {
  const isLight = theme === "light";

  const toggleWalking = () => {
    onChangeSimulation({
      ...simulation,
      walking: !simulation.walking,
    });
  };

  const setSpeed = (speed: "slow" | "normal" | "fast") => {
    onChangeSimulation({
      ...simulation,
      speed,
    });
  };

  const toggleForward = () => {
    onChangeSimulation({
      ...simulation,
      forwardMovement: !simulation.forwardMovement,
    });
  };

  // Kinematic parameters derived strictly from 1:48 gear ratio and 28mm stride
  const crankRpm = !simulation.walking
    ? 0
    : simulation.speed === "slow"
    ? 30
    : simulation.speed === "fast"
    ? 120
    : 60;

  const linearVelocityCmS = !simulation.walking
    ? 0
    : simulation.speed === "slow"
    ? 1.4
    : simulation.speed === "fast"
    ? 5.6
    : 2.8;

  return (
    <div className="absolute bottom-12 sm:bottom-14 left-1/2 -translate-x-1/2 z-20 w-auto max-w-[95vw] pointer-events-auto">
      <div
        className={`flex items-center gap-2 sm:gap-3 px-3 py-1.5 sm:py-2 rounded-2xl border backdrop-blur-xl shadow-2xl transition ${
          isLight
            ? "border-slate-200 bg-white/95 text-slate-900 shadow-slate-200/50"
            : "border-white/15 bg-[#0e1117]/95 text-white shadow-black/80"
        }`}
      >
        {/* 1. Walk / Pause Primary Action */}
        <button
          onClick={toggleWalking}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition shadow-md cursor-pointer shrink-0 ${
            simulation.walking
              ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30"
              : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
          }`}
          title={simulation.walking ? "Pause Gait Simulation" : "Start Walking Kinematics"}
        >
          {simulation.walking ? <Square size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
          <span>{simulation.walking ? "PAUSE" : "START"}</span>
        </button>

        {/* Quick Reset Button */}
        <button
          onClick={onReset}
          title="Reset Crank Kinematics to 0°"
          className={`p-1.5 rounded-xl border transition cursor-pointer shrink-0 ${
            isLight
              ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
              : "bg-white/5 hover:bg-white/10 border-white/10 text-gray-400 hover:text-white"
          }`}
        >
          <RotateCcw size={13} />
        </button>

        <div className={`w-px h-5 shrink-0 ${isLight ? "bg-slate-200" : "bg-white/15"}`} />

        {/* 2. Compact Cadence / Speed Pills */}
        <div
          className={`flex items-center gap-0.5 p-0.5 rounded-xl border shrink-0 ${
            isLight ? "bg-slate-100 border-slate-200" : "bg-black/50 border-white/10"
          }`}
        >
          {[
            { id: "slow", label: "30", title: "Slow (30 RPM)" },
            { id: "normal", label: "60", title: "Normal (60 RPM)" },
            { id: "fast", label: "120", title: "Fast (120 RPM)" },
          ].map((spd) => {
            const isActive = simulation.speed === spd.id;
            return (
              <button
                key={spd.id}
                onClick={() => setSpeed(spd.id as any)}
                title={spd.title}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition cursor-pointer ${
                  isActive
                    ? "bg-[#FF6A1A] text-white shadow-sm"
                    : isLight
                    ? "text-slate-600 hover:text-slate-900"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {spd.label}
              </button>
            );
          })}
        </div>

        {/* 3. In-Place vs Locomotion Toggle */}
        <button
          onClick={toggleForward}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition border cursor-pointer shrink-0 ${
            simulation.forwardMovement
              ? "bg-sky-500/15 border-sky-500/40 text-sky-400 font-bold"
              : isLight
              ? "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200/80"
              : "bg-white/5 hover:bg-white/10 border-white/10 text-gray-300"
          }`}
          title={
            simulation.forwardMovement
              ? "Walking across floor grid"
              : "Mechanism inspect mode: robot remains centered on bench"
          }
        >
          <MoveHorizontal size={13} className={simulation.forwardMovement ? "text-sky-400" : "text-gray-400"} />
          <span className="text-[11px] font-mono hidden sm:inline">
            {simulation.forwardMovement ? "Walk" : "Bench"}
          </span>
        </button>

        <div className={`hidden sm:block w-px h-5 shrink-0 ${isLight ? "bg-slate-200" : "bg-white/15"}`} />

        {/* 4. Live Telemetry Badge (Sleek & Compact) */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0 text-xs font-mono">
          <div className="flex items-center gap-1">
            <Gauge size={12} className="text-orange-400" />
            <span className="font-bold text-orange-400 text-[11px]">
              {crankRpm} <span className="text-[9px] opacity-75">RPM</span>
            </span>
          </div>

          {simulation.forwardMovement && (
            <div className="flex items-center gap-1 text-emerald-400 text-[11px]">
              <Footprints size={12} />
              <span>{linearVelocityCmS.toFixed(1)} cm/s</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

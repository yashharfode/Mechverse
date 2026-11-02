"use client";

import React, { useState } from "react";
import {
  Zap,
  Cpu,
  Radio,
  Compass,
  RotateCw,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Sliders,
  Cable,
  Eye,
  Activity,
  Layers,
} from "lucide-react";

interface DroneBElectronicsWiringProps {
  theme?: "dark" | "light";
  onClose?: () => void;
}

type WiringFilter = "all" | "power" | "avionics" | "dshot" | "motors" | "telemetry";

interface MotorCoaxialSpec {
  id: number;
  arm: string;
  position: "Top" | "Bottom";
  rotation: "CW" | "CCW";
  pixhawkPin: string;
  escName: string;
  color: string;
}

const COAXIAL_MOTORS: MotorCoaxialSpec[] = [
  { id: 1, arm: "Arm 1 (Front-Right)", position: "Top", rotation: "CW", pixhawkPin: "MAIN 1", escName: "ESC 1 (40A)", color: "#f97316" },
  { id: 2, arm: "Arm 1 (Front-Right)", position: "Bottom", rotation: "CCW", pixhawkPin: "MAIN 2", escName: "ESC 2 (40A)", color: "#06b6d4" },
  { id: 3, arm: "Arm 2 (Front-Left)", position: "Top", rotation: "CCW", pixhawkPin: "MAIN 3", escName: "ESC 3 (40A)", color: "#06b6d4" },
  { id: 4, arm: "Arm 2 (Front-Left)", position: "Bottom", rotation: "CW", pixhawkPin: "MAIN 4", escName: "ESC 4 (40A)", color: "#f97316" },
  { id: 5, arm: "Arm 3 (Rear-Left)", position: "Top", rotation: "CW", pixhawkPin: "MAIN 5", escName: "ESC 5 (40A)", color: "#f97316" },
  { id: 6, arm: "Arm 3 (Rear-Left)", position: "Bottom", rotation: "CCW", pixhawkPin: "MAIN 6", escName: "ESC 6 (40A)", color: "#06b6d4" },
  { id: 7, arm: "Arm 4 (Rear-Right)", position: "Top", rotation: "CCW", pixhawkPin: "MAIN 7", escName: "ESC 7 (40A)", color: "#06b6d4" },
  { id: 8, arm: "Arm 4 (Rear-Right)", position: "Bottom", rotation: "CW", pixhawkPin: "MAIN 8", escName: "ESC 8 (40A)", color: "#f97316" },
];

export default function DroneBElectronicsWiring({
  theme = "dark",
  onClose,
}: DroneBElectronicsWiringProps) {
  const isLight = theme === "light";
  const [filter, setFilter] = useState<WiringFilter>("all");
  const [hoveredNet, setHoveredNet] = useState<string | null>(null);
  const [selectedMotorId, setSelectedMotorId] = useState<number | null>(null);

  // Wire highlight logic
  const isWireVisible = (wireCategory: string, netName: string) => {
    if (hoveredNet) {
      return hoveredNet === netName;
    }
    if (filter === "all") return true;
    if (filter === "power") return wireCategory === "power";
    if (filter === "avionics") return wireCategory === "avionics";
    if (filter === "dshot") return wireCategory === "dshot";
    if (filter === "motors") return wireCategory === "motors";
    if (filter === "telemetry") return wireCategory === "telemetry";
    return true;
  };

  return (
    <div
      className={`w-full rounded-2xl border transition-colors overflow-hidden select-none ${
        isLight ? "bg-white border-slate-200 text-slate-900 shadow-sm" : "bg-[#090c14] border-white/10 text-white shadow-2xl"
      }`}
    >
      {/* ================= 1. HEADER & INTERACTIVE WIRE FILTER ================= */}
      <div
        className={`p-4 sm:p-5 border-b flex flex-wrap items-center justify-between gap-4 ${
          isLight ? "bg-slate-50 border-slate-200" : "bg-[#0c0f1b] border-white/10"
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
              Drone-B Industrial Octocopter Wiring Architecture
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-bold">
              Pixhawk 6C + 6S PDB-HEX
            </span>
          </div>
          <p className={`text-xs mt-1 ${isLight ? "text-slate-600" : "text-gray-400"}`}>
            Select a wiring circuit below to trace exact connections, voltage rails, and coaxial motor channels.
          </p>
        </div>

        {/* Trace Circuit Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: "all" as const, label: "🌐 All Connections", icon: Layers },
            { id: "power" as const, label: "⚡ 22.2V High-Voltage Bus", icon: Zap },
            { id: "avionics" as const, label: "🛡️ 5.2V Dual BEC Avionics", icon: Cpu },
            { id: "dshot" as const, label: "📡 DShot600 Digital Lines", icon: Cable },
            { id: "motors" as const, label: "🌀 8-Motor Coaxial Drive", icon: RotateCw },
            { id: "telemetry" as const, label: "🛰️ CAN & Telemetry", icon: Radio },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = filter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setFilter(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                  isActive
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30 font-bold"
                    : isLight
                    ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon size={12} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Net Inspector Banner */}
      <div
        className={`px-4 sm:px-6 py-2 border-b flex items-center justify-between text-xs font-mono ${
          isLight ? "bg-amber-50/60 border-amber-200 text-amber-900" : "bg-indigo-950/30 border-indigo-500/20 text-indigo-300"
        }`}
      >
        <div className="flex items-center gap-2">
          <Activity size={13} className="text-amber-500 animate-pulse" />
          <span className="font-bold">Active Wire Circuit:</span>
          <span className="font-semibold underline">
            {hoveredNet || (filter === "all" ? "Showing all complete connections. Hover any component or wire to inspect." : `Filtered: ${filter.toUpperCase()} circuits`)}
          </span>
        </div>
        <span className="text-[11px] opacity-75 hidden sm:inline">
          High-Current Copper Bus &bull; DShot600 Noise Isolated
        </span>
      </div>

      {/* ================= 2. MAIN VISUAL INTERACTIVE WIRING DIAGRAM ================= */}
      <div className="p-4 sm:p-6 relative overflow-x-auto bg-[#060810]">
        <div className="min-w-[980px] max-w-5xl mx-auto relative rounded-2xl border border-white/10 bg-[#0a0d17] p-6 shadow-2xl">
          {/* Engineering Background Grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                radial-gradient(circle, #38bdf8 1px, transparent 1px),
                linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
              `,
              backgroundSize: "36px 36px, 18px 18px, 18px 18px",
            }}
          />

          {/* SVG WIRING OVERLAY */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
            <defs>
              <linearGradient id="powerLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>

            {/* Wire 1: Battery -> PDB (Heavy 10 AWG 22.2V DC) */}
            {isWireVisible("power", "Battery 22.2V VBAT (10 AWG)") && (
              <g>
                <path
                  d="M 180 90 L 250 90"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <circle cx="215" cy="90" r="4" fill="#fef08a" />
              </g>
            )}

            {/* Wire 2: PDB Dual 5.2V BEC -> Pixhawk Power 1 & 2 */}
            {isWireVisible("avionics", "Dual 5.2V Redundant BEC Rails") && (
              <g>
                <path
                  d="M 330 140 L 330 200 L 400 200"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="330" cy="170" r="3.5" fill="#f59e0b" />
              </g>
            )}

            {/* Wire 3: PDB 22.2V Heavy Rails -> ESCs Central Junction */}
            {isWireVisible("power", "6S Main Power Bus to 8x ESCs") && (
              <g>
                <path
                  d="M 410 90 L 590 90"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="500" cy="90" r="3.5" fill="#f87171" />
              </g>
            )}

            {/* Wire 4: Pixhawk MAIN 1..8 -> ESCs Digital DShot Signals */}
            {isWireVisible("dshot", "Pixhawk MAIN 1..8 (DShot600 Digital)") && (
              <g>
                <path
                  d="M 580 230 L 630 230 L 630 140 L 670 140"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="3"
                  strokeDasharray="4 3"
                  strokeLinecap="round"
                />
                <circle cx="630" cy="185" r="3.5" fill="#06b6d4" />
              </g>
            )}

            {/* Wire 5: Pixhawk CAN 1 -> Holybro RTK GPS */}
            {isWireVisible("telemetry", "CAN 1 Differential Bus (5V RTK GPS)") && (
              <g>
                <path
                  d="M 400 240 L 330 240 L 330 310 L 250 310"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeDasharray="3 2"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* Wire 6: Pixhawk TELEM 1 -> HereLink Air Unit */}
            {isWireVisible("telemetry", "TELEM 1 High-Speed UART Video/RC") && (
              <g>
                <path
                  d="M 400 270 L 310 270 L 310 390 L 250 390"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="2.5"
                  strokeDasharray="3 2"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* Wire 7: 8x ESCs -> 8x Coaxial Motors (3-Phase AC) */}
            {isWireVisible("motors", "3-Phase AC (U, V, W) to Coaxial Outrunners") && (
              <g>
                <path
                  d="M 780 140 L 830 140"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>
            )}
          </svg>

          {/* ================= 3-COLUMN SCHEMATIC BLOCKS ================= */}
          <div className="grid grid-cols-12 gap-6 relative z-20">
            {/* COLUMN 1: POWER SOURCE & SENSORS (cols 1..4) */}
            <div className="col-span-12 md:col-span-4 space-y-4">
              {/* BLOCK A: 6S LiPo Battery */}
              <div
                onMouseEnter={() => setHoveredNet("Battery 22.2V VBAT (10 AWG)")}
                onMouseLeave={() => setHoveredNet(null)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  hoveredNet === "Battery 22.2V VBAT (10 AWG)" || filter === "power"
                    ? "bg-red-500/15 border-red-500 shadow-lg shadow-red-500/20 scale-[1.02]"
                    : "bg-[#101422] border-red-500/30 hover:border-red-500/60"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                    <Zap size={14} />
                    <span>6S LiPo Battery Pack</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold border border-red-500/30">
                    22.2V 16,000mAh
                  </span>
                </div>
                <div className="text-[11px] text-gray-300 space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Connector:</span>
                    <span className="text-amber-300 font-bold">XT90-S Anti-Spark</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Wiring:</span>
                    <span className="text-white">10 AWG Pure Silicone Lead</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Discharge:</span>
                    <span className="text-emerald-400">160A Continuous</span>
                  </div>
                </div>
              </div>

              {/* BLOCK B: Matek PDB-HEX (Power Distribution Board) */}
              <div
                onMouseEnter={() => setHoveredNet("6S Main Power Bus to 8x ESCs")}
                onMouseLeave={() => setHoveredNet(null)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  hoveredNet === "6S Main Power Bus to 8x ESCs" || filter === "power"
                    ? "bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-500/20 scale-[1.02]"
                    : "bg-[#101422] border-amber-500/30 hover:border-amber-500/60"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <Zap size={14} />
                    <span>Matek PDB-HEX Power Bus</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                    140A Continuous
                  </span>
                </div>
                <div className="text-[11px] text-gray-300 space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Input:</span>
                    <span className="text-red-400">22.2V DC (6S)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Dual Regulators:</span>
                    <span className="text-amber-300">Dual 5.2V @ 3A BEC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Outputs:</span>
                    <span className="text-white">8x ESC Heavy Solder Pads</span>
                  </div>
                </div>
              </div>

              {/* BLOCK C: Holybro H-RTK F9P GNSS & Compass */}
              <div
                onMouseEnter={() => setHoveredNet("CAN 1 Differential Bus (5V RTK GPS)")}
                onMouseLeave={() => setHoveredNet(null)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  hoveredNet === "CAN 1 Differential Bus (5V RTK GPS)" || filter === "telemetry"
                    ? "bg-emerald-500/15 border-emerald-500 shadow-lg shadow-emerald-500/20"
                    : "bg-[#101422] border-emerald-500/20 hover:border-emerald-500/50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                    <Compass size={13} />
                    <span>H-RTK F9P Navigation</span>
                  </span>
                  <span className="text-[9px] font-mono text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    CAN 1 Port
                  </span>
                </div>
                <p className="text-[10px] text-gray-400">
                  Dual-frequency L1/L2 RTK GNSS receiver providing 1.5cm positioning accuracy via differential CAN bus.
                </p>
              </div>

              {/* BLOCK D: HereLink HD Telemetry */}
              <div
                onMouseEnter={() => setHoveredNet("TELEM 1 High-Speed UART Video/RC")}
                onMouseLeave={() => setHoveredNet(null)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  hoveredNet === "TELEM 1 High-Speed UART Video/RC" || filter === "telemetry"
                    ? "bg-purple-500/15 border-purple-500 shadow-lg shadow-purple-500/20"
                    : "bg-[#101422] border-purple-500/20 hover:border-purple-500/50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-purple-400 font-bold text-xs flex items-center gap-1.5">
                    <Radio size={13} />
                    <span>HereLink HD Air Unit</span>
                  </span>
                  <span className="text-[9px] font-mono text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded">
                    TELEM 1
                  </span>
                </div>
                <p className="text-[10px] text-gray-400">
                  1080p 60fps low-latency video transmission and 16-channel MAVLink control over a 20km digital link.
                </p>
              </div>
            </div>

            {/* COLUMN 2: AUTOPILOT BRAIN (cols 5..7) */}
            <div className="col-span-12 md:col-span-4 space-y-4">
              <div
                onMouseEnter={() => setHoveredNet("Dual 5.2V Redundant BEC Rails")}
                onMouseLeave={() => setHoveredNet(null)}
                className="p-5 rounded-2xl border border-sky-500/40 bg-gradient-to-b from-[#11192e] to-[#0a101f] shadow-2xl relative space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sky-400 font-black text-sm uppercase tracking-wider">
                    <Cpu size={16} />
                    <span>Pixhawk 6C Flight Brain</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
                    STM32H753 480MHz
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 text-[11px] font-mono">
                  <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                    <span className="text-amber-400 font-bold">POWER 1 & 2:</span>
                    <span className="text-gray-300">Dual 5.2V Isolated Regulators</span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                    <span className="text-cyan-400 font-bold">MAIN 1..8:</span>
                    <span className="text-gray-300">DShot600 Digital (M1 to M8)</span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                    <span className="text-emerald-400 font-bold">CAN 1:</span>
                    <span className="text-gray-300">Here3+ / H-RTK Compass</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 font-bold">TELEM 1:</span>
                    <span className="text-gray-300">MAVLink Telemetry Stream</span>
                  </div>
                </div>

                {/* Status Callout */}
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-sky-400" />
                    <span>Isolated DShot Loop</span>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-snug font-sans">
                    Digital motor signals bypass analog ground loops, eliminating ESC calibration and motor jitter entirely.
                  </p>
                </div>
              </div>
            </div>

            {/* COLUMN 3: 8x COAXIAL MOTORS & SPEED CONTROLLERS (cols 8..12) */}
            <div className="col-span-12 md:col-span-4 space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                  <RotateCw size={13} className="text-orange-400" />
                  <span>8× Coaxial Motor Channels</span>
                </span>
                <span className="text-[10px] font-mono text-gray-400">
                  4 Arms • 8 Motors
                </span>
              </div>

              {/* 4 Coaxial Arm Pods */}
              <div className="space-y-2.5">
                {[
                  { armName: "Arm 1 (Front-Right)", motors: [COAXIAL_MOTORS[0], COAXIAL_MOTORS[1]] },
                  { armName: "Arm 2 (Front-Left)", motors: [COAXIAL_MOTORS[2], COAXIAL_MOTORS[3]] },
                  { armName: "Arm 3 (Rear-Left)", motors: [COAXIAL_MOTORS[4], COAXIAL_MOTORS[5]] },
                  { armName: "Arm 4 (Rear-Right)", motors: [COAXIAL_MOTORS[6], COAXIAL_MOTORS[7]] },
                ].map((arm, aIdx) => (
                  <div
                    key={aIdx}
                    className="p-3 rounded-xl border border-white/10 bg-[#0d101c] hover:border-orange-500/40 transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-200">{arm.armName}</span>
                      <span className="text-[9px] font-mono text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                        Coaxial Pair
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {arm.motors.map((m) => {
                        const isCw = m.rotation === "CW";
                        const isSelected = selectedMotorId === m.id;

                        return (
                          <div
                            key={m.id}
                            onClick={() => setSelectedMotorId(isSelected ? null : m.id)}
                            onMouseEnter={() => setHoveredNet(`M${m.id} ${m.position} (${m.rotation}) via ${m.pixhawkPin}`)}
                            onMouseLeave={() => setHoveredNet(null)}
                            className={`p-2 rounded-lg border text-left cursor-pointer transition ${
                              isSelected || hoveredNet?.includes(`M${m.id}`)
                                ? "bg-orange-500/20 border-orange-500 shadow-md ring-1 ring-orange-500"
                                : "bg-black/40 border-white/5 hover:border-white/20"
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px] font-bold">
                              <span className="text-white">M{m.id} ({m.position})</span>
                              <span
                                className={`flex items-center gap-0.5 text-[9px] font-mono font-bold px-1 rounded ${
                                  isCw ? "text-orange-400 bg-orange-500/15" : "text-cyan-400 bg-cyan-500/15"
                                }`}
                              >
                                {isCw ? <RotateCw size={9} /> : <RotateCcw size={9} />}
                                <span>{m.rotation}</span>
                              </span>
                            </div>

                            <div className="text-[10px] text-gray-400 font-mono mt-1 space-y-0.5">
                              <div>Port: <span className="text-gray-200">{m.pixhawkPin}</span></div>
                              <div>Speed: <span className="text-emerald-400">400KV BLDC</span></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. WIRING COLOR CODE & QUICK CONNECTION TABLE ================= */}
      <div
        className={`p-4 sm:p-6 border-t space-y-4 ${
          isLight ? "bg-slate-50 border-slate-200" : "bg-[#0b0e18] border-white/10"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400">
              Color-Coded Wiring Standard & Electrical Rules
            </span>
          </div>
          <span className="text-xs font-mono text-gray-400">
            Guaranteed Optical Noise Isolation
          </span>
        </div>

        {/* 5 Wire Color Conventions */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs font-mono">
          <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 space-y-1">
            <div className="flex items-center gap-2 font-bold text-red-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>+22.2V DC (VBAT)</span>
            </div>
            <p className="text-[10px] text-gray-300">10 AWG Heavy Silicone from 6S Battery to PDB-HEX.</p>
          </div>

          <div className="p-3 rounded-xl border border-slate-500/30 bg-slate-500/10 space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <span>GND Common Ground</span>
            </div>
            <p className="text-[10px] text-gray-300">Continuous 4-layer copper return path with zero ground loops.</p>
          </div>

          <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>+5.2V Regulated</span>
            </div>
            <p className="text-[10px] text-gray-300">Dual PM06 BEC modules powering Pixhawk 6C Power 1 & 2.</p>
          </div>

          <div className="p-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 space-y-1">
            <div className="flex items-center gap-2 font-bold text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>DShot600 Digital</span>
            </div>
            <p className="text-[10px] text-gray-300">Pixhawk MAIN 1..8 to ESCs with 3.3V logic line isolation.</p>
          </div>

          <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>CAN Bus Pair</span>
            </div>
            <p className="text-[10px] text-gray-300">CAN H / CAN L twisted pair for centimetre-accurate RTK GPS.</p>
          </div>
        </div>

        {/* Safety Callouts */}
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
          <ShieldAlert size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-amber-200">
            <div className="font-bold">Crucial Coaxial Assembly Directives:</div>
            <div className="text-[11px] leading-relaxed text-amber-200/90 font-sans">
              1. <strong>Anti-Spark Pre-Charge:</strong> Always connect the green female XT90-S socket first to prevent 6S capacitive arc welding.
              <br />
              2. <strong>Coaxial Motor Direction:</strong> On every arm, ensure the <em>Top</em> motor and <em>Bottom</em> motor spin in <strong>opposite directions</strong> (e.g. Arm 1 Top = CW, Bottom = CCW) to neutralize aerodynamic torque.
              <br />
              3. <strong>Motor Loss Redundancy:</strong> If any single motor suffers loss in flight, PX4/ArduPilot auto-increases the coaxial twin&apos;s throttle by 35% to prevent spinout.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

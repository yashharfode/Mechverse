"use client";

import React, { useState } from "react";
import {
  Zap,
  Cpu,
  Radio,
  Compass,
  Layers,
  Activity,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Package,
  Clock,
  Settings,
  Info,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Shield,
  Eye,
  Camera,
} from "lucide-react";
import BuyLinkButtons from "@/components/ui/BuyLinkButtons";

interface DroneBElectronicsWiringProps {
  theme?: "dark" | "light";
  onClose?: () => void;
}

type WiringFilter = "all" | "power" | "dshot" | "phases" | "telemetry" | "aux";

interface SelectedComponentInfo {
  title: string;
  category: string;
  spec: string;
  description: string;
  pins: string[];
  voltage: string;
}

export default function DroneBElectronicsWiring({
  theme = "dark",
  onClose,
}: DroneBElectronicsWiringProps) {
  const isLight = theme === "light";
  const [filter, setFilter] = useState<WiringFilter>("all");
  const [hoveredNet, setHoveredNet] = useState<string | null>(null);
  const [selectedComp, setSelectedComp] = useState<SelectedComponentInfo | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  // Wire highlight helper
  const isWireVisible = (type: WiringFilter, netName: string) => {
    if (hoveredNet) return hoveredNet === netName;
    if (filter === "all") return true;
    return filter === type;
  };

  // Motor & ESC Column positions (8 columns evenly spaced across 840px canvas)
  const motorPositions = [
    { id: 1, mLabel: "M1", escLabel: "ESC 1", x: 65, fcPin: "MAIN 1", rot: "CW", arm: "Arm 1 Top" },
    { id: 2, mLabel: "M2", escLabel: "ESC 2", x: 175, fcPin: "MAIN 2", rot: "CCW", arm: "Arm 1 Bottom" },
    { id: 3, mLabel: "M3", escLabel: "ESC 3", x: 285, fcPin: "MAIN 3", rot: "CCW", arm: "Arm 2 Top" },
    { id: 4, mLabel: "M4", escLabel: "ESC 4", x: 395, fcPin: "MAIN 4", rot: "CW", arm: "Arm 2 Bottom" },
    { id: 5, mLabel: "M5", escLabel: "ESC 5", x: 505, fcPin: "MAIN 5", rot: "CW", arm: "Arm 3 Top" },
    { id: 6, mLabel: "M6", escLabel: "ESC 6", x: 615, fcPin: "MAIN 6", rot: "CCW", arm: "Arm 3 Bottom" },
    { id: 7, mLabel: "M7", escLabel: "ESC 7", x: 725, fcPin: "MAIN 7", rot: "CCW", arm: "Arm 4 Top" },
    { id: 8, mLabel: "M8", escLabel: "ESC 8", x: 835, fcPin: "MAIN 8", rot: "CW", arm: "Arm 4 Bottom" },
  ];

  return (
    <div className="w-full space-y-4 select-none">
      {/* ================= 1. REFERENCE HEADER BANNER ================= */}
      <div className="rounded-2xl border border-white/10 bg-[#06080e]/95 p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left Title with Mechverse Branding */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 shrink-0 font-black text-sm tracking-tighter">
              MV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-orange-400 font-bold">
                  MECHVERSE WIRING DESIGN
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Industrial Octocopter
              </h1>
              <p className="text-xs sm:text-sm font-bold text-orange-400">
                Electrical Wiring Design
              </p>
            </div>
          </div>

          {/* Right Reference Metadata Badges */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-black/40 text-xs font-mono">
              <Package size={14} className="text-orange-400" />
              <div className="leading-tight">
                <div className="text-[9px] text-neutral-400 uppercase">Payload</div>
                <div className="text-white font-bold">5 – 10 kg</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-black/40 text-xs font-mono">
              <Clock size={14} className="text-amber-400" />
              <div className="leading-tight">
                <div className="text-[9px] text-neutral-400 uppercase">Flight Time</div>
                <div className="text-white font-bold">20 – 30 min</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-black/40 text-xs font-mono">
              <Settings size={14} className="text-sky-400" />
              <div className="leading-tight">
                <div className="text-[9px] text-neutral-400 uppercase">Use Case</div>
                <div className="text-white font-bold">Industrial &bull; Survey &bull; Inspection</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trace Circuit Filters Bar */}
        <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-neutral-400 text-[11px] mr-1 flex items-center gap-1">
              <Layers size={12} /> Trace Filter:
            </span>
            {[
              { id: "all" as const, label: "All Circuits" },
              { id: "power" as const, label: "🔴 Power (22.2V 6S)" },
              { id: "dshot" as const, label: "🔵 ESC Signal (DShot)" },
              { id: "phases" as const, label: "🟡 Motor Phase (A/B/C)" },
              { id: "telemetry" as const, label: "🟠 Telemetry / Data" },
              { id: "aux" as const, label: "⚪ Gimbal / AUX" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer border ${
                  filter === f.id
                    ? "bg-orange-500/20 text-orange-400 border-orange-500/40 shadow-sm"
                    : "bg-white/5 text-neutral-400 hover:text-white border-transparent"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-neutral-400 flex items-center gap-2">
            <span>Active Circuit:</span>
            <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {hoveredNet || "Hover any wire or component to trace"}
            </span>
          </div>
        </div>
      </div>

      {/* ================= 2. THREE-COLUMN ARCHITECTURE GRID ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        {/* ================= LEFT COLUMN: MAIN COMPONENTS ================= */}
        <div className="xl:col-span-3 space-y-4">
          {/* Drone 3D Photo Render Card */}
          <div className="rounded-2xl border border-white/10 bg-[#090b12] p-3 shadow-xl overflow-hidden group">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-b from-[#121624] to-[#080a10] border border-white/5 flex items-center justify-center">
              <img
                src="/images/models/drone-b.jpg"
                alt="Drone B Industrial Octocopter"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold text-[11px] drop-shadow">Drone-B Hex/Octo</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/80 text-white font-bold drop-shadow">
                  Coaxial 8-Rotor
                </span>
              </div>
            </div>
          </div>

          {/* Main Components Spec Card */}
          <div className="rounded-2xl border border-white/10 bg-[#070910] p-4 shadow-xl space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider font-bold text-orange-400 border-b border-white/5 pb-2">
              Main Components
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              {[
                {
                  icon: Cpu,
                  title: "Flight Controller",
                  spec: "Pixhawk 6C (or Cube)",
                  desc: "Dual-core STM32H753 480MHz with triple-redundant isolated IMUs.",
                  voltage: "5.0V Dual BEC",
                  pins: ["MAIN 1..8", "CAN 1", "TELEM 1", "GPS 1", "POWER 1/2"],
                  color: "#06b6d4",
                },
                {
                  icon: Zap,
                  title: "ESC (8 x)",
                  spec: "40A – 60A, 4–6S",
                  desc: "Ultra-low-resistance MOSFET speed controllers running digital DShot600.",
                  voltage: "22.2V Direct 6S",
                  pins: ["VCC (+)", "GND (-)", "PWM/DShot In", "Phase U, V, W"],
                  color: "#ef4444",
                },
                {
                  icon: Settings,
                  title: "Brushless Motor (8 x)",
                  spec: "KV 380 – 520 (Industrial)",
                  desc: "Heavy-lift high-torque brushless outrunners generating up to 4.2kg static thrust.",
                  voltage: "3-Phase AC (22.2V)",
                  pins: ["Phase A", "Phase B", "Phase C"],
                  color: "#f59e0b",
                },
                {
                  icon: Package,
                  title: "LiPo Battery",
                  spec: "6S (22.2 V) 10000 – 22000 mAh",
                  desc: "High-discharge 35C solid-state lithium polymer pack with XT90-S anti-spark.",
                  voltage: "22.2V (25.2V Peak)",
                  pins: ["XT90 Red (+)", "XT90 Black (-)"],
                  color: "#ef4444",
                },
                {
                  icon: Radio,
                  title: "RC Receiver",
                  spec: "ELRS / Crossfire",
                  desc: "Long-range 2.4GHz / 915MHz ExpressLRS dual-diversity receiver with telemetry.",
                  voltage: "5.0V Logic",
                  pins: ["CRSF TX", "CRSF RX", "5V", "GND"],
                  color: "#f97316",
                },
                {
                  icon: Compass,
                  title: "GNSS + Compass",
                  spec: "u-blox M9N",
                  desc: "Multi-constellation GPS/Galileo/BeiDou module with integrated IST8310 magnetometer.",
                  voltage: "5.0V Regulated",
                  pins: ["UART TX/RX", "I2C SDA/SCL", "5V", "GND"],
                  color: "#10b981",
                },
                {
                  icon: Radio,
                  title: "Telemetry (Optional)",
                  spec: "915 MHz / 2.4 GHz",
                  desc: "500mW bidirectional ground station datalink transmitting live MAVLink telemetry.",
                  voltage: "5.0V Logic",
                  pins: ["TELEM TX/RX", "CTS/RTS", "5V", "GND"],
                  color: "#a855f7",
                },
                {
                  icon: Camera,
                  title: "Payload",
                  spec: "Gimbal / Industrial Camera",
                  desc: "3-axis stabilized brushless gimbal with Sony 4K sensor and thermal inspection feed.",
                  voltage: "12V BEC / 6S Direct",
                  pins: ["Pitch PWM", "Yaw PWM", "Video Out", "GND"],
                  color: "#cbd5e1",
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    onClick={() =>
                      setSelectedComp({
                        title: item.title,
                        category: item.spec,
                        spec: item.spec,
                        description: item.desc,
                        pins: item.pins,
                        voltage: item.voltage,
                      })
                    }
                    className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-orange-500/40 transition cursor-pointer flex items-start gap-2.5 group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center shrink-0 text-neutral-400 group-hover:text-orange-400 group-hover:border-orange-500/30 transition">
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-bold text-[11px] truncate group-hover:text-orange-300 transition">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-neutral-400 truncate">{item.spec}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= CENTER COLUMN: 2D SCHEMATIC CANVAS ================= */}
        <div className="xl:col-span-6 space-y-3">
          <div className="relative rounded-2xl border border-white/10 bg-[#05070d] p-3 sm:p-4 shadow-2xl overflow-x-auto custom-scrollbar">
            {/* Technical Background Grid */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `
                  radial-gradient(circle, #f97316 0.8px, transparent 0.8px),
                  linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
                `,
                backgroundSize: "36px 36px, 18px 18px, 18px 18px",
              }}
            />

            {/* Inner Scalable Canvas Container (920px x 680px) */}
            <div
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top center" }}
              className="relative w-[920px] h-[680px] shrink-0 mx-auto select-none transition-transform duration-200"
            >
              {/* ================= SVG SIGNAL & POWER TRACES ================= */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10">
                <defs>
                  <filter id="wireGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* --- 1. MOTOR 3-PHASE WIRES (Yellow/Red/Black) from M1..M8 down to ESCs --- */}
                {motorPositions.map((pos) => {
                  const isVisible = isWireVisible("phases", `Motor Phase ${pos.mLabel} (A/B/C)`);
                  if (!isVisible) return null;
                  return (
                    <g key={`phase-${pos.id}`}>
                      {/* Phase A (Yellow) */}
                      <line x1={pos.x + 10} y1={88} x2={pos.x + 10} y2={125} stroke="#eab308" strokeWidth="2.5" />
                      {/* Phase B (Red) */}
                      <line x1={pos.x + 20} y1={88} x2={pos.x + 20} y2={125} stroke="#ef4444" strokeWidth="2.5" />
                      {/* Phase C (Black) */}
                      <line x1={pos.x + 30} y1={88} x2={pos.x + 30} y2={125} stroke="#475569" strokeWidth="2.5" />
                    </g>
                  );
                })}

                {/* --- 2. RED POWER BUS (22.2V 6S) CONNECTING ALL 8 ESCS TO PDB --- */}
                {isWireVisible("power", "Power (V+) - 22.2 V (6S)") && (
                  <g filter="url(#wireGlow)">
                    {/* Horizontal Main Red Power Rail above Pixhawk (y = 230) */}
                    <line x1={85} y1={230} x2={855} y2={230} stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />

                    {/* Drops from each ESC (y = 192 to y = 230) */}
                    {motorPositions.map((pos) => (
                      <line
                        key={`pwr-drop-${pos.id}`}
                        x1={pos.x + 12}
                        y1={192}
                        x2={pos.x + 12}
                        y2={230}
                        stroke="#ef4444"
                        strokeWidth="3.5"
                      />
                    ))}

                    {/* Central Red Feed from PDB (y = 525) up to horizontal power rail (y = 230) */}
                    <path
                      d="M 505 525 L 505 250 L 470 230"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </g>
                )}

                {/* --- 3. BLUE ESC SIGNAL WIRES (DShot / PWM) from ESC 1..8 into PIXHAWK TOP --- */}
                {motorPositions.map((pos, idx) => {
                  const isVisible = isWireVisible("dshot", `ESC Signal ${pos.escLabel} -> ${pos.fcPin}`);
                  if (!isVisible) return null;

                  // Target pin on Pixhawk top header (x spans from 400 to 520, y = 338)
                  const targetX = 405 + idx * 17;
                  const startX = pos.x + 28;
                  const startY = 192;

                  // Smooth bezier curve down into Pixhawk
                  return (
                    <g key={`dshot-${pos.id}`}>
                      <path
                        d={`M ${startX} ${startY} C ${startX} ${startY + 60}, ${targetX} ${300}, ${targetX} 338`}
                        fill="none"
                        stroke="#0084ff"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className="transition-all duration-200"
                      />
                      <circle cx={targetX} cy={338} r="2.5" fill="#60a5fa" />
                    </g>
                  );
                })}

                {/* --- 4. RC RECEIVER (ELRS) TO PIXHAWK RC IN --- */}
                {isWireVisible("telemetry", "RC Receiver (ELRS) -> RC IN") && (
                  <g>
                    {/* Orange CRSF signal */}
                    <path
                      d="M 285 365 L 375 365"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Red 5V power */}
                    <path
                      d="M 285 372 L 375 372"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                    />
                  </g>
                )}

                {/* --- 5. GNSS + COMPASS (M9N) TO PIXHAWK GPS1 & I2C --- */}
                {isWireVisible("telemetry", "GNSS + Compass (M9N) -> GPS & I2C") && (
                  <g>
                    <path
                      d="M 285 450 L 375 450"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M 285 456 L 375 456"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2"
                    />
                  </g>
                )}

                {/* --- 6. TELEMETRY (915 MHz) TO PIXHAWK TELEM1 --- */}
                {isWireVisible("telemetry", "Telemetry (915 MHz) -> TELEM 1") && (
                  <g>
                    <path
                      d="M 610 365 L 545 365"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 610 372 L 545 372"
                      fill="none"
                      stroke="#0084ff"
                      strokeWidth="2"
                    />
                  </g>
                )}

                {/* --- 7. PAYLOAD / GIMBAL TO PIXHAWK AUX --- */}
                {isWireVisible("aux", "Payload / Gimbal -> AUX Control") && (
                  <g>
                    <path
                      d="M 620 450 L 545 450"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M 620 456 L 545 456"
                      fill="none"
                      stroke="#0084ff"
                      strokeWidth="2"
                    />
                  </g>
                )}

                {/* --- 8. POWER MODULE (PM) SENSE TO PIXHAWK BOTTOM --- */}
                {isWireVisible("power", "5V Regulated Power & Current Sense") && (
                  <g>
                    <path
                      d="M 330 525 L 330 480 L 460 480 L 460 452"
                      fill="none"
                      stroke="#eab308"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </g>
                )}

                {/* --- 9. LIPO BATTERY -> XT90 -> POWER MODULE -> PDB --- */}
                {isWireVisible("power", "Battery 6S VBAT Heavy Bus") && (
                  <g>
                    {/* Battery to XT90 */}
                    <line x1={220} y1={555} x2={240} y2={555} stroke="#ef4444" strokeWidth="5" />
                    <line x1={220} y1={565} x2={240} y2={565} stroke="#475569" strokeWidth="5" />

                    {/* XT90 to Power Module */}
                    <line x1={265} y1={555} x2={285} y2={555} stroke="#ef4444" strokeWidth="5" />
                    <line x1={265} y1={565} x2={285} y2={565} stroke="#475569" strokeWidth="5" />

                    {/* Power Module to PDB */}
                    <line x1={360} y1={555} x2={430} y2={555} stroke="#ef4444" strokeWidth="5" />
                    <line x1={360} y1={565} x2={430} y2={565} stroke="#475569" strokeWidth="5" />
                  </g>
                )}
              </svg>

              {/* ================= 8 MOTOR & ESC COLUMNS (TOP ROW) ================= */}
              {motorPositions.map((pos) => (
                <div
                  key={`col-${pos.id}`}
                  style={{ left: `${pos.x}px`, position: "absolute", top: "15px", width: "50px" }}
                  className="flex flex-col items-center z-20 cursor-pointer"
                  onClick={() =>
                    setSelectedComp({
                      title: `Motor ${pos.mLabel} + ${pos.escLabel}`,
                      category: pos.arm,
                      spec: `${pos.rot} Rotation &bull; ${pos.fcPin}`,
                      description: `High-efficiency brushless outrunner mounted in ${pos.rot} configuration, commanded via ${pos.fcPin} digital DShot600 protocol.`,
                      pins: ["Phase U", "Phase V", "Phase W", pos.fcPin, "6S 22.2V Bus"],
                      voltage: "22.2V 6S",
                    })
                  }
                  onMouseEnter={() =>
                    setHoveredNet(`ESC Signal ${pos.escLabel} -> ${pos.fcPin}`)
                  }
                  onMouseLeave={() => setHoveredNet(null)}
                >
                  {/* Orange Pill Badge (M1..M8) */}
                  <div className="px-2 py-0.5 rounded bg-[#ff6a00] text-black font-extrabold text-[11px] shadow-md shadow-orange-500/30 tracking-wider">
                    {pos.mLabel}
                  </div>

                  {/* Brushless Motor Graphic (Red Bell, Copper Coils, Steel Shaft) */}
                  <div className="mt-2 w-11 h-11 relative flex items-center justify-center">
                    <svg viewBox="0 0 44 44" className="w-full h-full drop-shadow-md">
                      {/* Top Shaft */}
                      <rect x="20" y="2" width="4" height="6" fill="#cbd5e1" rx="1" />
                      {/* Red Anodized Bell */}
                      <rect x="6" y="8" width="32" height="18" fill="#d92626" rx="4" />
                      <line x1="8" y1="14" x2="36" y2="14" stroke="#ff7878" strokeWidth="1" />
                      {/* Cooling slots */}
                      <rect x="10" y="10" width="3" height="14" fill="#18181b" rx="1" />
                      <rect x="16" y="10" width="3" height="14" fill="#18181b" rx="1" />
                      <rect x="25" y="10" width="3" height="14" fill="#18181b" rx="1" />
                      <rect x="31" y="10" width="3" height="14" fill="#18181b" rx="1" />
                      {/* Copper stator windings visible inside */}
                      <rect x="8" y="26" width="28" height="6" fill="#b45309" rx="1" />
                      {/* Black Stator Base */}
                      <rect x="6" y="32" width="32" height="6" fill="#18181b" rx="2" />
                    </svg>
                  </div>

                  {/* 3-Phase Wire Gap */}
                  <div className="h-9 w-full flex items-center justify-center text-[8px] font-mono text-neutral-500">
                    <span className="opacity-0">3P</span>
                  </div>

                  {/* ESC 1..8 Module Package */}
                  <div className="w-12 h-16 rounded-lg bg-[#0e121a] border border-white/20 p-1 flex flex-col items-center justify-between shadow-lg relative group-hover:border-orange-500/60 transition">
                    {/* 4 Gold corner pads */}
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-1 left-1" />
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-1 right-1" />
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute bottom-1 left-1" />
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute bottom-1 right-1" />

                    <div className="text-[9px] font-mono font-black text-white text-center mt-2.5">
                      {pos.escLabel}
                    </div>
                    <div className="text-[8px] font-mono font-bold text-amber-400 pb-1">
                      40A
                    </div>
                  </div>
                </div>
              ))}

              {/* ================= CENTRAL FLIGHT CONTROLLER: PIXHAWK 6C ================= */}
              <div
                style={{ left: "375px", top: "338px", width: "170px", height: "115px" }}
                className="absolute z-20 rounded-2xl border-2 border-amber-400/80 bg-[#0a0d14] p-3 shadow-[0_0_35px_rgba(245,158,11,0.25)] flex flex-col justify-between cursor-pointer hover:border-amber-400 transition"
                onClick={() =>
                  setSelectedComp({
                    title: "Pixhawk 6C Autopilot",
                    category: "Central Avionics Flight Controller",
                    spec: "STM32H753 480MHz &bull; Triple IMU Redundancy",
                    description: "High-reliability industrial autopilot managing autonomous navigation, real-time stabilization, 8x motor mixer, and telemetry datalinks.",
                    pins: [
                      "MAIN 1–8 (PWM/DShot)",
                      "GPS 1 / I2C",
                      "TELEM 1 / 2",
                      "RC IN (ELRS)",
                      "POWER 1 / 2 (Dual BEC)",
                    ],
                    voltage: "5.0V Regulated",
                  })
                }
                onMouseEnter={() => setHoveredNet("Pixhawk 6C Central Flight Processor")}
                onMouseLeave={() => setHoveredNet(null)}
              >
                {/* Gold Top Pin Headers (MAIN 1..8) */}
                <div className="flex items-center justify-between px-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                    <div
                      key={p}
                      className="w-2.5 h-2.5 rounded-sm bg-amber-400/90 border border-white/20 text-[7px] font-mono text-black font-black flex items-center justify-center shadow-xs"
                    >
                      {p}
                    </div>
                  ))}
                </div>

                {/* Center Pixhawk Silkscreen & Arrow Logo */}
                <div className="flex flex-col items-center justify-center text-center my-auto">
                  <div className="w-5 h-5 text-neutral-200">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 19h7v3h6v-3h7L12 2z" />
                    </svg>
                  </div>
                  <div className="text-xs font-black tracking-wider text-white mt-0.5">
                    Pixhawk 6C
                  </div>
                  <div className="text-[8px] font-mono text-neutral-400">
                    Industrial Autopilot
                  </div>
                </div>

                {/* Gold Bottom Connector Pins */}
                <div className="flex items-center justify-center gap-2">
                  <div className="w-6 h-1.5 rounded-xs bg-amber-400/80" />
                  <div className="w-6 h-1.5 rounded-xs bg-amber-400/80" />
                  <div className="w-6 h-1.5 rounded-xs bg-amber-400/80" />
                </div>
              </div>

              {/* ================= LEFT SENSORS & RECEIVER ================= */}
              {/* RC Receiver (ELRS) */}
              <div
                style={{ left: "195px", top: "348px", width: "90px" }}
                className="absolute z-20 rounded-xl border border-white/20 bg-[#0e121a] p-2 shadow-lg cursor-pointer hover:border-orange-400 transition"
                onClick={() =>
                  setSelectedComp({
                    title: "RC Receiver (ELRS)",
                    category: "Radio Control Uplink",
                    spec: "2.4GHz ExpressLRS &bull; True Diversity",
                    description: "Ultra-low-latency 500Hz control link with telemetry return and failsafe motor cut.",
                    pins: ["CRSF TX", "CRSF RX", "5V IN", "GND"],
                    voltage: "5.0V Logic",
                  })
                }
                onMouseEnter={() => setHoveredNet("RC Receiver (ELRS) -> RC IN")}
                onMouseLeave={() => setHoveredNet(null)}
              >
                {/* Twin Antenna Whips */}
                <div className="absolute -left-4 top-2 bottom-2 flex flex-col justify-between">
                  <div className="w-4 h-0.5 bg-neutral-400" />
                  <div className="w-4 h-0.5 bg-neutral-400" />
                </div>
                <div className="text-[10px] font-bold text-white text-center leading-tight">
                  RC Receiver
                </div>
                <div className="text-[8px] font-mono text-neutral-400 text-center mt-0.5">
                  (ELRS)
                </div>
              </div>

              {/* GNSS + Compass (M9N) */}
              <div
                style={{ left: "215px", top: "428px", width: "70px", height: "70px" }}
                className="absolute z-20 rounded-2xl border-2 border-white/20 bg-gradient-to-b from-[#e2e8f0] to-[#cbd5e1] p-2 shadow-xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-400 transition"
                onClick={() =>
                  setSelectedComp({
                    title: "GNSS + Compass (u-blox M9N)",
                    category: "Satellite Navigation Puck",
                    spec: "72-Channel Concurrent GNSS &bull; 1.5m CEP",
                    description: "Ceramic patch antenna receiving GPS, GLONASS, Galileo, and BeiDou signals, with internal compass.",
                    pins: ["UART TX", "UART RX", "I2C SDA", "I2C SCL", "5V", "GND"],
                    voltage: "5.0V Regulated",
                  })
                }
                onMouseEnter={() => setHoveredNet("GNSS + Compass (M9N) -> GPS & I2C")}
                onMouseLeave={() => setHoveredNet(null)}
              >
                <div className="w-3.5 h-3.5 text-neutral-800">
                  <Compass size={14} />
                </div>
                <div className="text-[9px] font-extrabold text-neutral-900 mt-1 leading-tight">
                  GNSS +
                </div>
                <div className="text-[8px] font-bold text-neutral-700 leading-tight">
                  Compass
                </div>
                <div className="text-[7px] font-mono text-neutral-600 mt-0.5 font-bold">
                  (M9N)
                </div>
              </div>

              {/* ================= RIGHT TELEMETRY & GIMBAL ================= */}
              {/* Telemetry Modem (915 MHz) */}
              <div
                style={{ left: "610px", top: "348px", width: "95px" }}
                className="absolute z-20 rounded-xl border border-white/20 bg-[#0e121a] p-2 shadow-lg cursor-pointer hover:border-purple-400 transition"
                onClick={() =>
                  setSelectedComp({
                    title: "Telemetry Transceiver (915 MHz)",
                    category: "Ground Control Datalink",
                    spec: "500mW RF Power &bull; Up to 15km Range",
                    description: "Bi-directional MAVLink telemetry modem connecting drone flight status to QGroundControl / Mission Planner.",
                    pins: ["UART TX", "UART RX", "CTS", "RTS", "5V", "GND"],
                    voltage: "5.0V Logic",
                  })
                }
                onMouseEnter={() => setHoveredNet("Telemetry (915 MHz) -> TELEM 1")}
                onMouseLeave={() => setHoveredNet(null)}
              >
                {/* Rubber Duck Antenna */}
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-1.5 bg-neutral-300 rounded-r-sm" />
                <div className="text-[10px] font-bold text-white text-center leading-tight">
                  Telemetry
                </div>
                <div className="text-[8px] font-mono text-neutral-400 text-center mt-0.5">
                  (915 MHz)
                </div>
              </div>

              {/* Payload / Gimbal Camera Unit */}
              <div
                style={{ left: "620px", top: "428px", width: "85px", height: "70px" }}
                className="absolute z-20 rounded-xl border border-white/20 bg-[#0e121a] p-2 shadow-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border-sky-400 transition"
                onClick={() =>
                  setSelectedComp({
                    title: "Payload / Gimbal Camera Unit",
                    category: "Optical & Thermal Inspection Sensor",
                    spec: "3-Axis Brushless Gimbal &bull; 4K 60FPS",
                    description: "Stabilized payload unit controlled by Pixhawk AUX channels for pitch tilt and camera trigger.",
                    pins: ["Pitch PWM", "Yaw PWM", "Video Stream", "12V BEC", "GND"],
                    voltage: "12V Regulated",
                  })
                }
                onMouseEnter={() => setHoveredNet("Payload / Gimbal -> AUX Control")}
                onMouseLeave={() => setHoveredNet(null)}
              >
                <div className="w-5 h-5 rounded-full bg-neutral-800 border border-neutral-600 flex items-center justify-center text-sky-400">
                  <Camera size={11} />
                </div>
                <div className="text-[9px] font-bold text-white mt-1 leading-tight">
                  Payload /
                </div>
                <div className="text-[8px] font-mono text-neutral-400 leading-tight">
                  Gimbal
                </div>
              </div>

              {/* ================= BOTTOM ROW: BATTERY, POWER MODULE, PDB ================= */}
              {/* LiPo Battery (6S 22.2V) */}
              <div
                style={{ left: "65px", top: "525px", width: "155px", height: "70px" }}
                className="absolute z-20 rounded-xl border-2 border-red-500/60 bg-gradient-to-r from-[#181a24] to-[#0e1017] p-2.5 shadow-xl flex flex-col justify-between cursor-pointer hover:border-red-400 transition"
                onClick={() =>
                  setSelectedComp({
                    title: "6S High-Discharge LiPo Battery",
                    category: "Primary Power Source",
                    spec: "22.2V Nominal (25.2V Peak) &bull; 10000 – 22000 mAh",
                    description: "Heavy-duty 6S LiPo power reservoir capable of delivering up to 160A continuous current to the octocopter propulsion bus.",
                    pins: ["XT90-S Anti-Spark (+)", "XT90-S Negative (-)"],
                    voltage: "22.2V DC",
                  })
                }
                onMouseEnter={() => setHoveredNet("Battery 6S VBAT Heavy Bus")}
                onMouseLeave={() => setHoveredNet(null)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-white">LiPo Battery</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-bold">
                    6S
                  </span>
                </div>
                <div className="text-[9px] font-mono text-neutral-300">
                  6S (22.2 V)
                </div>
                <div className="text-[8px] font-mono text-neutral-400">
                  10000 – 22000 mAh
                </div>
              </div>

              {/* XT90 Yellow Connector Indicator */}
              <div
                style={{ left: "235px", top: "545px", width: "30px", height: "30px" }}
                className="absolute z-20 rounded-md bg-[#eab308] border border-amber-300 flex items-center justify-center text-[8px] font-black font-mono text-black shadow-md"
                title="XT90 Anti-Spark Connector"
              >
                XT90
              </div>

              {/* Power Module (PM) */}
              <div
                style={{ left: "285px", top: "530px", width: "75px", height: "60px" }}
                className="absolute z-20 rounded-xl border border-white/20 bg-[#0e121a] p-1.5 shadow-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-400 transition"
                onClick={() =>
                  setSelectedComp({
                    title: "Power Module (PM02 / PM06)",
                    category: "High-Current Shunt & Voltage Regulator",
                    spec: "Hall-Effect Current Sensor &bull; Dual 5.3V 3A BEC",
                    description: "Senses total battery voltage and current consumption while supplying clean 5.3V power to the flight controller.",
                    pins: ["6S IN", "6S OUT", "5.3V BEC", "Voltage Sense", "Current Sense", "GND"],
                    voltage: "6S -> 5.3V BEC",
                  })
                }
                onMouseEnter={() => setHoveredNet("5V Regulated Power & Current Sense")}
                onMouseLeave={() => setHoveredNet(null)}
              >
                <div className="text-[9px] font-bold text-white leading-tight">
                  Power Module
                </div>
                <div className="text-[8px] font-mono text-amber-400 font-bold mt-0.5">
                  (PM)
                </div>
              </div>

              {/* PDB (8 Outputs) */}
              <div
                style={{ left: "430px", top: "525px", width: "105px", height: "70px" }}
                className="absolute z-20 rounded-2xl border-2 border-amber-500/80 bg-[#090c14] p-2 shadow-2xl flex flex-col items-center justify-between text-center cursor-pointer hover:border-amber-400 transition"
                onClick={() =>
                  setSelectedComp({
                    title: "PDB (8 Outputs)",
                    category: "Power Distribution Board",
                    spec: "Heavy Copper 140A Continuous &bull; 8 Pairs",
                    description: "Multi-layer power distribution bus distributing 22.2V DC to all 8 ESC modules with minimal voltage drop.",
                    pins: ["Main 6S Input", "8x ESC V+", "8x ESC GND"],
                    voltage: "22.2V High-Current",
                  })
                }
                onMouseEnter={() => setHoveredNet("Power (V+) - 22.2 V (6S)")}
                onMouseLeave={() => setHoveredNet(null)}
              >
                {/* Gold corner solder pads */}
                <div className="w-full flex justify-between px-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-white">PDB</div>
                  <div className="text-[8px] font-mono text-amber-400 font-bold">
                    (8 Outputs)
                  </div>
                </div>
                <div className="w-full flex justify-between px-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </div>
              </div>
            </div>

            {/* Bottom-Left Viewport Controls */}
            <div className="absolute bottom-4 left-4 flex items-center gap-1 p-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 text-neutral-300 pointer-events-auto shadow-lg z-30">
              <button
                onClick={() => setZoomLevel(1.0)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 transition text-neutral-300 hover:text-white"
                title="Fit Canvas"
              >
                <Maximize2 size={13} />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 transition text-xs font-mono font-bold text-neutral-300 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn size={13} />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 transition text-xs font-mono font-bold text-neutral-300 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut size={13} />
              </button>
              <button
                onClick={() => setZoomLevel(1.0)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 transition text-neutral-300 hover:text-white"
                title="Reset Scale"
              >
                <Crosshair size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: LEGEND, MAPPING TABLE & NOTES ================= */}
        <div className="xl:col-span-3 space-y-4">
          {/* Card 1: Wiring Legend */}
          <div className="rounded-2xl border border-white/10 bg-[#070910] p-4 shadow-xl space-y-2.5">
            <div className="text-xs font-mono uppercase tracking-wider font-bold text-orange-400 border-b border-white/5 pb-2">
              Wiring Legend
            </div>

            <div className="space-y-2 text-xs font-mono">
              {[
                { label: "Power (V+) - 22.2 V (6S)", color: "#ef4444" },
                { label: "Ground (GND)", color: "#475569" },
                { label: "Motor Phase (A/B/C)", color: "#eab308" },
                { label: "ESC Signal (PWM / DShot)", color: "#0084ff" },
                { label: "Telemetry / Data (UART/I²C)", color: "#f97316" },
                { label: "Other Control / AUX", color: "#cbd5e1" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-neutral-300">
                  <div
                    className="w-7 h-1 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[11px] truncate">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: ESC – Flight Controller Mapping Table */}
          <div className="rounded-2xl border border-white/10 bg-[#070910] p-4 shadow-xl space-y-2.5">
            <div className="text-xs font-mono uppercase tracking-wider font-bold text-orange-400 border-b border-white/5 pb-2">
              ESC – Flight Controller Mapping
              <div className="text-[9px] text-neutral-400 font-normal lowercase tracking-normal">
                (Pixhawk Standard)
              </div>
            </div>

            <div className="rounded-xl border border-white/5 overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-white/5 text-neutral-400 text-[10px] uppercase border-b border-white/5">
                  <tr>
                    <th className="p-2">ESC</th>
                    <th className="p-2">Motor</th>
                    <th className="p-2 text-right">FC Output</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-300 text-[11px]">
                  {motorPositions.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-white/[0.04] transition cursor-pointer"
                      onClick={() =>
                        setHoveredNet(`ESC Signal ${p.escLabel} -> ${p.fcPin}`)
                      }
                    >
                      <td className="p-2 font-bold text-white">{p.escLabel}</td>
                      <td className="p-2 text-orange-400 font-bold">{p.mLabel}</td>
                      <td className="p-2 text-right text-sky-400 font-bold">{p.fcPin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 3: Notes Card */}
          <div className="rounded-2xl border border-white/10 bg-[#070910] p-4 shadow-xl space-y-2.5">
            <div className="text-xs font-mono uppercase tracking-wider font-bold text-orange-400 flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Info size={14} />
              <span>Notes</span>
            </div>

            <ul className="space-y-2 text-[11px] text-neutral-300 font-sans leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">&bull;</span>
                <span>Use 6S LiPo with suitable current rating (&ge; 40C).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">&bull;</span>
                <span>ESC rating should be &ge; motor load (40A – 60A).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">&bull;</span>
                <span>Power Module provides stable 5V to Flight Controller.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">&bull;</span>
                <span>Keep power and signal wires separately routed.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">&bull;</span>
                <span>Use reliable connectors (XT60/XT90) and proper wire gauge (12 – 14 AWG for main power).</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ================= COMPONENT DETAIL MODAL / DRAWER ================= */}
      {selectedComp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-md w-full rounded-2xl border border-white/20 bg-[#0c101a] p-5 shadow-2xl space-y-4 text-white">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold">
                  {selectedComp.voltage}
                </span>
                <h3 className="text-lg font-black text-white mt-1.5">{selectedComp.title}</h3>
                <p className="text-xs text-neutral-400 font-mono">{selectedComp.category}</p>
              </div>
              <button
                onClick={() => setSelectedComp(null)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 flex items-center justify-center text-xs cursor-pointer"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">{selectedComp.description}</p>

            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <div className="text-[10px] font-mono uppercase text-neutral-400">Connected Pinouts / Ports:</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedComp.pins.map((pin, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 border border-white/10 text-neutral-200"
                  >
                    {pin}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="text-[10px] font-mono uppercase text-neutral-400">Buy Component (Indian Sourcing):</div>
              <BuyLinkButtons componentName={selectedComp.title} compact={false} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

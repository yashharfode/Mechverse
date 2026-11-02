"use client";

import React, { useState, useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ArrowRight, ChevronDown, Camera } from "lucide-react";
import { AppTheme, CustomizationSettings, MachineId, RobotSimulationState } from "@/types/machine";
import { TOKENS } from "@/constants/designTokens";
import DroneBModel from "@/components/3d/DroneBModel";
import RoboRumbleVehicleModel from "@/components/3d/RoboRumbleVehicleModel";
import WalkingRobotModel from "@/components/3d/WalkingRobotModel";

interface HeroSceneProps {
  theme?: AppTheme;
  onLaunchStudio: (machineId?: MachineId) => void;
  onOpenAR?: (machineId?: MachineId) => void;
}

// Customizations matching the reference composition
const DRONE_B_SETTINGS = {
  paintColor: "#0f172a",
  droneBChassisColor: "#0f172a", // Deep dark carbon fuselage
  droneBArmColor: "#FF6A1A",     // Signal orange structural arms
  droneBMotorColor: "#1e293b",
  droneBPropellerColor: "#020617",
} as unknown as CustomizationSettings;

const COMBAT_BOT_SETTINGS = {
  paintColor: "#FF6A1A",
  finish: "metallic",
  wheelStyle: "sport",
  rimColor: "#1e293b",
  bodyParts: { spoiler: true, sideSkirts: true, frontSplitter: true, rearDiffuser: true },
} as unknown as CustomizationSettings;

const WALKER_SETTINGS = {} as unknown as CustomizationSettings;

const WALKER_SIMULATION: RobotSimulationState = {
  walking: true,
  speed: "slow",
  forwardMovement: false,
  showKinematicGhost: false,
};

function IndustrialStudioStage({
  hoveredMachine,
  onHoverMachine,
  onSelectMachine,
  theme = "dark",
}: {
  hoveredMachine: MachineId | null;
  onHoverMachine: (id: MachineId | null) => void;
  onSelectMachine: (id: MachineId) => void;
  theme?: AppTheme;
}) {
  const isLight = theme === "light";
  const droneGroupRef = useRef<THREE.Group>(null);
  const combatBotGroupRef = useRef<THREE.Group>(null);
  const walkerGroupRef = useRef<THREE.Group>(null);
  const orbitLightRef = useRef<THREE.PointLight>(null);

  const { width } = useThree((state) => state.viewport);
  const isMobile = width < 3.4;

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Center Drone B: Hero prominence, smooth hovering dynamics
    if (droneGroupRef.current) {
      const isHovered = hoveredMachine === "drone-b";
      const targetScale = isMobile
        ? (isHovered ? 0.92 : 0.86)
        : (isHovered ? 1.16 : 1.10);
      droneGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);

      // Delicate floating motion lowered cleanly below labels
      droneGroupRef.current.position.y = -0.16 + Math.sin(t * 1.6) * 0.016;
      droneGroupRef.current.rotation.y = Math.sin(t * 0.35) * 0.08;
      droneGroupRef.current.rotation.x = Math.sin(t * 1.1) * 0.015;
      droneGroupRef.current.rotation.z = Math.cos(t * 0.9) * 0.015;
    }

    // Left Combat Bot: brought close to center drone, well inside screen
    if (combatBotGroupRef.current) {
      const isHovered = hoveredMachine === "robo-rumble";
      const targetScale = isMobile
        ? (isHovered ? 0.40 : 0.36)
        : (isHovered ? 0.54 : 0.50);
      combatBotGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
      combatBotGroupRef.current.rotation.y = 0.42 + Math.sin(t * 0.3) * 0.015;
    }

    // Right Walker: brought close to center drone, well inside screen
    if (walkerGroupRef.current) {
      const isHovered = hoveredMachine === "walking-robot";
      const targetScale = isMobile
        ? (isHovered ? 0.38 : 0.34)
        : (isHovered ? 0.50 : 0.46);
      walkerGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
      walkerGroupRef.current.rotation.y = -0.42 + Math.cos(t * 0.3) * 0.015;
    }

    // Pedestal glow pulse
    if (orbitLightRef.current) {
      orbitLightRef.current.intensity = 3.2 + Math.sin(t * 2.5) * 0.4;
    }
  });

  return (
    <>
      {/* Studio Fog */}
      <fog attach="fog" args={["#07080A", 4.0, 11.0]} />

      {/* Lighting Architecture */}
      <ambientLight intensity={0.4} />

      {/* Main Overhead Soft Key Light */}
      <directionalLight position={[0, 9, 4]} intensity={1.7} color="#ffffff" />

      {/* Industrial Side Key & Rim Lights */}
      <spotLight
        position={[-6, 4.5, -2]}
        intensity={2.8}
        color="#e2e8f0"
        angle={0.65}
        penumbra={0.9}
      />
      <spotLight
        position={[6, 4.5, -2]}
        intensity={2.8}
        color="#e2e8f0"
        angle={0.65}
        penumbra={0.9}
      />

      {/* Pedestal Orange Glow Ring & Uplight */}
      <pointLight
        ref={orbitLightRef}
        position={[0, -0.46, 0]}
        color={TOKENS.colors.accent}
        intensity={3.2}
        distance={4.5}
      />
      <pointLight position={[0, -0.06, 0]} color={TOKENS.colors.accent} intensity={1.2} distance={2.5} />

      {/* Background Overhead White Industrial Light Strips (Left & Right) */}
      <group position={[-4.5, 2.4, -3.5]} rotation={[0.08, 0.4, -0.65]}>
        <mesh>
          <cylinderGeometry args={[0.035, 0.035, 3.5, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      <group position={[4.5, 2.4, -3.5]} rotation={[-0.08, -0.4, 0.65]}>
        <mesh>
          <cylinderGeometry args={[0.035, 0.035, 3.5, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* ================= 1. LEFT MACHINE: RR-01 COMBAT ROBOT ================= */}
      <group
        ref={combatBotGroupRef}
        position={[isMobile ? -0.82 : -1.15, -0.50, 0.35]}
        scale={0.50}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHoverMachine("robo-rumble");
        }}
        onPointerOut={() => onHoverMachine(null)}
        onClick={(e) => {
          e.stopPropagation();
          onSelectMachine("robo-rumble");
        }}
      >
        <RoboRumbleVehicleModel
          customization={COMBAT_BOT_SETTINGS}
          explosionLevel={0}
          selectedComponent={null}
          isolatedComponent={null}
          hiddenComponents={[]}
          onSelect={() => onSelectMachine("robo-rumble")}
          wheelRotationSpeed={0.8}
          position={[0, 0, 0]}
          scale={0.92}
        />
      </group>

      {/* ================= 2. CENTER MACHINE: DRONE B ON GLOWING PEDESTAL ================= */}
      <group position={[0, -0.60, 0]}>
        {/* Dark Cylindrical Pedestal */}
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[isMobile ? 0.48 : 0.62, isMobile ? 0.54 : 0.68, 0.14, 64]} />
          <meshStandardMaterial color="#0c0e12" roughness={0.25} metalness={0.75} />
        </mesh>

        {/* Emissive Orange Neon Ring around top rim of pedestal */}
        <mesh position={[0, 0.142, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[isMobile ? 0.48 : 0.62, 0.011, 16, 64]} />
          <meshStandardMaterial
            color={TOKENS.colors.accent}
            emissive={TOKENS.colors.accent}
            emissiveIntensity={3.6}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Hovering Drone B (Center Hero) */}
      <group
        ref={droneGroupRef}
        position={[0, -0.16, 0]}
        scale={1.10}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHoverMachine("drone-b");
        }}
        onPointerOut={() => onHoverMachine(null)}
        onClick={(e) => {
          e.stopPropagation();
          onSelectMachine("drone-b");
        }}
      >
        <DroneBModel
          customization={DRONE_B_SETTINGS}
          explosionLevel={0}
          selectedComponent={null}
          isolatedComponent={null}
          hiddenComponents={[]}
          onSelect={() => onSelectMachine("drone-b")}
          isArmed={true}
        />
      </group>

      {/* ================= 3. RIGHT MACHINE: TJ-01 WALKING MECHANISM ================= */}
      <group
        ref={walkerGroupRef}
        position={[isMobile ? 0.82 : 1.15, -0.50, 0.35]}
        scale={0.46}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHoverMachine("walking-robot");
        }}
        onPointerOut={() => onHoverMachine(null)}
        onClick={(e) => {
          e.stopPropagation();
          onSelectMachine("walking-robot");
        }}
      >
        <WalkingRobotModel
          customization={WALKER_SETTINGS}
          explosionLevel={0}
          selectedComponent={null}
          isolatedComponent={null}
          hiddenComponents={[]}
          simulation={WALKER_SIMULATION}
          onSelect={() => onSelectMachine("walking-robot")}
        />
      </group>

      {/* Highly Reflective Industrial Wet Studio Ground */}
      <mesh position={[0, -0.605, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[28, 28]} />
        <meshStandardMaterial
          color={isLight ? "#e2e8f0" : "#060709"}
          roughness={isLight ? 0.35 : 0.15}
          metalness={isLight ? 0.05 : 0.85}
        />
      </mesh>

      {/* Subtle Engineering Grid on floor */}
      <gridHelper
        args={[24, 48, isLight ? "#94a3b8" : "#222a36", isLight ? "#cbd5e1" : "#0e1218"]}
        position={[0, -0.60, 0]}
      />
    </>
  );
}

export default function HeroScene({ onLaunchStudio, onOpenAR, theme = "dark" }: HeroSceneProps) {
  const isLight = theme === "light";
  const [hoveredMachine, setHoveredMachine] = useState<MachineId | null>(null);

  return (
    <section
      id="hero"
      className={`relative w-full h-[100svh] min-h-[640px] flex flex-col justify-between overflow-hidden select-none transition-colors duration-300 ${
        isLight ? "bg-[#f8fafc]" : "bg-[#07080A]"
      }`}
    >
      {/* Background Studio Vignette Gradient */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: isLight
            ? `
              radial-gradient(circle at 50% 20%, rgba(0,0,0,0.02) 0%, transparent 60%),
              radial-gradient(circle at 50% 75%, rgba(255,106,26,0.05) 0%, transparent 50%),
              linear-gradient(to bottom, rgba(248,250,252,0.85) 0%, transparent 18%, transparent 80%, rgba(248,250,252,0.98) 100%)
            `
            : `
              radial-gradient(circle at 50% 20%, rgba(255,255,255,0.03) 0%, transparent 60%),
              radial-gradient(circle at 50% 75%, rgba(255,106,26,0.06) 0%, transparent 50%),
              linear-gradient(to bottom, rgba(7,8,10,0.85) 0%, transparent 18%, transparent 80%, rgba(7,8,10,0.98) 100%)
            `,
        }}
      />

      {/* ================= 1. EDITORIAL HEADLINE & SANS SUBTITLE (CLEAN HIERARCHY) ================= */}
      <div className="relative z-20 w-full pt-20 sm:pt-24 md:pt-26 text-center px-4 flex flex-col items-center pointer-events-none">
        <h1
          className={`font-serif-headline text-2xl sm:text-4xl md:text-5xl lg:text-[2.65rem] tracking-[0.04em] uppercase font-normal leading-snug sm:leading-[1.12] select-text max-w-3xl ${
            isLight ? "text-slate-900" : "text-white"
          }`}
        >
          FOR THOSE WHO
          <br />
          <span className="italic font-bold text-[#FF6A1A] mr-2 sm:mr-3">BUILD</span>
          BEYOND ORDINARY.
        </h1>

        {/* Clean Editorial Subtitle - Guaranteed clearance from 3D models */}
        <p
          className={`mt-2 text-xs sm:text-sm font-sans tracking-[0.22em] font-medium uppercase select-text ${
            isLight ? "text-slate-600" : "text-[#94A3B8]"
          }`}
        >
          Design. Simulate. Build real machines.
        </p>
      </div>

      {/* ================= 2. REAL 3D CANVAS SHOWCASE ================= */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Canvas
          camera={{ position: [0, 0.40, 4.4], fov: 38 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <IndustrialStudioStage
              hoveredMachine={hoveredMachine}
              onHoverMachine={setHoveredMachine}
              onSelectMachine={(id) => onLaunchStudio(id)}
              theme={theme}
            />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              target={[0, -0.20, 0]}
              minPolarAngle={Math.PI / 2.8}
              maxPolarAngle={Math.PI / 2.05}
              minAzimuthAngle={-Math.PI / 6}
              maxAzimuthAngle={Math.PI / 6}
              dampingFactor={0.05}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* ================= 3. AUTHENTIC HIGH-CONTRAST CAD HUD LABELS & LEADER LINES ================= */}
      <div className="absolute inset-0 w-full h-full z-20 pointer-events-none max-w-7xl mx-auto px-4 sm:px-8 md:px-12">
        <div className="relative w-full h-full">

          {/* ----- CARD 1: RR-01 COMBAT ROBOT (LEFT - BESIDE COMBAT VEHICLE) ----- */}
          <div
            onClick={() => onLaunchStudio("robo-rumble")}
            onMouseEnter={() => setHoveredMachine("robo-rumble")}
            onMouseLeave={() => setHoveredMachine(null)}
            className={`absolute left-[2%] sm:left-[4%] lg:left-[6%] top-[48%] md:top-[47%] text-left pointer-events-auto cursor-pointer transition-all duration-300 group ${
              hoveredMachine === "robo-rumble" ? "scale-105" : "opacity-95 hover:opacity-100"
            }`}
          >
            <div
              className={`border backdrop-blur-md px-3.5 py-2 rounded-xl transition-all duration-200 flex flex-col gap-0.5 shadow-xl ${
                isLight
                  ? "bg-white/95 border-slate-300 hover:border-orange-500 shadow-slate-300/50"
                  : "bg-[#0b0f19]/90 border-slate-700/80 hover:border-orange-500/80 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_#ff6a1a]" />
                <span className="text-[10px] sm:text-xs font-mono-tech tracking-[0.14em] font-bold uppercase whitespace-nowrap text-orange-500">
                  RR-01 / COMBAT ROBOT
                </span>
              </div>
              <div
                className={`flex items-center gap-1.5 text-[8px] sm:text-[9px] font-mono-tech tracking-wider uppercase ${
                  isLight ? "text-slate-600" : "text-slate-400"
                }`}
              >
                <span>ESP32 CONTROL</span>
                <span className="opacity-40">•</span>
                <span>4WD RAMP</span>
              </div>
            </div>
            {/* Leader Line extending right and down toward combat bot */}
            <svg
              width="90"
              height="28"
              viewBox="0 0 90 28"
              fill="none"
              className={`transition-colors duration-200 mt-1 ml-2 ${
                hoveredMachine === "robo-rumble" ? "stroke-[#FF6A1A]" : isLight ? "stroke-slate-400" : "stroke-white/40"
              }`}
            >
              <path d="M0 1H55L85 26" strokeWidth="1.5" strokeDasharray="3 2" />
            </svg>
          </div>

          {/* ----- CARD 2: DRONE-B OCTOCOPTER (CENTER - HOVERING DIRECTLY ABOVE DRONE) ----- */}
          <div
            onClick={() => onLaunchStudio("drone-b")}
            onMouseEnter={() => setHoveredMachine("drone-b")}
            onMouseLeave={() => setHoveredMachine(null)}
            className={`absolute left-1/2 -translate-x-1/2 top-[41%] sm:top-[40%] text-center pointer-events-auto cursor-pointer transition-all duration-300 flex flex-col items-center group ${
              hoveredMachine === "drone-b" ? "scale-105" : "opacity-95 hover:opacity-100"
            }`}
          >
            <div
              className={`border backdrop-blur-md px-4 py-2 rounded-xl transition-all duration-200 flex flex-col items-center gap-0.5 shadow-xl ${
                isLight
                  ? "bg-white/95 border-slate-300 hover:border-orange-500 shadow-slate-300/50"
                  : "bg-[#0b0f19]/90 border-slate-700/80 hover:border-orange-500/80 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_#ff6a1a]" />
                <span className="text-[10px] sm:text-xs font-mono-tech tracking-[0.14em] font-bold uppercase whitespace-nowrap text-orange-500">
                  DRONE-B / HEAVY OCTOCOPTER
                </span>
              </div>
              <div
                className={`flex items-center gap-1.5 text-[8px] sm:text-[9px] font-mono-tech tracking-widest uppercase ${
                  isLight ? "text-slate-600" : "text-slate-400"
                }`}
              >
                <span>400Hz DYNAMICS</span>
                <span className="opacity-40">•</span>
                <span>COAXIAL HULL</span>
              </div>
            </div>
            {/* Vertical leader line dropping down towards drone */}
            <svg
              width="2"
              height="22"
              viewBox="0 0 2 22"
              fill="none"
              className={`mt-1 transition-colors duration-200 ${
                hoveredMachine === "drone-b" ? "stroke-[#FF6A1A]" : isLight ? "stroke-slate-400" : "stroke-white/40"
              }`}
            >
              <line x1="1" y1="0" x2="1" y2="22" strokeWidth="1.5" strokeDasharray="3 2" />
            </svg>
          </div>

          {/* ----- CARD 3: TJ-01 WALKING MECHANISM (RIGHT - BESIDE LINKAGE) ----- */}
          <div
            onClick={() => onLaunchStudio("walking-robot")}
            onMouseEnter={() => setHoveredMachine("walking-robot")}
            onMouseLeave={() => setHoveredMachine(null)}
            className={`absolute right-[2%] sm:right-[4%] lg:right-[6%] top-[48%] md:top-[47%] text-right pointer-events-auto cursor-pointer transition-all duration-300 flex flex-col items-end group ${
              hoveredMachine === "walking-robot" ? "scale-105" : "opacity-95 hover:opacity-100"
            }`}
          >
            <div
              className={`border backdrop-blur-md px-3.5 py-2 rounded-xl transition-all duration-200 flex flex-col gap-0.5 items-end shadow-xl ${
                isLight
                  ? "bg-white/95 border-slate-300 hover:border-cyan-500 shadow-slate-300/50"
                  : "bg-[#0b0f19]/90 border-slate-700/80 hover:border-cyan-500/80 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] sm:text-xs font-mono-tech tracking-[0.14em] font-bold uppercase whitespace-nowrap text-cyan-400">
                  TJ-01 / STRIDER WALKING ROBOT
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              </div>
              <div
                className={`flex items-center gap-1.5 text-[8px] sm:text-[9px] font-mono-tech tracking-wider uppercase ${
                  isLight ? "text-slate-600" : "text-slate-400"
                }`}
              >
                <span>8-LEG JANSEN LINKAGE</span>
                <span className="opacity-40">•</span>
                <span>GEARED DC</span>
              </div>
            </div>
            {/* Leader Line extending left and down toward walker linkage */}
            <svg
              width="90"
              height="28"
              viewBox="0 0 90 28"
              fill="none"
              className={`ml-auto transition-colors duration-200 mt-1 mr-2 ${
                hoveredMachine === "walking-robot" ? "stroke-cyan-400" : isLight ? "stroke-slate-400" : "stroke-white/40"
              }`}
            >
              <path d="M90 1H35L5 26" strokeWidth="1.5" strokeDasharray="3 2" />
            </svg>
          </div>

        </div>
      </div>

      {/* ================= 4. REAL FUNCTIONAL CTA BUTTONS & SCROLL INDICATOR ================= */}
      <div className="relative z-30 w-full pb-6 sm:pb-8 flex flex-col items-center gap-3 sm:gap-5 pointer-events-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 w-full max-w-xs sm:max-w-none px-4">
          {/* Primary Orange Button: EXPLORE MACHINES → */}
          <a
            href="#catalog"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="w-full sm:w-auto text-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs font-mono-tech font-semibold tracking-wider text-white flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer shadow-lg hover:brightness-110"
            style={{
              backgroundColor: TOKENS.colors.accent,
              boxShadow: `0 0 25px ${TOKENS.colors.accentGlow}`,
            }}
          >
            <span>EXPLORE MACHINES</span>
            <ArrowRight size={14} />
          </a>

          {/* Secondary Button: ENTER 3D STUDIO */}
          <button
            onClick={() => onLaunchStudio()}
            className={`w-full sm:w-auto text-center justify-center px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs font-mono-tech font-medium tracking-wider backdrop-blur-md border transition-all transform active:scale-95 cursor-pointer uppercase shadow-lg ${
              isLight
                ? "text-slate-900 bg-white/95 border-slate-300 hover:border-slate-400 hover:bg-slate-100"
                : "text-white bg-[#0F1114]/85 border-white/20 hover:border-white/50 hover:bg-[#161A1F]"
            }`}
          >
            <span>ENTER 3D STUDIO</span>
          </button>

          {/* Web AR Interactive Experience Button */}
          <button
            onClick={() => (onOpenAR ? onOpenAR("drone-b") : onLaunchStudio("drone-b"))}
            className={`w-full sm:w-auto text-center justify-center px-5 sm:px-6 py-3 sm:py-3.5 rounded-full text-xs font-mono-tech font-semibold tracking-wider text-[#FF6A1A] backdrop-blur-md border border-[#FF6A1A]/40 hover:border-[#FF6A1A] hover:bg-[#FF6A1A]/10 transition-all transform active:scale-95 cursor-pointer uppercase shadow-lg flex items-center gap-2 ${
              isLight ? "bg-white/95" : "bg-[#0F1114]/90"
            }`}
          >
            <Camera size={14} />
            <span>VIEW IN AR</span>
          </button>
        </div>

        {/* Minimal Animated Mouse Scroll Indicator with Smooth Scroll */}
        <button
          onClick={(e) => {
            e.preventDefault();
            const target = document.getElementById("reveal") || document.getElementById("showcase");
            if (target) {
              target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 cursor-pointer pt-1 group ${
            isLight ? "text-slate-500 hover:text-slate-900" : "text-slate-400 hover:text-white"
          }`}
          aria-label="Scroll Down to Reveal Section"
        >
          <span className="text-[10px] font-mono-tech tracking-widest uppercase opacity-75 group-hover:opacity-100 group-hover:text-orange-500 transition-all">
            Scroll to Explore
          </span>
          <div
            className={`w-4 h-7 rounded-full border group-hover:border-orange-500/80 flex items-start justify-center p-1 transition-colors ${
              isLight ? "border-slate-400" : "border-white/30"
            }`}
          >
            <div className="w-1 h-1.5 rounded-full bg-orange-400 animate-bounce mt-0.5 shadow-[0_0_6px_#ff6a1a]" />
          </div>
          <ChevronDown
            size={14}
            className={`group-hover:text-orange-500 -mt-0.5 transition-colors ${
              isLight ? "text-slate-400" : "text-white/40"
            }`}
          />
        </button>
      </div>
    </section>
  );
}

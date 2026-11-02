"use client";

import React, { useRef, Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { Compass, Move, ZoomIn, RotateCcw } from "lucide-react";
import { DesignLabConfiguration, DesignLabTemplateId } from "@/types/design-lab";
import { CustomizationSettings } from "@/types/machine";
import AeroDroneModel from "@/components/3d/AeroDroneModel";
import RoboRacerModel from "@/components/3d/RoboRacerModel";
import WalkingRobotModel from "@/components/3d/WalkingRobotModel";
import ElectricFanModel from "@/components/3d/ElectricFanModel";

interface DesignLabViewportProps {
  templateId: DesignLabTemplateId;
  config: DesignLabConfiguration;
  onSelectComponent?: (id: string) => void;
}

function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      {/* Main Overhead Soft Key Light */}
      <directionalLight position={[5, 10, 7]} intensity={1.8} color="#ffffff" />
      {/* Cool Rim Light */}
      <directionalLight position={[-6, 5, -5]} intensity={0.9} color="#94a3b8" />
      {/* Signature Design Lab Orange Backlight */}
      <pointLight position={[0, 0.8, -1.8]} intensity={3.5} color="#ff5500" distance={8} />
      <pointLight position={[0, -0.2, 0]} intensity={1.2} color="#ff7733" distance={5} />
    </>
  );
}

export default function DesignLabViewport({
  templateId,
  config,
  onSelectComponent = () => {},
}: DesignLabViewportProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Compute effective hidden components including toggle options
  const computedHiddenComponents = useMemo(() => {
    const list = [...config.hiddenComponents];

    if (templateId === "f450-quadcopter") {
      if (config.options.gpsModule === false && !list.includes("gps-mast")) {
        list.push("gps-mast");
      }
      if (config.options.cameraMount === false && !list.includes("camera-unit")) {
        list.push("camera-unit");
      }
      if (config.options.landingSkids === false && !list.includes("landing-skids")) {
        list.push("landing-skids");
      }
      if (config.options.batteryPack === false && !list.includes("battery")) {
        list.push("battery");
      }
    }

    if (templateId === "rover-bot") {
      if (config.options.lidarTurret === false && !list.includes("lidar-unit")) {
        list.push("lidar-unit");
      }
      if (config.options.frontBumper === false && !list.includes("bumper")) {
        list.push("bumper");
      }
      if (config.options.rearSpoiler === false && !list.includes("spoiler")) {
        list.push("spoiler");
      }
    }

    if (templateId === "table-fan") {
      if (config.options.frontGrill === false && !list.includes("front-cage")) {
        list.push("front-cage");
      }
    }

    return list;
  }, [config.hiddenComponents, config.options, templateId]);

  // Model-specific customization props
  const customSettings: CustomizationSettings = useMemo(() => {
    return {
      paintColor: config.frameColor,
      finish: "metallic",
      droneArmColorRear: config.frameColor,
      droneArmColorFront: config.accentColor || "#f8fafc",
      droneFrameSize: 450,
      droneMotorColor: "#1e293b",
      dronePropellerColor: "#0f172a",
      bodyParts: {
        spoiler: !!config.options.rearSpoiler,
        sideSkirts: true,
        frontSplitter: !!config.options.frontBumper,
        rearDiffuser: true,
      },
    } as unknown as CustomizationSettings;
  }, [config.frameColor, config.accentColor, config.options]);

  // Reset Camera View
  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="flex-1 relative w-full h-full min-h-[480px] bg-[#0c0d12] overflow-hidden flex flex-col justify-between select-none">
      {/* Background Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 50% 55%, rgba(255, 85, 0, 0.12) 0%, transparent 65%),
            radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.02) 0%, transparent 40%),
            linear-gradient(to bottom, #0c0d12 0%, transparent 20%, transparent 80%, #0c0d12 100%)
          `,
        }}
      />

      {/* ================= TOP HEADER OVERLAY MATCHING SCREENSHOT ================= */}
      <div className="relative z-10 p-6 sm:p-8 pointer-events-none text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>Customize</span>
          <span className="text-[#ff5500] drop-shadow-[0_0_20px_rgba(255,85,0,0.4)]">
            Your Design
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1 font-medium max-w-md">
          Modify components, colors and configuration in real time.
        </p>
      </div>

      {/* ================= 3D VIEWPORT CANVAS ================= */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Canvas
          camera={{ position: [0.9, 0.8, 1.3], fov: 42 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <StudioLights />

            {/* Model Rendering Switcher */}
            <group position={[0, -0.15, 0]}>
              {templateId === "f450-quadcopter" && (
                <AeroDroneModel
                  customization={customSettings}
                  explosionLevel={0}
                  selectedComponent={config.selectedComponentId}
                  isolatedComponent={null}
                  hiddenComponents={computedHiddenComponents}
                  onSelect={onSelectComponent}
                  isArmed={true}
                  throttlePct={5}
                />
              )}

              {templateId === "rover-bot" && (
                <group scale={1.2}>
                  <RoboRacerModel
                    customization={customSettings}
                    explosionLevel={0}
                    selectedComponent={config.selectedComponentId}
                    isolatedComponent={null}
                    hiddenComponents={computedHiddenComponents}
                    onSelect={onSelectComponent}
                  />
                </group>
              )}

              {templateId === "walking-robot" && (
                <group scale={0.9} position={[0, 0.1, 0]}>
                  <WalkingRobotModel
                    customization={customSettings}
                    explosionLevel={0}
                    selectedComponent={config.selectedComponentId}
                    isolatedComponent={null}
                    hiddenComponents={computedHiddenComponents}
                    onSelect={onSelectComponent}
                    simulation={{
                      walking: true,
                      speed: "slow",
                      forwardMovement: false,
                      showKinematicGhost: false,
                    }}
                  />
                </group>
              )}

              {templateId === "table-fan" && (
                <group scale={0.9} position={[0, -0.1, 0]}>
                  <ElectricFanModel
                    paintColor={config.frameColor}
                    bladeColor={config.accentColor || "#0f172a"}
                    baseColor="#1e293b"
                    explosionLevel={0}
                    selectedComponent={config.selectedComponentId}
                    isolatedComponent={null}
                    hiddenComponents={computedHiddenComponents}
                    onSelect={onSelectComponent}
                    simulation={{
                      power: true,
                      speed: 1,
                      oscillating: false,
                      tiltAngle: 0,
                    }}
                  />
                </group>
              )}
            </group>

            {/* Studio Floor Grid */}
            <gridHelper
              args={[12, 24, "#262b36", "#14171f"]}
              position={[0, -0.45, 0]}
            />

            <OrbitControls
              ref={controlsRef}
              makeDefault
              enableDamping
              dampingFactor={0.05}
              minDistance={0.5}
              maxDistance={4.5}
              maxPolarAngle={Math.PI / 2.05}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* ================= BOTTOM CAMERA DOCK MATCHING SCREENSHOT ================= */}
      <div className="relative z-10 pb-6 flex items-center justify-center pointer-events-none">
        <div className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 rounded-2xl bg-black/75 border border-white/10 backdrop-blur-xl shadow-2xl pointer-events-auto text-xs font-semibold text-gray-300">
          <div className="flex items-center gap-1 px-2.5 py-1 text-gray-300">
            <Compass size={14} className="text-[#ff7733]" />
            <span>Rotate</span>
          </div>

          <div className="w-px h-3.5 bg-white/15" />

          <div className="flex items-center gap-1 px-2.5 py-1 text-gray-300">
            <Move size={14} className="text-gray-400" />
            <span>Pan</span>
          </div>

          <div className="w-px h-3.5 bg-white/15" />

          <div className="flex items-center gap-1 px-2.5 py-1 text-gray-300">
            <ZoomIn size={14} className="text-gray-400" />
            <span>Zoom</span>
          </div>

          <div className="w-px h-3.5 bg-white/15" />

          {/* Reset Camera Button */}
          <button
            onClick={handleResetCamera}
            className="flex items-center gap-1 px-2.5 py-1 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
            title="Reset to default isometric camera angle"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}

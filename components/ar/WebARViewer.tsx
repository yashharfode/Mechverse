"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  X,
  FlipHorizontal,
  Crosshair,
  Layers,
  RotateCw,
  RotateCcw,
  Maximize,
  Compass,
  CheckCircle2,
  Lock,
  Unlock,
  Move,
  Sliders,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { CustomizationSettings, MachineId } from "@/types/machine";
import WebARModelRenderer from "./WebARModelRenderer";

interface WebARViewerProps {
  machineId: MachineId;
  customization: CustomizationSettings;
  onClose: () => void;
  onSelectMachine: (id: MachineId) => void;
}

const AR_MACHINES: { id: MachineId; name: string }[] = [
  { id: "drone-b", name: "Drone-B" },
  { id: "aero-450", name: "Aero-450" },
  { id: "esp32-drone", name: "ESP32 Drone" },
  { id: "robo-rumble", name: "Combat Robot" },
  { id: "robo-racer", name: "Robo-Racer" },
  { id: "walking-robot", name: "Walking Robot" },
  { id: "sports-car", name: "Sports Car" },
  { id: "electric-fan", name: "Electric Fan" },
];

/**
 * Interactive Floor Raycast Plane
 * Detects taps/clicks on the horizontal ground plane (Y = 0) to reposition the model
 */
function FloorHitDetector({
  onHit,
}: {
  onHit: (point: [number, number, number]) => void;
}) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onHit([e.point.x, 0, e.point.z]);
      }}
      visible={false}
    >
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

export default function WebARViewer({
  machineId,
  customization,
  onClose,
  onSelectMachine,
}: WebARViewerProps) {
  // Video & Camera stream state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);

  // Floor Detection & Tracking State Machine
  const [trackingStatus, setTrackingStatus] = useState<"scanning" | "detected" | "anchored">("scanning");
  const [surfaceMode, setSurfaceMode] = useState<"floor" | "desk">("floor");
  const [heightNudgeCm, setHeightNudgeCm] = useState<number>(0);
  const [isAnchored, setIsAnchored] = useState<boolean>(true);
  const [anchorPosition, setAnchorPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(1.0);
  const [showFloorGrid, setShowFloorGrid] = useState<boolean>(true);
  const [showControlsDrawer, setShowControlsDrawer] = useState<boolean>(false);

  // Initialize Camera stream with environmental (back camera) priority
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevs = devices.filter((d) => d.kind === "videoinput");
          setAvailableCameras(videoDevs);
        }

        const constraints: MediaStreamConstraints = {
          audio: false,
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(() => {});
          };
          setCameraActive(true);
        }
      } catch {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
            setCameraActive(true);
          }
        } catch {
          setCameraActive(false);
        }
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  // Simulated LiDAR Floor Plane Acquisition
  useEffect(() => {
    setTrackingStatus("scanning");
    const scanTimer = setTimeout(() => {
      setTrackingStatus("detected");
    }, 1400);

    const lockTimer = setTimeout(() => {
      setTrackingStatus("anchored");
    }, 2800);

    return () => {
      clearTimeout(scanTimer);
      clearTimeout(lockTimer);
    };
  }, [machineId, surfaceMode]);

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  // Floor plane tap reposition
  const handleFloorTap = (point: [number, number, number]) => {
    setAnchorPosition(point);
    setTrackingStatus("anchored");
  };

  // Camera perspective based on chosen surface mode
  // Standing Floor: Camera at Y = 1.45m looking down at floor plane (Y = 0)
  // Desk / Tabletop: Camera at Y = 0.75m looking down at desk plane (Y = 0)
  const cameraEyeY = (surfaceMode === "floor" ? 1.45 : 0.75) + heightNudgeCm / 100;
  const cameraZ = surfaceMode === "floor" ? 2.1 : 1.3;

  return (
    <div className="relative w-full h-full bg-[#05070a] overflow-hidden select-none">
      {/* 1. Camera Video Background Feed */}
      <video
        ref={videoRef}
        playsInline
        autoPlay
        muted
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-500 ${
          cameraActive ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Subtle fallback background grid if camera is off */}
      {!cameraActive && (
        <div
          className="absolute inset-0 z-0 bg-[#07080A] opacity-35 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle, #f97316 0.8px, transparent 0.8px),
              linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
            `,
            backgroundSize: "36px 36px, 18px 18px, 18px 18px",
          }}
        />
      )}

      {/* 2. Interactive Transparent 3D Canvas with Floor-Anchored Raycasting */}
      <div className="absolute inset-0 w-full h-full z-10 pointer-events-auto">
        <Canvas
          key={`${surfaceMode}-${heightNudgeCm}`}
          gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
          camera={{ position: [0, cameraEyeY, cameraZ], fov: 46 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            {/* Floor Plane Raycast Detector for Tap-To-Anchor */}
            <FloorHitDetector onHit={handleFloorTap} />

            <WebARModelRenderer
              machineId={machineId}
              customization={customization}
              explosionLevel={0}
              scale={scaleMultiplier}
              rotationY={rotationAngle}
              anchorPosition={anchorPosition}
              torchEnabled={false}
              showReticle={true}
              showFloorGrid={showFloorGrid}
              isAnchored={isAnchored}
              selectedComponent={null}
              onSelectComponent={() => {}}
              isHovering={false}
            />

            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              target={[anchorPosition[0], 0, anchorPosition[2]]}
              minDistance={0.35}
              maxDistance={6.0}
              maxPolarAngle={Math.PI / 2.02}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* 3. Top Status HUD: Active Floor Detection Banner */}
      <div className="absolute top-4 left-4 right-16 z-30 pointer-events-none flex items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 border border-white/20 backdrop-blur-xl shadow-xl text-xs font-mono">
          {trackingStatus === "scanning" && (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-amber-300 font-bold">Scanning for Floor Surface...</span>
            </>
          )}

          {trackingStatus === "detected" && (
            <>
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span className="text-sky-300 font-bold">
                Horizontal Ground Detected &bull; Tap Floor to Place
              </span>
            </>
          )}

          {trackingStatus === "anchored" && (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-emerald-300 font-bold">
                Anchored to Ground Plane ({surfaceMode === "floor" ? "Floor Level" : "Desk Level"})
              </span>
            </>
          )}
        </div>
      </div>

      {/* 4. Top Action Controls (Camera Flip & Close) */}
      <div className="absolute top-4 right-4 z-30 pointer-events-auto flex items-center gap-2">
        {availableCameras.length > 1 && (
          <button
            onClick={toggleCameraFacing}
            aria-label="Flip camera"
            className="p-2.5 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 text-white backdrop-blur-md transition-all shadow-lg cursor-pointer"
          >
            <FlipHorizontal size={16} />
          </button>
        )}

        <button
          onClick={onClose}
          aria-label="Exit AR"
          className="p-2.5 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 text-white backdrop-blur-md transition-all shadow-lg cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* 5. Floating Quick Surface Calibration Dock (Right Side) */}
      <div className="absolute right-4 top-20 z-30 pointer-events-auto flex flex-col gap-2">
        {/* Surface Mode Toggle (Floor vs Desk) */}
        <div className="flex flex-col rounded-2xl bg-black/80 border border-white/20 backdrop-blur-xl p-1 shadow-2xl space-y-1">
          <button
            onClick={() => setSurfaceMode("floor")}
            className={`px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
              surfaceMode === "floor"
                ? "bg-[#FF6A1A] text-white shadow-md shadow-[#FF6A1A]/30"
                : "text-neutral-400 hover:text-white"
            }`}
            title="Standing Room Floor (-1.4m)"
          >
            <span>🛋️ Floor</span>
          </button>
          <button
            onClick={() => setSurfaceMode("desk")}
            className={`px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
              surfaceMode === "desk"
                ? "bg-[#FF6A1A] text-white shadow-md shadow-[#FF6A1A]/30"
                : "text-neutral-400 hover:text-white"
            }`}
            title="Desk / Tabletop (-0.7m)"
          >
            <span>🪵 Desk</span>
          </button>
        </div>

        {/* Height Nudge Buttons (Fine-tune ground height ±5cm) */}
        <div className="flex flex-col items-center rounded-2xl bg-black/80 border border-white/20 backdrop-blur-xl p-1 shadow-2xl">
          <button
            onClick={() => setHeightNudgeCm((h) => Math.min(50, h + 5))}
            className="w-8 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-mono transition"
            title="Raise Ground +5cm"
          >
            <ChevronUp size={15} />
          </button>
          <div className="text-[9px] font-mono text-amber-400 font-bold px-1 py-0.5">
            {heightNudgeCm >= 0 ? `+${heightNudgeCm}` : heightNudgeCm}cm
          </div>
          <button
            onClick={() => setHeightNudgeCm((h) => Math.max(-50, h - 5))}
            className="w-8 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-mono transition"
            title="Lower Ground -5cm"
          >
            <ChevronDown size={15} />
          </button>
        </div>

        {/* Rotate Model Buttons */}
        <div className="flex flex-col rounded-2xl bg-black/80 border border-white/20 backdrop-blur-xl p-1 shadow-2xl space-y-1">
          <button
            onClick={() => setRotationAngle((r) => r + Math.PI / 4)}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white transition"
            title="Rotate 45° Clockwise"
          >
            <RotateCw size={14} />
          </button>
          <button
            onClick={() => setRotationAngle((r) => r - Math.PI / 4)}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white transition"
            title="Rotate 45° Counter-Clockwise"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Floor Grid Toggle */}
        <button
          onClick={() => setShowFloorGrid((g) => !g)}
          className={`w-10 h-10 rounded-2xl border backdrop-blur-xl flex items-center justify-center transition shadow-2xl cursor-pointer ${
            showFloorGrid
              ? "bg-sky-500/20 border-sky-400 text-sky-300"
              : "bg-black/80 border-white/20 text-neutral-400"
          }`}
          title="Toggle LiDAR Floor Grid"
        >
          <Layers size={15} />
        </button>

        {/* Reset Floor Anchor to Center */}
        <button
          onClick={() => {
            setAnchorPosition([0, 0, 0]);
            setHeightNudgeCm(0);
            setRotationAngle(0);
          }}
          className="w-10 h-10 rounded-2xl bg-black/80 border border-white/20 text-neutral-300 hover:text-white backdrop-blur-xl flex items-center justify-center transition shadow-2xl cursor-pointer"
          title="Reset Ground Center"
        >
          <Crosshair size={15} />
        </button>
      </div>

      {/* 6. Bottom Controls Bar: Tap-to-Anchor Prompt & Model Switcher */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex flex-col items-center gap-2.5 max-w-[96vw]">
        {/* Tap Floor Helper Notice */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-white/15 text-[11px] font-mono text-neutral-300 backdrop-blur-md shadow-lg">
          <Move size={12} className="text-[#FF6A1A]" />
          <span>Tap anywhere on the floor/desk to anchor the model</span>
        </div>

        {/* Model Selection Carousel Pill */}
        <div className="max-w-[94vw] overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-black/85 border border-white/20 backdrop-blur-2xl shadow-2xl">
            {AR_MACHINES.map((m) => {
              const isSelected = machineId === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onSelectMachine(m.id)}
                  className={`px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#FF6A1A] text-white font-bold shadow-md shadow-[#FF6A1A]/40 scale-105"
                      : "text-white/70 hover:text-white hover:bg-white/10 font-normal"
                  }`}
                >
                  {m.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

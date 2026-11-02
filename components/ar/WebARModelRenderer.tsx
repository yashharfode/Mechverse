"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { CustomizationSettings, MachineId, RobotSimulationState, FanSimulationState } from "@/types/machine";
import DroneBModel from "@/components/3d/DroneBModel";
import AeroDroneModel from "@/components/3d/AeroDroneModel";
import RoboRumbleVehicleModel from "@/components/3d/RoboRumbleVehicleModel";
import WalkingRobotModel from "@/components/3d/WalkingRobotModel";
import SportsCarModel from "@/components/3d/SportsCarModel";
import ElectricFanModel from "@/components/3d/ElectricFanModel";
import Esp32DroneModel from "@/components/3d/Esp32DroneModel";
import RoboRacerModel from "@/components/3d/RoboRacerModel";

interface WebARModelRendererProps {
  machineId: MachineId;
  customization: CustomizationSettings;
  explosionLevel: number;
  scale?: number;
  rotationY?: number;
  anchorPosition?: [number, number, number]; // Floor plane coordinates [X, 0, Z]
  torchEnabled?: boolean;
  showReticle?: boolean;
  showFloorGrid?: boolean;
  isAnchored?: boolean;
  selectedComponent?: string | null;
  onSelectComponent?: (id: string) => void;
  isHovering?: boolean;
}

const DEFAULT_WALKER_SIM: RobotSimulationState = {
  walking: true,
  speed: "normal",
  forwardMovement: false,
  showKinematicGhost: false,
};

const DEFAULT_FAN_SIM: FanSimulationState = {
  power: true,
  speed: 2,
  oscillating: true,
  tiltAngle: 0,
};

export default function WebARModelRenderer({
  machineId,
  customization,
  explosionLevel = 0,
  scale = 1.0,
  rotationY = 0,
  anchorPosition = [0, 0, 0],
  torchEnabled = false,
  showReticle = true,
  showFloorGrid = true,
  isAnchored = true,
  selectedComponent = null,
  onSelectComponent = () => {},
  isHovering = false,
}: WebARModelRendererProps) {
  const modelGroupRef = useRef<THREE.Group>(null);
  const reticleRingRef = useRef<THREE.Group>(null);
  const pulseRingRef = useRef<THREE.Mesh>(null);

  // Accurate real-world physical scale calibration (in meters)
  // Ensures machines do not float at camera height or appear distorted
  const getAccuratePhysicsScale = (): number => {
    switch (machineId) {
      case "esp32-drone":
        return 0.85; // ~0.15m true micro quadcopter span
      case "robo-racer":
        return 0.95; // ~0.24m true SolidWorks 4WD rover length
      case "robo-rumble":
        return 0.45; // ~0.30m combat robot
      case "walking-robot":
        return 0.52; // ~0.32m tabletop mechanism
      case "electric-fan":
        return 0.65; // ~0.45m standard desk fan
      case "aero-450":
        return 0.75; // ~0.48m 450 quadcopter
      case "drone-b":
        return 0.72; // ~0.75m industrial octocopter
      case "sports-car":
        return 0.28; // ~1.25m comfortable room floor scale
      default:
        return 0.8;
    }
  };

  // Vertical grounding offset so each machine's wheels, skids, or base touch the floor plane (Y = 0) exactly
  const getFloorGroundingOffset = (): number => {
    switch (machineId) {
      case "robo-racer":
        return 0.052; // Bottom of 65mm chevron wheels flush with Y = 0
      case "esp32-drone":
        return 0.015; // Frame & prop guards rest on floor
      case "robo-rumble":
        return 0.045; // Tires & wedge touch floor
      case "walking-robot":
        return 0.32;  // Feet touch floor
      case "electric-fan":
        return 0.0;   // Base cylinder rests on floor
      case "aero-450":
        return 0.12;  // Landing gear skids touch floor
      case "drone-b":
        return 0.12;  // Tubular skids touch floor
      case "sports-car":
        return 0.22;  // Tires touch floor
      default:
        return 0.02;
    }
  };

  const finalScale = scale * getAccuratePhysicsScale();
  const groundingY = getFloorGroundingOffset();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (modelGroupRef.current) {
      modelGroupRef.current.rotation.y = rotationY;

      // Only flying drones hover if hover mode is active; otherwise rest firmly on floor
      const hoverAltitude =
        isHovering && (machineId === "drone-b" || machineId === "aero-450" || machineId === "esp32-drone")
          ? 0.35 + Math.sin(t * 1.8) * 0.03
          : 0;

      modelGroupRef.current.position.y = groundingY + hoverAltitude;
    }

    // Dynamic floor reticle animation
    if (reticleRingRef.current) {
      reticleRingRef.current.rotation.z = t * 0.3;
    }
    if (pulseRingRef.current) {
      const pulse = 0.5 + Math.sin(t * 2.5) * 0.5;
      pulseRingRef.current.scale.set(1 + pulse * 0.18, 1 + pulse * 0.18, 1);
    }
  });

  return (
    <group position={anchorPosition}>
      {/* Lighting Architecture for Real-World Environmental Passthrough */}
      <ambientLight intensity={torchEnabled ? 0.9 : 0.65} />
      <directionalLight position={[4, 8, 4]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 5, -3]} intensity={0.5} />

      {/* AR Torch / Spotlight simulation */}
      {torchEnabled && (
        <spotLight
          position={[0, 3, 3]}
          angle={0.6}
          penumbra={0.5}
          intensity={2.8}
          color="#ffffff"
          castShadow
        />
      )}

      {/* High-Fidelity Surface Contact Shadow: Anchors the 3D model firmly to the real physical floor */}
      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={isAnchored ? 0.88 : 0.45}
        scale={6}
        blur={1.6}
        far={2.5}
        resolution={512}
        color="#000000"
      />

      {/* Holographic LiDAR Ground Detection Grid (Visual Proof of Detected Floor) */}
      {showFloorGrid && (
        <group position={[0, 0.0005, 0]}>
          {/* Circular Concentric Distance Rings on Detected Floor (0.5m, 1.0m, 1.5m, 2.0m) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.495, 0.505, 48]} />
            <meshBasicMaterial color="#06b6d4" transparent opacity={0.35} side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.995, 1.005, 64]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.25} side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.495, 1.505, 64]} />
            <meshBasicMaterial color="#f97316" transparent opacity={0.2} side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.995, 2.005, 64]} />
            <meshBasicMaterial color="#f97316" transparent opacity={0.12} side={THREE.DoubleSide} />
          </mesh>

          {/* Subdued Floor Coordinate Grid */}
          <gridHelper
            args={[4.0, 16, "#f97316", "#0284c7"]}
            position={[0, 0.0008, 0]}
          >
            <meshBasicMaterial transparent opacity={0.15} />
          </gridHelper>
        </group>
      )}

      {/* Surface Detection CAD Reticle on Horizontal Floor Plane (Y = 0) */}
      {showReticle && (
        <group position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <group ref={reticleRingRef}>
            {/* Outer dotted tracking circle */}
            <mesh>
              <ringGeometry args={[0.62, 0.65, 48]} />
              <meshBasicMaterial
                color={isAnchored ? "#FF6A1A" : "#06b6d4"}
                opacity={isAnchored ? 0.6 : 0.85}
                transparent
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Inner target circle */}
            <mesh>
              <ringGeometry args={[0.28, 0.30, 32]} />
              <meshBasicMaterial
                color="#ffffff"
                opacity={isAnchored ? 0.45 : 0.75}
                transparent
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>

          {/* Pulse radar ring */}
          <mesh ref={pulseRingRef}>
            <ringGeometry args={[0.42, 0.44, 32]} />
            <meshBasicMaterial
              color={isAnchored ? "#FF6A1A" : "#38bdf8"}
              opacity={isAnchored ? 0.25 : 0.5}
              transparent
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Crosshair surface alignment markers */}
          <mesh position={[0.7, 0, 0]}>
            <planeGeometry args={[0.1, 0.012]} />
            <meshBasicMaterial color={isAnchored ? "#FF6A1A" : "#06b6d4"} />
          </mesh>
          <mesh position={[-0.7, 0, 0]}>
            <planeGeometry args={[0.1, 0.012]} />
            <meshBasicMaterial color={isAnchored ? "#FF6A1A" : "#06b6d4"} />
          </mesh>
          <mesh position={[0, 0.7, 0]}>
            <planeGeometry args={[0.012, 0.1]} />
            <meshBasicMaterial color={isAnchored ? "#FF6A1A" : "#06b6d4"} />
          </mesh>
          <mesh position={[0, -0.7, 0]}>
            <planeGeometry args={[0.012, 0.1]} />
            <meshBasicMaterial color={isAnchored ? "#FF6A1A" : "#06b6d4"} />
          </mesh>
        </group>
      )}

      {/* Model Root Node Anchored Directly to the Ground */}
      <group ref={modelGroupRef} scale={finalScale}>
        {machineId === "drone-b" && (
          <DroneBModel
            customization={customization}
            explosionLevel={explosionLevel}
            selectedComponent={selectedComponent}
            isolatedComponent={null}
            hiddenComponents={[]}
            onSelect={onSelectComponent}
            isArmed={isHovering}
          />
        )}

        {machineId === "aero-450" && (
          <AeroDroneModel
            customization={customization}
            explosionLevel={explosionLevel}
            selectedComponent={selectedComponent}
            isolatedComponent={null}
            hiddenComponents={[]}
            onSelect={onSelectComponent}
            isArmed={isHovering}
            throttlePct={isHovering ? 45 : 0}
          />
        )}

        {machineId === "robo-rumble" && (
          <RoboRumbleVehicleModel
            customization={customization}
            explosionLevel={explosionLevel}
            selectedComponent={selectedComponent}
            isolatedComponent={null}
            hiddenComponents={[]}
            onSelect={onSelectComponent}
            wheelRotationSpeed={0.5}
            position={[0, 0, 0]}
            scale={1.0}
          />
        )}

        {machineId === "walking-robot" && (
          <WalkingRobotModel
            customization={customization}
            explosionLevel={explosionLevel}
            selectedComponent={selectedComponent}
            isolatedComponent={null}
            hiddenComponents={[]}
            simulation={DEFAULT_WALKER_SIM}
            onSelect={onSelectComponent}
          />
        )}

        {machineId === "sports-car" && (
          <SportsCarModel
            customization={customization}
            explosionLevel={explosionLevel}
            selectedComponent={selectedComponent}
            isolatedComponent={null}
            hiddenComponents={[]}
            onSelect={onSelectComponent}
          />
        )}

        {machineId === "electric-fan" && (
          <ElectricFanModel
            paintColor={customization.paintColor}
            bladeColor={customization.fanBladeColor || "#0ea5e9"}
            baseColor={customization.fanBaseColor || "#1e2126"}
            explosionLevel={explosionLevel}
            selectedComponent={selectedComponent}
            isolatedComponent={null}
            hiddenComponents={[]}
            simulation={DEFAULT_FAN_SIM}
            onSelect={onSelectComponent}
          />
        )}

        {machineId === "esp32-drone" && (
          <Esp32DroneModel
            customization={customization}
            explosionLevel={explosionLevel}
            selectedComponent={selectedComponent}
            isolatedComponent={null}
            hiddenComponents={[]}
            onSelect={onSelectComponent}
            isArmed={isHovering}
            throttlePct={isHovering ? 40 : 0}
          />
        )}

        {machineId === "robo-racer" && (
          <RoboRacerModel
            customization={customization}
            explosionLevel={explosionLevel}
            selectedComponent={selectedComponent}
            isolatedComponent={null}
            hiddenComponents={[]}
            onSelect={onSelectComponent}
            isDriving={true}
            driveSpeed={25}
            steeringAngle={0}
            cameraPanAngle={0}
            hoodOpen={false}
          />
        )}
      </group>
    </group>
  );
}

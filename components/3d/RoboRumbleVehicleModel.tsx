"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BattleCarId, CustomizationSettings } from "@/types/machine";

interface RoboRumbleVehicleModelProps {
  customization: CustomizationSettings;
  explosionLevel: number;
  selectedComponent: string | null;
  isolatedComponent: string | null;
  hiddenComponents: string[];
  onSelect: (componentId: string) => void;
  // Optional physics drive input for arena integration
  wheelRotationSpeed?: number;
  position?: [number, number, number];
  scale?: number;
}

export default function RoboRumbleVehicleModel({
  customization,
  explosionLevel,
  selectedComponent,
  isolatedComponent,
  hiddenComponents,
  onSelect,
  wheelRotationSpeed = 0,
  position = [0, 0, 0],
  scale = 1.35,
}: RoboRumbleVehicleModelProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const wheelsGroupRef = useRef<THREE.Group>(null);
  const frontWedgeRef = useRef<THREE.Group>(null);
  const rearBumperRef = useRef<THREE.Group>(null);
  const leftArmorRef = useRef<THREE.Group>(null);
  const rightArmorRef = useRef<THREE.Group>(null);
  const electronicsRef = useRef<THREE.Group>(null);
  const batteryRef = useRef<THREE.Group>(null);
  const motorsRef = useRef<THREE.Group>(null);

  const wheelAngleRef = useRef(0);

  // Active vehicle model identity
  const carId: BattleCarId = customization.battleCarId || "striker";

  // Dynamic high-fidelity materials based on configuration
  const materials = useMemo(() => {
    // Primary Body / Paint Colors
    let bodyColor = "#f97316"; // Striker Orange
    let bodyMetalness = 0.3;
    let bodyRoughness = 0.35;

    if (carId === "titan") {
      bodyColor = "#334155"; // Titan Steel Gray
      bodyMetalness = 0.65;
      bodyRoughness = 0.25;
    } else if (carId === "viper") {
      bodyColor = "#0284c7"; // Viper Cyan
      bodyMetalness = 0.45;
      bodyRoughness = 0.2;
    }

    if (customization.paintColor) {
      bodyColor = customization.paintColor;
    }

    // Chassis Material
    let chassisColor = "#1e293b";
    let chassisRoughness = 0.3;
    let chassisMetalness = 0.2;
    if (customization.battleChassisMaterial === "aluminum") {
      chassisColor = "#cbd5e1";
      chassisRoughness = 0.25;
      chassisMetalness = 0.9;
    } else if (customization.battleChassisMaterial === "plywood") {
      chassisColor = "#d97706";
      chassisRoughness = 0.75;
      chassisMetalness = 0.05;
    } else if (customization.battleChassisMaterial === "3dprint-petg") {
      chassisColor = "#dc2626";
      chassisRoughness = 0.4;
      chassisMetalness = 0.15;
    }

    return {
      body: new THREE.MeshStandardMaterial({
        color: bodyColor,
        metalness: bodyMetalness,
        roughness: bodyRoughness,
      }),
      chassis: new THREE.MeshStandardMaterial({
        color: chassisColor,
        roughness: chassisRoughness,
        metalness: chassisMetalness,
      }),
      armorSteel: new THREE.MeshStandardMaterial({
        color: "#94a3b8",
        roughness: 0.3,
        metalness: 0.85,
      }),
      hardenedWedge: new THREE.MeshStandardMaterial({
        color: "#e2e8f0",
        roughness: 0.2,
        metalness: 0.95,
      }),
      rubberTire: new THREE.MeshStandardMaterial({
        color: "#18181b",
        roughness: 0.88,
        metalness: 0.05,
      }),
      treadLug: new THREE.MeshStandardMaterial({
        color: "#09090b",
        roughness: 0.92,
        metalness: 0.02,
      }),
      rims: new THREE.MeshStandardMaterial({
        color: carId === "titan" ? "#0f172a" : "#f8fafc",
        roughness: 0.3,
        metalness: 0.85,
      }),
      beadlockRing: new THREE.MeshStandardMaterial({
        color: carId === "striker" ? "#ea580c" : carId === "viper" ? "#0284c7" : "#475569",
        roughness: 0.25,
        metalness: 0.8,
      }),
      yellowMotor: new THREE.MeshStandardMaterial({
        color: "#eab308",
        roughness: 0.35,
        metalness: 0.15,
      }),
      motorSteel: new THREE.MeshStandardMaterial({
        color: "#64748b",
        roughness: 0.25,
        metalness: 0.9,
      }),
      motorBracket: new THREE.MeshStandardMaterial({
        color: "#334155",
        roughness: 0.3,
        metalness: 0.8,
      }),
      pcbGreen: new THREE.MeshStandardMaterial({
        color: "#047857",
        roughness: 0.4,
        metalness: 0.2,
      }),
      heatsinkAluminum: new THREE.MeshStandardMaterial({
        color: "#cbd5e1",
        roughness: 0.2,
        metalness: 0.95,
      }),
      batteryBlue: new THREE.MeshStandardMaterial({
        color: "#0284c7",
        roughness: 0.3,
        metalness: 0.7,
      }),
      hardware: new THREE.MeshStandardMaterial({
        color: "#e2e8f0",
        roughness: 0.2,
        metalness: 0.95,
      }),
      rollCage: new THREE.MeshStandardMaterial({
        color: "#1e293b",
        roughness: 0.25,
        metalness: 0.85,
      }),
      weaponDrum: new THREE.MeshStandardMaterial({
        color: "#334155",
        roughness: 0.2,
        metalness: 0.9,
      }),
      impactTeeth: new THREE.MeshStandardMaterial({
        color: "#f59e0b",
        roughness: 0.15,
        metalness: 0.95,
      }),
      headlightLed: new THREE.MeshStandardMaterial({
        color: "#38bdf8",
        emissive: new THREE.Color("#38bdf8"),
        emissiveIntensity: 1.8,
        roughness: 0.1,
        metalness: 0.5,
      }),
      statusLed: new THREE.MeshStandardMaterial({
        color: "#10b981",
        emissive: new THREE.Color("#10b981"),
        emissiveIntensity: 1.5,
        roughness: 0.1,
        metalness: 0.5,
      }),
      highlight: new THREE.MeshStandardMaterial({
        color: "#38bdf8",
        emissive: new THREE.Color("#0284c7"),
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.6,
      }),
    };
  }, [customization, carId]);

  const isVisible = (id: string) => {
    if (hiddenComponents.includes(id)) return false;
    if (isolatedComponent && isolatedComponent !== id) return false;
    return true;
  };

  const getMat = (id: string, defaultMat: THREE.Material) => {
    return selectedComponent === id ? materials.highlight : defaultMat;
  };

  const handlePointer = (id: string, e: any) => {
    e.stopPropagation?.();
    onSelect(id);
  };

  // Frame tick: Exploded view lerp & wheel rotation
  useFrame((_, delta) => {
    // Wheel continuous rotation
    wheelAngleRef.current += wheelRotationSpeed * delta;

    const t = explosionLevel;
    const lerpRate = 1 - Math.exp(-delta * 6);

    if (frontWedgeRef.current) {
      frontWedgeRef.current.position.z = THREE.MathUtils.lerp(
        frontWedgeRef.current.position.z,
        0.85 + t * 1.3,
        lerpRate
      );
    }
    if (rearBumperRef.current) {
      rearBumperRef.current.position.z = THREE.MathUtils.lerp(
        rearBumperRef.current.position.z,
        -0.85 - t * 1.1,
        lerpRate
      );
    }
    if (leftArmorRef.current) {
      leftArmorRef.current.position.x = THREE.MathUtils.lerp(
        leftArmorRef.current.position.x,
        0.65 + t * 0.9,
        lerpRate
      );
    }
    if (rightArmorRef.current) {
      rightArmorRef.current.position.x = THREE.MathUtils.lerp(
        rightArmorRef.current.position.x,
        -0.65 - t * 0.9,
        lerpRate
      );
    }
    if (electronicsRef.current) {
      electronicsRef.current.position.y = THREE.MathUtils.lerp(
        electronicsRef.current.position.y,
        0.28 + t * 0.9,
        lerpRate
      );
    }
    if (batteryRef.current) {
      batteryRef.current.position.y = THREE.MathUtils.lerp(
        batteryRef.current.position.y,
        0.22 + t * 0.75,
        lerpRate
      );
      batteryRef.current.position.z = THREE.MathUtils.lerp(
        batteryRef.current.position.z,
        -0.25 - t * 0.5,
        lerpRate
      );
    }
    if (motorsRef.current) {
      motorsRef.current.position.y = THREE.MathUtils.lerp(
        motorsRef.current.position.y,
        0.18 + t * 0.35,
        lerpRate
      );
    }
  });

  // Dimensional parameters based on selected vehicle model
  const chassisScale =
    carId === "titan"
      ? { width: 1.5, length: 1.85, height: 0.16 }
      : carId === "viper"
      ? { width: 1.15, length: 1.55, height: 0.12 }
      : { width: 1.32, length: 1.7, height: 0.14 }; // Striker

  const wheelRadius = carId === "titan" ? 0.32 : carId === "viper" ? 0.23 : 0.26;
  const wheelThickness = carId === "titan" ? 0.22 : 0.15;
  const trackX = chassisScale.width / 2 + wheelThickness / 2 + 0.05;
  const wheelBaseZ = chassisScale.length * 0.34;

  return (
    <group ref={rootGroupRef} position={position} scale={scale}>
      {/* ================= 1. CHASSIS FRAME ================= */}
      {isVisible("chassis-frame") && (
        <group
          position={[0, 0.16, 0]}
          onClick={(e) => handlePointer("chassis-frame", e)}
        >
          {/* Main Flat Lower Structural Deck (7075-T6 Belly Pan) */}
          <mesh castShadow receiveShadow material={getMat("chassis-frame", materials.chassis)}>
            <boxGeometry args={[chassisScale.width, 0.04, chassisScale.length]} />
          </mesh>

          {/* Front Chamfered Skid Plate Lip */}
          <mesh
            position={[0, 0.015, chassisScale.length * 0.49]}
            rotation={[0.35, 0, 0]}
            material={materials.armorSteel}
          >
            <boxGeometry args={[chassisScale.width * 0.94, 0.03, 0.12]} />
          </mesh>

          {/* Lateral Stiffener Bulkhead Ribs */}
          {[-0.35, 0, 0.35].map((z) => (
            <mesh key={z} position={[0, 0.035, z]} material={materials.chassis}>
              <boxGeometry args={[chassisScale.width * 0.88, 0.035, 0.04]} />
            </mesh>
          ))}

          {/* Central Protected Electronics Tub / Wall */}
          <mesh position={[0, 0.12, 0]} material={materials.chassis}>
            <boxGeometry args={[chassisScale.width * 0.7, 0.14, chassisScale.length * 0.72]} />
          </mesh>

          {/* Upper Top Deck Cover (Colored Armor / Carbon Finish) */}
          <mesh
            position={[0, 0.2 + explosionLevel * 0.55, 0]}
            material={getMat("chassis-frame", materials.body)}
          >
            <boxGeometry args={[chassisScale.width * 0.72, 0.025, chassisScale.length * 0.74]} />
          </mesh>

          {/* Dual Tubular Steel Roll Cage Protection Bars (Over Electronics) */}
          {[-chassisScale.width * 0.28, chassisScale.width * 0.28].map((rx) => (
            <group key={rx} position={[rx, 0.22 + explosionLevel * 0.55, 0]}>
              {/* Longitudinal Tube */}
              <mesh position={[0, 0.11, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.rollCage}>
                <cylinderGeometry args={[0.018, 0.018, chassisScale.length * 0.68, 12]} />
              </mesh>
              {/* Front Down-Tube Stanchion */}
              <mesh position={[0, 0.05, chassisScale.length * 0.32]} rotation={[-0.3, 0, 0]} material={materials.rollCage}>
                <cylinderGeometry args={[0.016, 0.016, 0.13, 12]} />
              </mesh>
              {/* Rear Down-Tube Stanchion */}
              <mesh position={[0, 0.05, -chassisScale.length * 0.32]} rotation={[0.3, 0, 0]} material={materials.rollCage}>
                <cylinderGeometry args={[0.016, 0.016, 0.13, 12]} />
              </mesh>
            </group>
          ))}

          {/* Crossbar connecting both roll bars */}
          <mesh position={[0, 0.33 + explosionLevel * 0.55, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.rollCage}>
            <cylinderGeometry args={[0.016, 0.016, chassisScale.width * 0.56, 12]} />
          </mesh>

          {/* Forward-Facing Dual Tactical LED Headlights */}
          {[-chassisScale.width * 0.26, chassisScale.width * 0.26].map((hx) => (
            <mesh key={hx} position={[hx, 0.18, chassisScale.length * 0.38]} material={materials.headlightLed}>
              <boxGeometry args={[0.06, 0.04, 0.02]} />
            </mesh>
          ))}
        </group>
      )}

      {/* ================= 2. FRONT ATTACHMENT (WEDGE / RAM / WEAPONS) ================= */}
      {isVisible("front-attachment") && (
        <group
          ref={frontWedgeRef}
          position={[0, 0.16, 0.85]}
          onClick={(e) => handlePointer("front-attachment", e)}
        >
          {carId === "striker" && (
            /* STRIKER: Sloped Low-Profile Combat Wedge Blade with Ground Teeth & Kinetic Drum */
            <group position={[0, -0.04, 0.12]}>
              {/* Sloped Wedge Face (14° Incline) */}
              <mesh
                rotation={[-0.42, 0, 0]}
                castShadow
                material={getMat("front-attachment", materials.hardenedWedge)}
              >
                <boxGeometry args={[chassisScale.width * 0.98, 0.03, 0.42]} />
              </mesh>
              {/* Ground-Scraping Leading Edge Bar */}
              <mesh position={[0, -0.08, 0.18]} material={materials.hardenedWedge}>
                <boxGeometry args={[chassisScale.width * 1.02, 0.02, 0.06]} />
              </mesh>
              {/* Ground-Scraping Serrated Wedge Teeth (4x Titanium Tines) */}
              {[-0.45, -0.15, 0.15, 0.45].map((tx) => (
                <mesh key={tx} position={[tx, -0.085, 0.23]} rotation={[-0.2, 0, 0]} material={materials.impactTeeth}>
                  <boxGeometry args={[0.05, 0.015, 0.09]} />
                </mesh>
              ))}
              {/* Gusset Support Brackets with Lightening Holes */}
              {[-0.4, 0.4].map((x) => (
                <mesh key={x} position={[x, -0.02, 0]} material={materials.armorSteel}>
                  <boxGeometry args={[0.03, 0.12, 0.28]} />
                </mesh>
              ))}
              {/* Center Kinetic Spinning Weapon Drum (High-Torque Flywheel) */}
              <group position={[0, 0.08, 0.02]}>
                <mesh rotation={[0, 0, Math.PI / 2]} material={materials.weaponDrum}>
                  <cylinderGeometry args={[0.085, 0.085, chassisScale.width * 0.38, 20]} />
                </mesh>
                {/* Dual Hardened Impact Teeth on Drum */}
                {[-0.1, 0.1].map((dx) => (
                  <mesh key={dx} position={[dx, 0.075, 0]} material={materials.impactTeeth}>
                    <boxGeometry args={[0.04, 0.06, 0.05]} />
                  </mesh>
                ))}
                {/* Drum Side Aluminum Support Towers */}
                {[-chassisScale.width * 0.21, chassisScale.width * 0.21].map((sx) => (
                  <mesh key={sx} position={[sx, -0.04, 0]} material={materials.armorSteel}>
                    <boxGeometry args={[0.025, 0.16, 0.14]} />
                  </mesh>
                ))}
              </group>
            </group>
          )}

          {carId === "titan" && (
            /* TITAN: Dual-Tier Armored Steel Ram Bumper with Anti-Spinner Horns */
            <group position={[0, 0.04, 0.15]}>
              {/* Upper Heavy Impact Beam */}
              <mesh castShadow material={getMat("front-attachment", materials.armorSteel)}>
                <boxGeometry args={[chassisScale.width * 1.1, 0.12, 0.14]} />
              </mesh>
              {/* Lower Push Lip */}
              <mesh position={[0, -0.1, 0.06]} material={materials.hardenedWedge}>
                <boxGeometry args={[chassisScale.width * 1.05, 0.08, 0.12]} />
              </mesh>
              {/* Dual Vertical Anti-Spinner Heavy Horns */}
              {[-0.38, 0.38].map((hx) => (
                <mesh key={hx} position={[hx, 0.14, 0.04]} rotation={[0.2, 0, 0]} material={materials.hardenedWedge}>
                  <boxGeometry args={[0.06, 0.18, 0.06]} />
                </mesh>
              ))}
              {/* Neoprene Shock Buffer Blocks */}
              {[-0.45, 0, 0.45].map((x) => (
                <mesh key={x} position={[x, 0, 0.1]} material={materials.rubberTire}>
                  <boxGeometry args={[0.08, 0.14, 0.06]} />
                </mesh>
              ))}
            </group>
          )}

          {carId === "viper" && (
            /* VIPER: Aerodynamic Tapered Nose & Low Deflector */
            <group position={[0, -0.02, 0.14]}>
              <mesh
                rotation={[-0.25, 0, 0]}
                castShadow
                material={getMat("front-attachment", materials.body)}
              >
                <boxGeometry args={[chassisScale.width * 0.75, 0.04, 0.34]} />
              </mesh>
              <mesh position={[0, -0.06, 0.15]} material={materials.hardenedWedge}>
                <boxGeometry args={[chassisScale.width * 0.82, 0.025, 0.08]} />
              </mesh>
              {/* Dual Front Titanium Scrape Forks */}
              {[-0.24, 0.24].map((fx) => (
                <mesh key={fx} position={[fx, -0.07, 0.22]} rotation={[-0.15, 0, 0]} material={materials.impactTeeth}>
                  <boxGeometry args={[0.035, 0.015, 0.12]} />
                </mesh>
              ))}
            </group>
          )}
        </group>
      )}

      {/* ================= 3. REAR BUMPER ================= */}
      {isVisible("rear-bumper") && (
        <group
          ref={rearBumperRef}
          position={[0, 0.18, -0.85]}
          onClick={(e) => handlePointer("rear-bumper", e)}
        >
          {/* Main Transverse Crash Beam */}
          <mesh castShadow material={getMat("rear-bumper", materials.armorSteel)}>
            <boxGeometry args={[chassisScale.width * 0.95, 0.08, 0.08]} />
          </mesh>

          {/* Anti-Wheelie Ground Rollers / Skids */}
          {[-0.35, 0.35].map((x) => (
            <group key={x} position={[x, -0.08, -0.06]}>
              <mesh rotation={[0, 0, Math.PI / 2]} material={materials.hardware}>
                <cylinderGeometry args={[0.04, 0.04, 0.05, 12]} />
              </mesh>
            </group>
          ))}

          {/* VIPER Aerodynamic Rear Wing */}
          {carId === "viper" && (
            <group position={[0, 0.22, 0.05]}>
              <mesh material={materials.body}>
                <boxGeometry args={[chassisScale.width * 1.15, 0.02, 0.22]} />
              </mesh>
              {[-0.45, 0.45].map((x) => (
                <mesh key={x} position={[x, -0.1, 0]} material={materials.body}>
                  <boxGeometry args={[0.03, 0.22, 0.18]} />
                </mesh>
              ))}
            </group>
          )}
        </group>
      )}

      {/* ================= 4. SIDE ARMOR SKIRTS ================= */}
      {isVisible("side-armor") && (
        <>
          {/* Left Side Armor */}
          <group
            ref={leftArmorRef}
            position={[chassisScale.width / 2 + 0.02, 0.18, 0]}
            onClick={(e) => handlePointer("side-armor", e)}
          >
            <mesh
              rotation={[0, 0, carId === "titan" ? 0 : 0.35]}
              material={getMat("side-armor", materials.body)}
            >
              <boxGeometry args={[0.025, 0.18, chassisScale.length * 0.82]} />
            </mesh>
            {/* Protective Wheel Arch Covers */}
            {[-wheelBaseZ, wheelBaseZ].map((z) => (
              <mesh key={z} position={[0.05, 0.06, z]} material={materials.armorSteel}>
                <boxGeometry args={[0.08, 0.04, 0.38]} />
              </mesh>
            ))}
          </group>

          {/* Right Side Armor */}
          <group
            ref={rightArmorRef}
            position={[-chassisScale.width / 2 - 0.02, 0.18, 0]}
            onClick={(e) => handlePointer("side-armor", e)}
          >
            <mesh
              rotation={[0, 0, carId === "titan" ? 0 : -0.35]}
              material={getMat("side-armor", materials.body)}
            >
              <boxGeometry args={[0.025, 0.18, chassisScale.length * 0.82]} />
            </mesh>
            {[-wheelBaseZ, wheelBaseZ].map((z) => (
              <mesh key={z} position={[-0.05, 0.06, z]} material={materials.armorSteel}>
                <boxGeometry args={[0.08, 0.04, 0.38]} />
              </mesh>
            ))}
          </group>
        </>
      )}

      {/* ================= 5. GEARED DC MOTORS (4x) ================= */}
      {isVisible("dc-motors") && (
        <group
          ref={motorsRef}
          position={[0, 0.18, 0]}
          onClick={(e) => handlePointer("dc-motors", e)}
        >
          {[-wheelBaseZ, wheelBaseZ].map((z) =>
            [-1, 1].map((dir) => (
              <group key={`${z}-${dir}`} position={[dir * (chassisScale.width * 0.35), 0, z]}>
                {/* CNC Clamping Aluminum Motor Mount Bracket */}
                <mesh position={[0, -0.01, 0]} material={materials.motorBracket}>
                  <boxGeometry args={[0.28, 0.04, 0.20]} />
                </mesh>
                {/* Yellow Gearbox Box */}
                <mesh
                  castShadow
                  material={getMat("dc-motors", materials.yellowMotor)}
                >
                  <boxGeometry args={[0.26, 0.14, 0.18]} />
                </mesh>
                {/* Steel Motor Can */}
                <mesh
                  position={[-dir * 0.12, 0, 0]}
                  rotation={[0, 0, Math.PI / 2]}
                  material={materials.motorSteel}
                >
                  <cylinderGeometry args={[0.055, 0.055, 0.16, 16]} />
                </mesh>
                {/* Heavy Duty Motor Shaft Coupler & Hex Hub */}
                <mesh
                  position={[dir * 0.16, 0, 0]}
                  rotation={[0, 0, Math.PI / 2]}
                  material={materials.hardware}
                >
                  <cylinderGeometry args={[0.028, 0.028, 0.1, 12]} />
                </mesh>
              </group>
            ))
          )}
        </group>
      )}

      {/* ================= 6. WHEELS & TIRES ASSEMBLY (4x) ================= */}
      {isVisible("wheels-assembly") && (
        <group
          ref={wheelsGroupRef}
          position={[0, wheelRadius, 0]}
          onClick={(e) => handlePointer("wheels-assembly", e)}
        >
          {[-wheelBaseZ, wheelBaseZ].map((z) =>
            [-trackX, trackX].map((x) => {
              const isRight = x > 0;
              return (
                <group
                  key={`${z}-${x}`}
                  position={[x + Math.sign(x) * explosionLevel * 0.65, 0, z]}
                  rotation={[wheelAngleRef.current, 0, 0]}
                >
                  {/* Outer Rubber Combat Tire */}
                  <mesh
                    rotation={[0, 0, Math.PI / 2]}
                    castShadow
                    material={getMat("wheels-assembly", materials.rubberTire)}
                  >
                    <cylinderGeometry
                      args={[wheelRadius, wheelRadius, wheelThickness, 32]}
                    />
                  </mesh>

                  {/* High-Traction Radial Chevron Tread Lugs (14 lugs around circumference) */}
                  {Array.from({ length: 14 }).map((_, i) => {
                    const angle = (i / 14) * Math.PI * 2;
                    return (
                      <mesh
                        key={i}
                        position={[
                          0,
                          Math.sin(angle) * (wheelRadius + 0.008),
                          Math.cos(angle) * (wheelRadius + 0.008),
                        ]}
                        rotation={[angle, 0, 0]}
                        material={materials.treadLug}
                      >
                        <boxGeometry args={[wheelThickness * 0.94, 0.016, 0.035]} />
                      </mesh>
                    );
                  })}

                  {/* CNC Deep-Dish Billet Aluminum Rim */}
                  <mesh
                    rotation={[0, 0, Math.PI / 2]}
                    material={materials.rims}
                  >
                    <cylinderGeometry
                      args={[wheelRadius * 0.72, wheelRadius * 0.72, wheelThickness + 0.006, 24]}
                    />
                  </mesh>

                  {/* Outer Anodized Beadlock Ring */}
                  <mesh
                    position={[isRight ? wheelThickness / 2 + 0.006 : -wheelThickness / 2 - 0.006, 0, 0]}
                    rotation={[0, 0, Math.PI / 2]}
                    material={materials.beadlockRing}
                  >
                    <cylinderGeometry
                      args={[wheelRadius * 0.74, wheelRadius * 0.74, 0.008, 24]}
                    />
                  </mesh>

                  {/* Perimeter Beadlock Stud Bolts (8x studs) */}
                  {Array.from({ length: 8 }).map((_, bi) => {
                    const bAngle = (bi / 8) * Math.PI * 2;
                    const r = wheelRadius * 0.63;
                    return (
                      <mesh
                        key={bi}
                        position={[
                          isRight ? wheelThickness / 2 + 0.012 : -wheelThickness / 2 - 0.012,
                          Math.sin(bAngle) * r,
                          Math.cos(bAngle) * r,
                        ]}
                        rotation={[0, 0, Math.PI / 2]}
                        material={materials.hardware}
                      >
                        <cylinderGeometry args={[0.012, 0.012, 0.008, 8]} />
                      </mesh>
                    );
                  })}

                  {/* Anodized Hex Wheel Nut with Steel Spindle Pin */}
                  <mesh
                    position={[isRight ? wheelThickness / 2 + 0.022 : -wheelThickness / 2 - 0.022, 0, 0]}
                    rotation={[0, 0, Math.PI / 2]}
                    material={materials.hardware}
                  >
                    <cylinderGeometry args={[0.045, 0.045, 0.03, 6]} />
                  </mesh>
                </group>
              );
            })
          )}
        </group>
      )}

      {/* ================= 7. BATTERY POWER PACK ================= */}
      {isVisible("battery-pack") && (
        <group
          ref={batteryRef}
          position={[0, 0.22, -0.25]}
          onClick={(e) => handlePointer("battery-pack", e)}
        >
          {/* Dual 18650 Cells or 3S LiPo Block */}
          <mesh castShadow material={getMat("battery-pack", materials.batteryBlue)}>
            <boxGeometry args={[0.42, 0.16, 0.48]} />
          </mesh>
          {/* Silicon Wiring Leads */}
          <mesh position={[0.12, 0.08, 0.24]} rotation={[0.4, 0, 0]} material={materials.hardware}>
            <cylinderGeometry args={[0.012, 0.012, 0.18, 8]} />
          </mesh>
          {/* Battery Mounting Straps */}
          {[-0.14, 0.14].map((z) => (
            <mesh key={z} position={[0, 0.09, z]} material={materials.chassis}>
              <boxGeometry args={[0.44, 0.02, 0.04]} />
            </mesh>
          ))}
        </group>
      )}

      {/* ================= 8. MOTOR DRIVER (L298N / DRV8833) ================= */}
      {isVisible("motor-driver") && (
        <group
          ref={electronicsRef}
          position={[0, 0.26, 0.25]}
          onClick={(e) => handlePointer("motor-driver", e)}
        >
          {/* Red/Green PCB Board */}
          <mesh material={getMat("motor-driver", materials.pcbGreen)}>
            <boxGeometry args={[0.34, 0.025, 0.34]} />
          </mesh>
          {/* Extruded Aluminum Cooling Heatsink */}
          <mesh position={[0, 0.06, 0]} material={materials.heatsinkAluminum}>
            <boxGeometry args={[0.22, 0.09, 0.18]} />
          </mesh>
          {/* Screw Terminal Blocks */}
          {[-0.14, 0.14].map((x) => (
            <mesh key={x} position={[x, 0.04, -0.14]} material={materials.pcbGreen}>
              <boxGeometry args={[0.08, 0.06, 0.06]} />
            </mesh>
          ))}
        </group>
      )}

      {/* ================= 9. WIRELESS MICROCONTROLLER (ESP32) ================= */}
      {isVisible("microcontroller") && (
        <group
          position={[0, 0.32 + explosionLevel * 0.85, 0]}
          onClick={(e) => handlePointer("microcontroller", e)}
        >
          {/* ESP32 Module Board */}
          <mesh material={getMat("microcontroller", materials.pcbGreen)}>
            <boxGeometry args={[0.24, 0.015, 0.44]} />
          </mesh>
          {/* Metal RF Shield Can */}
          <mesh position={[0, 0.02, 0.06]} material={materials.hardware}>
            <boxGeometry args={[0.16, 0.02, 0.18]} />
          </mesh>
          {/* 2.4GHz Onboard Antenna Gold Trace */}
          <mesh position={[0, 0.015, -0.16]} material={materials.hardware}>
            <boxGeometry args={[0.18, 0.01, 0.06]} />
          </mesh>
        </group>
      )}

      {/* ================= 10. POWER SWITCH & WIRING ================= */}
      {isVisible("power-switch") && (
        <group
          position={[chassisScale.width * 0.32, 0.28 + explosionLevel * 0.65, -0.32]}
          onClick={(e) => handlePointer("power-switch", e)}
        >
          <mesh material={getMat("power-switch", materials.chassis)}>
            <boxGeometry args={[0.08, 0.06, 0.08]} />
          </mesh>
          <mesh position={[0, 0.04, 0]} rotation={[0.3, 0, 0]} material={materials.hardware}>
            <cylinderGeometry args={[0.012, 0.012, 0.06, 12]} />
          </mesh>
        </group>
      )}

      {/* ================= 11. HARDWARE FASTENERS ================= */}
      {isVisible("hardware-fasteners") && (
        <group onClick={(e) => handlePointer("hardware-fasteners", e)}>
          {[-0.45, 0.45].map((x) =>
            [-0.55, 0.55].map((z) => (
              <mesh
                key={`${x}-${z}`}
                position={[x, 0.26 + explosionLevel * 0.75, z]}
                material={getMat("hardware-fasteners", materials.hardware)}
              >
                <cylinderGeometry args={[0.015, 0.015, 0.05, 10]} />
              </mesh>
            ))
          )}
        </group>
      )}
    </group>
  );
}

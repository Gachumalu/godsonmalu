"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
// import {ContectShadows,Float,Enviroment}from '@react-three/drei'
import { ContactShadows, Float, Environment } from "@react-three/drei/";
import { Suspense, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Shapes() {
  return (
    <div>
      <h1 className="heading">
        Three.js,{" "}
        <span className="text-purple">
          created by Mrdoob and contributors..
        </span>
      </h1>
      <Canvas
        className="z-0 gachu "
        shadows
        gl={{ antialias: false }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 25], fav: 30, near: 1, far: 40 }}
      >
        <Suspense fallback={null}>
          <Geometries />
          <ContactShadows
            position={[0, -3.5, 0]}
            opacity={0.65}
            scale={40}
            blur={1}
            far={9}
          />

          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}
function Geometries() {
  const geometries = [
    {
      position: [0, 0, 9],
      r: 0.4,
      geometry: new THREE.IcosahedronGeometry(3), //gem
    },
    {
      position: [2.4, -1.3, 9],
      r: 0.4,
      geometry: new THREE.CapsuleGeometry(0.5, 1.6, 2, 16), //Capsule
    },
    {
      position: [-2.8, 1, 8],
      r: 0.6,
      geometry: new THREE.DodecahedronGeometry(1.5), //Football
    },
    {
      position: [-1.2, -1.2, 10],
      r: 0.5,
      geometry: new THREE.TorusGeometry(0.6, 0.25, 16, 32), //Donut
    },
    {
      position: [2.4, 1.5, 9],
      r: 0.7,
      geometry: new THREE.OctahedronGeometry(1.5), //Diamond
    },
  ];
  const materials = [
    new THREE.MeshNormalMaterial(),
    new THREE.MeshStandardMaterial({ color: 0x27ae60, roughness: 0 }),
    new THREE.MeshStandardMaterial({ color: 0xf1c40f, roughness: 0.4 }),
    new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: 0x8e44ad, roughness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: 0x1abc9c, roughness: 0.1 }),
    new THREE.MeshStandardMaterial({
      roughness: 4,
      metalness: 1,
      color: 0x2980b9,
    }),
    new THREE.MeshStandardMaterial({
      color: 0x2c3e50,
      roughness: 3,
      metalness: 2,
    }),
  ];

  //pass to Geometry
  return geometries.map(({ position, r, geometry }) => (
    <Geometry
      key={JSON.stringify(position)}
      position={position.map((p) => p * 2)}
      geometry={geometry}
      materials={materials}
      r={r}
    />
  ));
}

function Geometry({ r, position, geometry, materials }) {
  const meshRef = useRef();
  const [visible, setVisible] = useState(false);

  const startingMaterial = getRandomMaterial();
  function getRandomMaterial() {
    return gsap.utils.random(materials);
  }

  function handleClick(e) {
    const mesh = e.object;
    gsap.to(mesh.rotation, {
      x: `+=${gsap.utils.random(0, 2)}`,
      y: `+=${gsap.utils.random(0, 2)}`,
      z: `+=${gsap.utils.random(0, 2)}`,
      duration: 1.3,
      ease: "elastic.out(1,0.3)",
      yoyo: true,
    });
    mesh.material = getRandomMaterial();
  }
  const handlePointerOver = () => {
    document.body.style.cursor = "pointer";
  };
  const handlePointerOut = () => {
    document.body.style.cursor = "default";
  };
  useEffect(() => {
    let ctx = gsap.context(() => {
      setVisible(true);
      gsap.from(meshRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1,
        ease: "elastic.out(1,0.3)",
        delay: 0.3,
      });
    });
    return () => ctx.revert(); //clenup
  }, []);

  return (
    <group position={position} ref={meshRef}>
      <Float speed={5 * r} rotationIntensity={6 * r} floatIntensity={5 * r}>
        <mesh
          geometry={geometry}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          visible={visible}
          material={startingMaterial}
        />
      </Float>
    </group>
  );
}

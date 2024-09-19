"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Water } from "three/examples/jsm/objects/Water.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import * as THREE from "three";
import { gsap } from "gsap";
import { TextureLoader } from "three/src/loaders/TextureLoader";

// Water component using Three.js
const WaterComponent = () => {
  const waterRef = useRef();
  const { scene } = useThree();

  useEffect(() => {
    const params = {
      color: "#00ffff",
      scale: 4,
      flowX: 1,
      flowY: 1,
    };

    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
    const water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        "/waternormals.jpg",
        function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
      ),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: scene.fog !== undefined,
    });

    water.rotation.x = -Math.PI / 2;
    water.position.y = -5;

    scene.add(water);
    waterRef.current = water;
  }, [scene]);

  useFrame((state, delta) => {
    waterRef.current.material.uniforms["time"].value += delta / 2.0;
  });

  return null;
};

// Sky component
const SkyComponent = () => {
  const skyRef = useRef();
  const { scene } = useThree();

  useEffect(() => {
    const sky = new Sky();
    sky.scale.setScalar(10000);
    scene.add(sky);

    const uniforms = sky.material.uniforms;
    uniforms["turbidity"].value = 10;
    uniforms["rayleigh"].value = 2;
    uniforms["mieCoefficient"].value = 0.005;
    uniforms["mieDirectionalG"].value = 0.8;

    skyRef.current = sky;
  }, [scene]);

  return null;
};

// Floating object component
const FloatingObject = ({ position }) => {
  const mesh = useRef();
  const [hovered, setHovered] = useState(false);

  const texture = useLoader(TextureLoader, "/wood-texture.jpg");

  useFrame((state, delta) => {
    mesh.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    mesh.current.rotation.x += delta * 0.2;
    mesh.current.rotation.y += delta * 0.1;
  });

  return (
    <mesh
      ref={mesh}
      position={position}
      scale={hovered ? [1.1, 1.1, 1.1] : [1, 1, 1]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

// Main component
export default function SeaWaveAnimation() {
  const controls = useAnimation();
  const y = useMotionValue(0);
  const opacity = useTransform(y, [-100, 0, 100], [0, 1, 0]);

  useEffect(() => {
    const sequence = async () => {
      await controls.start({
        y: [-20, 0, -20],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
      });
    };
    sequence();

    gsap.to(".title", { duration: 2, opacity: 1, y: 0, ease: "power3.out" });
  }, [controls]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-blue-400 to-blue-600">
      <Canvas className="absolute inset-0">
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <WaterComponent />
        <SkyComponent />
        <FloatingObject position={[0, 0, 0]} />
        <FloatingObject position={[2, 1, -2]} />
        <FloatingObject position={[-2, 0.5, -1]} />
      </Canvas>

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <motion.h1
          className="title text-6xl font-bold text-white opacity-0 transform translate-y-10"
          style={{ opacity, y }}
        >
          Sea Wave Animation
        </motion.h1>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={controls}
      >
        <motion.button
          className="px-6 py-3 bg-white text-blue-600 rounded-full font-semibold shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Explore
        </motion.button>
      </motion.div>
    </div>
  );
}

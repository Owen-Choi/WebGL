import React, { Suspense, useEffect, useState} from "react";
import {Canvas, useFrame} from "react-three-fiber";
import { DoubleSide, RepeatWrapping, sRGBEncoding } from "three";
import {
  Loader,
  OrbitControls,
  useTexture,
} from "@react-three/drei";
import { PerspectiveCamera, PositionalAudio} from '@react-three/drei'
import { vertexShader, fragmentShader } from "./shaders";

import "./style.css";

const [xAxis, setXAxis] = useState(0.5);
const [yAxis, setYAxis] = useState(0.5);
const [zAxis, setZAxis] = useState(0.5);

export default function App() {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Canvas>
        <Suspense fallback={null}>
          <group>
            <Terrain />
          </group>
          <ambientLight />
        </Suspense>
        <PerspectiveCamera
          position={[xAxis, yAxis, zAxis]}
          near={0.01}
          far={1000}
          makeDefault
        />
        <OrbitControls
            screenSpacePanning={false}
        />
      </Canvas>
      <Loader />
    </div>
  );
}

function Terrain() {
  // Load the heightmap image
  const heightMap = useTexture("/uluru-heightmap.png");
  // Apply some properties to ensure it renders correctly
  heightMap.encoding = sRGBEncoding;
  heightMap.wrapS = RepeatWrapping;
  heightMap.wrapT = RepeatWrapping;
  heightMap.anisotropy = 16;

  // Load the texture map
  const textureMap = useTexture("/texturemap1024.png");
  // Apply some properties to ensure it renders correctly
  textureMap.encoding = sRGBEncoding;
  textureMap.wrapS = RepeatWrapping;
  textureMap.wrapT = RepeatWrapping;
  textureMap.anisotropy = 16;

  return (
    <mesh
      position={[-0.1, 0.3, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[1 / 1024, 1 / 1024, 1 / 1024]}
    >
      <planeBufferGeometry args={[1024, 1024, 256, 256]} />
      <shaderMaterial
        uniforms={{
          // Feed the heightmap
          bumpTexture: { value: heightMap },
          // Feed the scaling constant for the heightmap
          bumpScale: { value: 50 },
          // Feed the texture map
          terrainTexture: { value: textureMap }
        }}
        // Feed the shaders as strings
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={DoubleSide}
      />
    </mesh>
  );
}

import React, { Suspense, useRef} from "react";
import {Canvas, useFrame} from "react-three-fiber";
import { DoubleSide, RepeatWrapping, sRGBEncoding } from "three";
import {
  Loader,
  OrbitControls,
  PerspectiveCamera,
  useTexture,
} from "@react-three/drei";
import { vertexShader, fragmentShader } from "./shaders";
import "./style.css";

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
            position={[0.5, 0.5, 0.5]}
            near={0.01}
            far={1000}
            makeDefault
        />
        <OrbitControls
            screenSpacePanning={true}
            enableKeys={true}
            makeDefault enabled={false}
            // keys={[
            //   LEFT : 89, //left arrow
            //   UP: 'ArrowUp', // up arrow
            //   RIGHT: 'ArrowRight', // right arrow
            //   BOTTOM: 'ArrowDown'
            // ]}
        />
      </Canvas>
      <Loader />
    </div>
  );
}

const Terrain = () => {

  const pos = useRef();
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

  // useFrame(() => {
  //   pos.current.position.x += 0.000001;
  //   pos.current.position.y += 0.000001;
  //   pos.current.position.z += 0.000001;
  //   console.log(pos.current.position.z);
  // })

  return (
    <mesh
      position={[0, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[1 / 1024, 1 / 1024, 1 / 1024]}
    >
      {/*<PerspectiveCamera ref={pos}*/}
      {/*                   position={[0.5, 0.5, 0.5]}*/}
      {/*                   near={0.01}*/}
      {/*                   far={1000}*/}
      {/*                   makeDefault />*/}
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

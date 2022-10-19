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
import * as MathUtils from "three/src/math/MathUtils"
import "./style.css";

const keys = {
  ArrowUp: 'forward',
  ArrowDown: 'backward',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  KeyA: 'left',
  KeyD: 'right',
  KeyW: 'up',
  KeyS: 'down'
}
const moveFieldByKey = (key) => keys[key]

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
        {/*<PerspectiveCamera*/}
        {/*    position={[0.5, 0.5, 0.5]}*/}
        {/*    near={0.01}*/}
        {/*    far={1000}*/}
        {/*    makeDefault*/}
        {/*/>*/}
        <Cam />
        <OrbitControls
            screenSpacePanning={true}
            enableKeys={true}
            makeDefault enabled={false}
        />
      </Canvas>
      <Loader />
    </div>
  );
}

const Cam = () => {
  const camRef = useRef()
  // const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false, up: false, down: false })

  useFrame((state, delta) => {
    camRef.current.position.y = MathUtils.MathUtils.lerp(camRef.current.position.y, state.mouse.y * 0.5 + 0.5, Math.min(delta, 0.1))
    camRef.current.position.x = MathUtils.MathUtils.lerp(camRef.current.position.x, state.mouse.x, Math.min(delta, 0.1))
    camRef.current.lookAt(0, 0, 0)
  })
  //
  // useEffect(() => {
  //   const handleKeyDown = (e) => setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: true }))
  //   const handleKeyUp = (e) => setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: false }))
  //   document.addEventListener('keydown', handleKeyDown)
  //   document.addEventListener('keyup', handleKeyUp)
  //   document.addEventListener('pointermove', handleMouseMove)
  //
  //   return () => {
  //     document.removeEventListener('keydown', handleKeyDown)
  //     document.removeEventListener('keyup', handleKeyUp)
  //     document.removeEventListener('pointermove', handleMouseMove)
  //   }
  // }, [])

  return <PerspectiveCamera ref={camRef} makeDefault position={[0.5, 0.5, 0.5]} fov={75} />
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

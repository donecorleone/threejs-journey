import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Float, Lightformer, Text, Html, ContactShadows, Environment, MeshTransmissionMaterial } from "@react-three/drei"

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <>
      <Canvas>
        <mesh>
            <boxGeometry />
            <meshBasicMaterial color="red" />
        </mesh>
      </Canvas>
    </>
)
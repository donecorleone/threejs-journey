import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particlesTexture = textureLoader.load('/textures/particles/flame_01.png')


// Particles

const fireColors = [
    new THREE.Color("#8B0000"),  // Tiefes Rot
    new THREE.Color("#B22222"),  // Feueriges Rot
    new THREE.Color("#FF4500"),  // Hellrotes Feuer
    new THREE.Color("#FF8C00"),  // Dunkles Orange
    new THREE.Color("#FFA500"),  // Kräftiges Orange
    new THREE.Color("#FF7F50"),  // Leuchtendes Orange
    new THREE.Color("#FFD700"),  // Goldgelb
    new THREE.Color("#FFFF00"),  // Hellgelb
    new THREE.Color("#FFFFE0")   // Blasses Gelb
  ];
  
const particlesGeometry = new THREE.BufferGeometry()
const count = 200

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for(let i = 0; i < count * 3; i++)
{
    //positions
    positions[i] = (Math.random() - 0.5) * 10

    //colors
    const color = fireColors[Math.floor(Math.random() * fireColors.length)]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
}



particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)

particlesGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
)

// Material
const particlesMaterial = new THREE.PointsMaterial()
particlesMaterial.size = 0.04
particlesMaterial.sizeAttenuation = true
particlesMaterial.transparent = true
particlesMaterial.alphaMap = particlesTexture
// particlesMaterial.alphaTest = 0.001
particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.AdditiveBlending
particlesMaterial.vertexColors = true

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles, 3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update particles
     particles.rotation.x = - elapsedTime * 0.1
     particles.rotation.y = elapsedTime * 0.08
    
    particlesGeometry.attributes.position.needsUpdate = true
   

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
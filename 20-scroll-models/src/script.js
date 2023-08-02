import * as THREE from 'three'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'

const gltfLoader = new GLTFLoader()

THREE.ColorManagement.enabled = false

const cursor = {
    x: 0,
    y: 0,
    speed: 0 // Added speed property
}

window.addEventListener('mousemove', (event) => 
{
    const previousX = cursor.x // Store previous cursor.x before updating it

    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -(event.clientY / sizes.height - 0.5)

    // Calculate the speed of mouse movement
    cursor.speed = cursor.x - previousX

    // animate camera rotation with GSAP
    gsap.to(camera.rotation, {
        y: - cursor.x * 0.2, // adjust these values to control the amount of camera rotation
        x: cursor.y * 0.2,
        duration: 1, // duration of the animation in seconds
        ease: "power1.out" // easing function to make the movement smooth
    });
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')
const wrapper = document.querySelector('.wrapper')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particlesTexture = textureLoader.load('/textures/particles/5.png')


// Particles

const fireColors = [
    new THREE.Color("#D8EBFD"),  // Tiefes Rot
    new THREE.Color("#C5E1FC"),  // Feueriges Rot
    new THREE.Color("#B1D7FB"),  // Hellrotes Feuer
    new THREE.Color("#9ECEFA"),  // Dunkles Orange
    new THREE.Color("#8BC4F9"),  // Kräftiges Orange
    new THREE.Color("#77BAF8"),  // Leuchtendes Orange
    new THREE.Color("#64B0F7"),  // Goldgelb
    new THREE.Color("#51A6F6"),  // Hellgelb
    new THREE.Color("#3D9CF5")   // Blasses Gelb
  ];
  
const particlesGeometry = new THREE.BufferGeometry()
const count = 100

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
particlesMaterial.opacity = 0.5
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


// Model

let model;

gltfLoader.load(
    '/models/Balloon/scene.gltf',
    (gltf) =>
    {
        model = gltf.scene
        scene.add(model)
        model.position.set(0, 0, 0)
        
        if (window.innerWidth <= 768) {
            // Smaller scale for mobile devices
            model.scale.set(0.4, 0.4, 0.4)
        } else {
            // Default scale for larger screens
            model.scale.set(0.6, 0.6, 0.6)
        }
       

    }
)

// Lights
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)



/**
 * Sizes
 */
const sizes = {
    width: wrapper.offsetWidth,
    height: wrapper.offsetHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = wrapper.offsetWidth
    sizes.height = wrapper.offsetHeight

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
camera.position.x = 0
camera.position.y = 0
camera.position.z = 6

scene.add(camera)



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

    // Animation

    if (model) {
        model.rotateY(0.0005)
    }
    particles.rotation.x = - elapsedTime * 0.1
    particles.rotation.y = elapsedTime * 0.08

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
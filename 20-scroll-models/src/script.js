import * as THREE from 'three'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'

const gltfLoader = new GLTFLoader()

THREE.ColorManagement.enabled = false

const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (event) => 
{
    cursor.x = event.clientX / sizes.width -0.5
    cursor.y = -(event.clientY / sizes.width -0.5)
    
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')
const wrapper = document.querySelector('.wrapper')

// Scene
const scene = new THREE.Scene()

// Model

let model;

gltfLoader.load(
    '/models/Balloon/scene.gltf',
    (gltf) =>
    {
        model = gltf.scene
        scene.add(model)
        model.scale.set(0.1, 0.1, 0.1)
        model.position.set(0, 1.5, 0)
        model.rotation.set(0, 1, 0)
       

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
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 6

scene.add(camera)

// Controls

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

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

      // Update objects
    

    // Update Camera
   

    // model.rotation.x = .5 * elapsedTime
    // model.rotation.y = .2 * elapsedTime

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
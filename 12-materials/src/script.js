import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const gltfLoader = new GLTFLoader()

THREE.ColorManagement.enabled = false

const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])

const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('./textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.png')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects

// const material = new THREE.MeshNormalMaterial()
// material.wireframe = true

// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

const material = new THREE.MeshPhysicalMaterial()
material.metalness = 1
material.roughness = 0
material.envMap = environmentMapTexture


const glassMaterial = new THREE.MeshPhysicalMaterial()

    glassMaterial.clearcoat = 0.8;
    glassMaterial.ior = 1.15;
    glassMaterial.specularIntensity = 0.6;
    glassMaterial.roughness = 0;
    glassMaterial.metalness= 0
    glassMaterial.thickness = 0.5;
    glassMaterial.transmission = 1;
    glassMaterial.sheen = 0;
    glassMaterial.envMap = environmentMapTexture


// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 16, 16),
//     glassMaterial
// )
// sphere.position.set = (-1.5, 0, 0)


const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8), material
)

plane.position.set(0, 0, -1)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.2, 16, 32), material
)

torus.position.x = 3

scene.add(plane, torus)


let model;


gltfLoader.load('/models/Raven/ravency.gltf', (gltf) => {
    model = gltf.scene;

    // const material = new THREE.MeshMatcapMaterial()
    // material.matcap = matcapTexture

    // const standardMaterial = new THREE.MeshPhysicalMaterial();
    // standardMaterial.metalness = 1;
    // standardMaterial.roughness = 0.25;
    // standardMaterial.clearcoat = 1;
    

    model.traverse((node) => {
        if (node.isMesh) {
            node.material = glassMaterial;
            // node.material.envMap = environmentMapTexture;
            node.material.needsUpdate = true;
        }
    });

    scene.add(model);

    model.rotation.set(0, 0, 0)

    if (window.innerWidth <= 768) {
        model.scale.set(20, 20, 20);
        model.position.set(1, -0.5, 0);
    } else {
        model.scale.set(7, 7, 7);
        model.position.set(0, 0, 0);
    }
});


// Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)


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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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
    torus.rotation.y = elapsedTime * 0.5

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
import * as THREE from 'three'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import gsap from 'gsap'

const gltfLoader = new GLTFLoader()

const textureLoader = new THREE.TextureLoader()
const roughnessTexture = textureLoader.load('/textures/metal/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/9.png')

const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/5/px.png',
    '/textures/environmentMaps/5/nx.png',
    '/textures/environmentMaps/5/py.png',
    '/textures/environmentMaps/5/ny.png',
    '/textures/environmentMaps/5/pz.png',
    '/textures/environmentMaps/5/nz.png'
])


const cursor = {
    x: 0,
    y: 0,
    speed: 0
}

window.addEventListener('mousemove', (event) => {
    const previousX = cursor.x
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -(event.clientY / sizes.height - 0.5)
    cursor.speed = cursor.x - previousX

    gsap.to(camera.rotation, {
        y: - cursor.x * 0.2,
        x: cursor.y * 0.2,
        duration: 1,
        ease: "power1.out"
    });
})

const canvas = document.querySelector('canvas.webgl')
const wrapper = document.querySelector('.wrapper')

const scene = new THREE.Scene()


const particlesTexture = textureLoader.load('/textures/particles/5.png')

const fireColors = [
    new THREE.Color("#D8EBFD"),
    new THREE.Color("#C5E1FC"),
    new THREE.Color("#B1D7FB"),
    new THREE.Color("#9ECEFA"),
    new THREE.Color("#8BC4F9"),
    new THREE.Color("#77BAF8"),
    new THREE.Color("#64B0F7"),
    new THREE.Color("#51A6F6"),
    new THREE.Color("#3D9CF5")
]

const particlesGeometry = new THREE.BufferGeometry()
const count = 100
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for(let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10
    const color = fireColors[Math.floor(Math.random() * fireColors.length)]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.04,
    opacity: 0.5,
    sizeAttenuation: true,
    transparent: true,
    alphaMap: particlesTexture,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

let model;


gltfLoader.load('/models/Raven/ravency.gltf', (gltf) => {
    model = gltf.scene;

    // const material = new THREE.MeshMatcapMaterial()
    // material.matcap = matcapTexture

    const standardMaterial = new THREE.MeshPhysicalMaterial();
    standardMaterial.metalness = 1;
    standardMaterial.roughness = 0;
    standardMaterial.clearcoat = 1;
    standardMaterial.envMap = environmentMapTexture;
    standardMaterial.roughnessMap = roughnessTexture;
    

    model.traverse((node) => {
        if (node.isMesh) {
            node.material = standardMaterial;
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
        model.scale.set(20, 20, 20);
        model.position.set(-1, 0, 0);
    }
});

// const material = new THREE.MeshPhysicalMaterial({
//     color: 0xb2ffc8,
//     metalness: 0.25,
//     roughness: 0.1,
//     opacity: 1.0,
//     transparent: true,
//     transmission: 0.99,
//     clearcoat: 1.0,
//     clearcoatRoughness: 0.25
// })

// Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)


const sizes = {
    width: wrapper.offsetWidth,
    height: wrapper.offsetHeight
}

window.addEventListener('resize', () => {
    sizes.width = wrapper.offsetWidth
    sizes.height = wrapper.offsetHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 6);

scene.add(camera)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.gammaOutput = true
renderer.gammaFactor = 2.2

const clock = new THREE.Clock()
const maxAngle = THREE.MathUtils.degToRad(30);  
const speed = 0.5;  
const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    if (model) {
        model.rotation.y = Math.sin(elapsedTime * speed) * maxAngle;
    }

    particles.rotation.x = - elapsedTime * 0.1;
    particles.rotation.y = elapsedTime * 0.08;

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();

import { WebGLRenderer, Scene, PerspectiveCamera, PointLight } from 'three'
import loop from 'raf-loop'
import WAGNER from '@superguigui/wagner'
import BloomPass from '@superguigui/wagner/src/passes/bloom/MultiPassBloomPass'
import FXAAPass from '@superguigui/wagner/src/passes/fxaa/FXAAPass'
import resize from 'brindille-resize'
import { createPointCloud } from './utils/objects'
import OrbitControls from './controls/OrbitControls'
import { gui } from './utils/debug'
import noise from './noise/10000.json'

/* Custom settings */
const SETTINGS = {
  useComposer: false
}

const CLOUD_SIZE = 100

/* Init renderer and canvas */
const container = document.body
const renderer = new WebGLRenderer({antialias: true})
renderer.setClearColor(0x323232)
container.style.overflow = 'hidden'
container.style.margin = 0
container.appendChild(renderer.domElement)

/* Composer for special effects */
const composer = new WAGNER.Composer(renderer)
const bloomPass = new BloomPass()
const fxaaPass = new FXAAPass()

/* Main scene and camera */
const scene = new Scene()
const camera = new PerspectiveCamera(50, resize.width / resize.height, 0.1, 1000)
const controls = new OrbitControls(camera, {element: renderer.domElement, parent: renderer.domElement, distance: 100, phi: Math.PI * 0.5})

/* Lights */
const frontLight = new PointLight(0xFFFFFF, 1)
const backLight = new PointLight(0xFFFFFF, 0.5)
scene.add(frontLight)
scene.add(backLight)
frontLight.position.x = 20
backLight.position.x = -20

/* Actual content of the scene */
const { cloud, geometry } = createPointCloud({ numPoints: 100, size: CLOUD_SIZE })
scene.add(cloud)

/* Various event listeners */
resize.addListener(onResize)

/* create and launch main loop */
const engine = loop(render)
engine.start()

/* some stuff with gui */
gui.add(SETTINGS, 'useComposer')

/* -------------------------------------------------------------------------------- */

function animate() {
  requestAnimationFrame(animate);
  render();
}

function updatePointPositions(i) {
  const { vertices } = geometry;

  vertices.forEach((v, j) => {

    const n = noise[(i + j) % 10000];
    const n2 = noise[(i + j + 5000) % 10000];

    const DIR = j % 2 === 1 ? -1 : 1
    v.setX(-(CLOUD_SIZE / 2) + (n * CLOUD_SIZE))
    v.setY(-(CLOUD_SIZE / 2) + (n2 * CLOUD_SIZE))
  })

  geometry.verticesNeedUpdate = true
}
/**
  Resize canvas
*/
function onResize () {
  camera.aspect = resize.width / resize.height
  camera.updateProjectionMatrix()
  renderer.setSize(resize.width, resize.height)
  composer.setSize(resize.width, resize.height)
}

/**
  Render loop
*/
let i = 0
function render(dt) {
  controls.update()
  updatePointPositions(i % 10000);
  i++
  if (SETTINGS.useComposer) {
    composer.reset()
    composer.render(scene, camera)
    composer.pass(bloomPass)
    composer.pass(fxaaPass)
    composer.toScreen()
  } else {
    renderer.render(scene, camera)
  }
}

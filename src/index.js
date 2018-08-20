import { WebGLRenderer, Scene, PerspectiveCamera, PointLight } from 'three'
import loop from 'raf-loop'
import WAGNER from '@superguigui/wagner'
import BloomPass from '@superguigui/wagner/src/passes/bloom/MultiPassBloomPass'
import FXAAPass from '@superguigui/wagner/src/passes/fxaa/FXAAPass'
import resize from 'brindille-resize'
import { createPointCloud } from './utils/objects'
import OrbitControls from './controls/OrbitControls'
import { gui } from './utils/debug'

/* Custom settings */
const SETTINGS = {
  useComposer: false
}

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
const { cloud, geometry } = createPointCloud()
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

function updatePointPositions() {
  const { vertices } = geometry;
  // console.log('vertices', vertices.length);
  vertices.forEach((v, i) => {
    const DIR = i % 2 === 1 ? -1 : 1
    v.setX( v.x += DIR * 0.1 )
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
function render (dt) {
  controls.update()
  updatePointPositions();
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

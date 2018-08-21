import { WebGLRenderer, Scene, OrthographicCamera, PointLight, Vector3 } from 'three'
import loop from 'raf-loop'
import WAGNER from '@superguigui/wagner'
import BloomPass from '@superguigui/wagner/src/passes/bloom/MultiPassBloomPass'
import FXAAPass from '@superguigui/wagner/src/passes/fxaa/FXAAPass'
import resize from 'brindille-resize'
import { createPointCloud } from './utils/objects'
import OrbitControls from './controls/OrbitControls'
import { gui } from './utils/debug'
import noise from './noise/10000.json'

import Flora from 'florajs';

import Item from './objects/Item';
import FastAgent from './objects/FastAgent';
import Walker from './objects/Walker';
import Mover from './objects/Mover';
import System from './objects/System';
import World from './objects/World';


/* Custom settings */
const SETTINGS = {
  useComposer: false
}

const WIDTH = 500
const HEIGHT = 500

let scene, camera, controls, engine, renderer, composer, world

function initSystem() {
  System.setup(function() {
    System.Classes = {
      Item: Item,
      FastAgent: FastAgent,
      Walker: Walker
    };
    const world = this.add('World', {
      width: WIDTH,
      height: HEIGHT,
      FastAgent: {
        pointSize: 5,
        color: 0xFF0000
      },
      Walker: {
        pointSize: 3,
        color: 0x0000FF
      }
    })

    for (var i = 0; i < 500; i ++) {
      this.add('Walker', {
        location: new Flora.Vector(world.width * 0.9, world.height * 0.5),
        maxSpeed: 0.01,
        remainsOnScreen: true
      });
    }

    for (var i = 0; i < 500; i ++) {
      this.add('FastAgent', {
        location: new Flora.Vector(world.width * 0.1, world.height * 0.5),
        seekTarget: world.walkers[i]
      });
    }

    // this.add('FastAgent');
    this._toggleFPS();
  });
  System.loop();
}

function init() {

  initSystem()

  /* Init renderer and canvas */
  const container = document.body
  renderer = new WebGLRenderer({ antialias: true })
  renderer.setClearColor(0xffffff)
  container.style.overflow = 'hidden'
  container.style.margin = 0
  container.appendChild(renderer.domElement)

  /* Composer for special effects */
  composer = new WAGNER.Composer(renderer)
  const bloomPass = new BloomPass()
  const fxaaPass = new FXAAPass()

  /* Main scene and camera */
  scene = new Scene()
  camera = new OrthographicCamera(WIDTH / - 2, WIDTH / 2, HEIGHT / 2, HEIGHT / - 2, 1, 1000)
  camera.position.set( WIDTH / 2, HEIGHT / 2, 100 );
  controls = new OrbitControls(camera, {
    element: renderer.domElement,
    parent: renderer.domElement,
    distance: 500,
    enableRotate: false,
    enableZoom: true,
    target: new Vector3(WIDTH / 2, HEIGHT / 2, 0)
  })

  /* Lights */
  const frontLight = new PointLight(0xFFFFFF, 1)
  const backLight = new PointLight(0xFFFFFF, 0.5)
  scene.add(frontLight)
  scene.add(backLight)
  frontLight.position.x = 20
  backLight.position.x = -20

  /* Actual content of the scene */
  const clouds = System.firstWorld().clouds;
  scene.add(clouds.Walker);
  scene.add(clouds.FastAgent);

  /* Various event listeners */
  resize.addListener(onResize)

  /* create and launch main loop */
  engine = loop(render)
  engine.start()

  /* some stuff with gui */
  // gui.add(SETTINGS, 'useComposer')
}

init();


/* -------------------------------------------------------------------------------- */

/**
  Resize canvas
*/
function onResize () {
  camera.aspect = WIDTH / HEIGHT
  camera.updateProjectionMatrix()
  renderer.setSize(WIDTH, HEIGHT)
  composer.setSize(WIDTH, HEIGHT)
}

/**
  Render loop
*/
function render(dt) {
  controls.update()
  renderer.render(scene, camera)
}

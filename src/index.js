import { WebGLRenderer, Scene, OrthographicCamera, PointLight, Vector3 } from 'three'
import loop from 'raf-loop'
import WAGNER from '@superguigui/wagner'
import BloomPass from '@superguigui/wagner/src/passes/bloom/MultiPassBloomPass'
import FXAAPass from '@superguigui/wagner/src/passes/fxaa/FXAAPass'
import resize from 'brindille-resize'
import OrbitControls from './controls/OrbitControls'
import { gui } from './utils/debug'
import noise from './noise/10000.json'

import Flora from 'florajs';

// import Agent from './objects/Agent';
import Item from './objects/Item';
import Mover from './objects/Mover';
import Resource from './objects/Resource';
import Sensor from './objects/Sensor';
import System from './objects/System';
import Walker from './objects/Walker';
import World from './objects/World';

/* Custom settings */
const SETTINGS = {
  useComposer: false
}

let WIDTH = resize.width
let HEIGHT = resize.height
const rand = Flora.Utils.getRandomNumber;

const NUM_AGENTS = 50
const NUM_WALKERS = 50
const NUM_RESOURCES = 50

let scene, camera, controls, engine, renderer, composer, world

function huntersAndPrey() {
  System.setup(function() {
    System.Classes = {
      // Agent: Agent,
      Item: Item,
      Resource: Resource,
      Sensor: Sensor,
      Walker: Walker
    };
    const world = this.add('World', {
      width: WIDTH,
      height: HEIGHT,
      gravity: new Flora.Vector(),
      c: 0,
      Hawk: {
        pointSize: 10,
        color: 0xFF00FF
      },
      Dove: {
        pointSize: 10,
        color: 0x00FFFF
      },
      Resource: {
        pointSize: 50,
        color: 0xFFFFFF
      }
    })

    for (var i = 0; i < NUM_RESOURCES; i ++) {
      const location = new Flora.Vector(rand(world.width * 0.25, world.width * 0.75), rand(world.height * 0.25, world.height * 0.75));
      this.add('Resource', {
        type: 'Food',
        location,
        isStatic: true
      });
    }



    for (var i = 0; i < NUM_WALKERS; i ++) {
      this.add('Walker', {
        type: 'Dove',
        location: new Flora.Vector(world.width * 0.6, world.height * 0.9),
        maxSpeed: 0.01,
        // remainsOnScreen: true,
        perlinSpeed: 0.001,
        motorSpeed: 2,
        minSpeed: 1,
        maxSpeed: 4,
        sensors: [
          this.add('Sensor', {
            type: 'Food',
            targetClass: 'Resource',
            sensitivity: 400,
            behavior: 'EAT',
            onConsume: (sensor, resource) => {
              const dove = sensor.parent;
              System.remove(resource, {
                list: resource.world.resources
              })
            }
          })
        ]
      });
    }

    for (var i = 0; i < NUM_AGENTS; i ++) {
      this.add('Walker', {
        type: 'Hawk',
        location: new Flora.Vector(world.width * 0.1, world.height * 0.5),
        // seekTarget: world.walkers[i],
        motorSpeed: 2,
        minSpeed: 1,
        maxSpeed: 6,
        // flocking: true,
        sensors: [
          this.add('Sensor', {
            type: 'Food',
            targetClass: 'Resource',
            sensitivity: 400,
            behavior: 'EAT',
            onConsume: (sensor, resource) => {
              const hawk = sensor.parent;
              System.remove(resource, {
                list: resource.world.resources
              })
            }
          })
        ]
      });
    }

    this.frameFunction = function() {

      return;
      const agents = world.agents;
      const walkers = world.walkers;
      const freeWalkers = walkers.filter(w => !w.isStatic)

      const setNewTarget = agent => {
        if (freeWalkers.length) {
          agent.seekTarget = freeWalkers.shift()
        } else {
          // agent.seekTarget = null;
          // agent.isStatic = true
          // agent.opacity = 0.5
        }
      }

      // check if there are any walkers inside agents
      walkers.forEach(w => {
        if (!w.isStatic) {
          agents.forEach(a => {
            const inside = Flora.Utils.isInside(w, a);
            if (inside) {
              w.isStatic = true
              w.opacity = 0.5
            }
            // set a new target for agent
            if (a.seekTarget && a.seekTarget.isStatic) {
              setNewTarget(a);
            }
          })
        }
      })
    }

    // this.add('Agent');
    this._toggleFPS();
  });
  System.loop();
}

function initSystem() {

  huntersAndPrey()

}

function init() {

  initSystem()

  /* Init renderer and canvas */
  const container = document.body
  renderer = new WebGLRenderer({ antialias: true })
  renderer.setClearColor(0x000000)
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
  scene.add(clouds.Resource);
  scene.add(clouds.Dove);
  scene.add(clouds.Hawk);

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
  WIDTH = resize.width
  HEIGHT = resize.height
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

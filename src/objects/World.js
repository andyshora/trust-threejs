var Vector = require('vector2d-lib'),
    Item = require('./Item'),
    FastAgent = require('./FastAgent'),
    Utils = require('drawing-utils-lib');

import { Vector3 } from 'three'

var createPointCloud = require('../utils/objects').createPointCloud;

/**
 * Creates a new World.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @constructor
 */
function World(opt_options) {
  Item.call(this);

  var options = opt_options || {};

  this.el = options.el || document.body;
  this.name = 'World';

  if (options.data) {
    const { cloud, geometry } = createPointCloud({ numPoints: 0, size: options.data.size, pointSize: 0.5 })
    this.cloud = cloud;
    this.geometry = geometry;
  }

  /**
   * Worlds do not have worlds. However, assigning an
   * object literal makes for less conditions in the
   * update loop.
   */
  this.world = {};
}
Utils.extend(World, Item);

/**
 * Resets all properties.
 * @function init
 * @memberof World
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.width = this.el.scrollWidth] Width.
 * @param {number} [opt_options.height = this.el.scrollHeight] Height.
 *
 */
World.prototype.init = function(world, opt_options) {

  console.log('World.init', opt_options);

  World._superClass.init.call(this, this.world, opt_options);

  var options = opt_options || {};

  this.color = options.color || [0, 0, 0];
  this.width = options.width || this.el.scrollWidth;
  this.height = options.height || this.el.scrollHeight;
  this.location = options.location || new Vector(0, 0);
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || [0, 0, 0];
  this.gravity = options.gravity || new Vector(0, 1);
  this.c = typeof options.c !== 'undefined' ? options.c : 0.1;
  this.pauseStep = !!options.pauseStep;
  this.pauseDraw = !!options.pauseDraw;
  this.el.className = this.name.toLowerCase();
  this._camera = this._camera || new Vector();
  this.fastAgents = [];
};

/**
 * Adds an item to the world's view.
 * @param {Object} item An instance of item.
 */
World.prototype.add = function(item) {
  console.log('World.add', item, item.location.x, item.location.y);
  this.fastAgents.push(item);

  // add a vertex to the cloud to represent FastAgent's position
  this.geometry.vertices.push(new Vector3(item.location.x, item.location.y, 0));

  console.log('updated cloud', this.cloud);

  // this.el.appendChild(item);
  // todo - add item to point cloud
};

/**
 * Adds an item to the world's view.
 * @param {Object} item An instance of item.
 */
World.prototype.addVertex = function(item) {
  console.log('World.addVertex', item);
  // this.pointCloud.geometry.vertices.push()
  // this.el.appendChild(item);
  // todo - add item to point cloud
};

/**
 * Applies forces to world.
 * @function step
 * @memberof World
 */
World.prototype.step = function() {
  // update position of all vertices
  for (let i = 0; i < this.fastAgents.length; i++) {
    const v = this.geometry.vertices[i]
    v.setX(this.fastAgents[i].location.x / 10)
    v.setY(this.fastAgents[i].location.y / 10)
  }
  this.geometry.verticesNeedUpdate = true;
  this.location.add(this._camera);
};

/**
 * Updates the corresponding DOM element's style property.
 * @function draw
 * @memberof World
 */
World.prototype.draw = function() {
  const data = {
    x: this.location.x - (this.width / 2),
    y: this.location.y - (this.height / 2),
    angle: this.angle,
    scale: this.scale || 1,
    width: this.width,
    height: this.height,
    color0: this.color[0],
    color1: this.color[1],
    color2: this.color[2],
    borderWidth: this.borderWidth,
    borderStyle: this.borderStyle,
    borderColor1: this.borderColor[0],
    borderColor2: this.borderColor[1],
    borderColor3: this.borderColor[2]
  };

  this.data = data;
};

module.exports = World;

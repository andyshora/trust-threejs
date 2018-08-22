var Vector = require('vector2d-lib'),
    Item = require('./Item'),
    Agent = require('./Agent'),
    Utils = require('drawing-utils-lib');

import {
  Color,
  Vector3
} from 'three'

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

  this.clouds = {
    Agent: createPointCloud({ pointSize: options.Agent.pointSize, color: options.Agent.color }),
    Walker: createPointCloud({ pointSize: options.Walker.pointSize, color: options.Walker.color }),
    Resource: createPointCloud({ pointSize: options.Resource.pointSize, color: options.Resource.color })
  };


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
  this._camera = this._camera || new Vector();
  this.agents = [];
  this.resources = [];
  this.walkers = [];
};

/**
 * Adds an item to the world's view.
 * @param {Object} item An instance of item.
 */
World.prototype.add = function(item) {
  switch (item.type) {
    case 'Dove':
      this.walkers.push(item);
      // add a vertex to the cloud to represent Walker's position
      this.clouds.Walker.geometry.vertices.push(new Vector3(item.location.x, item.location.y, 0));
      this.clouds.Walker.geometry.colors.push(new Color(0x00FF33));
      break;
    case 'Food':
      this.resources.push(item);
      // add a vertex to the cloud to represent Walker's position
      this.clouds.Resource.geometry.vertices.push(new Vector3(item.location.x, item.location.y, 0));
      this.clouds.Resource.geometry.colors.push(new Color(0xFFFFFF));
      break;
    case 'Hawk':
      this.agents.push(item);
      // add a vertex to the cloud to represent Agent's position
      this.clouds.Agent.geometry.vertices.push(new Vector3(item.location.x, item.location.y, 0));
      this.clouds.Agent.geometry.colors.push(new Color(0x00FFFF));
      break;
    default:
      break;
  }
};

/**
 * Applies forces to world.
 * @function step
 * @memberof World
 */
World.prototype.step = function() {
  // update position of all vertices
  for (let i = 0; i < this.agents.length; i++) {
    const v = this.clouds.Agent.geometry.vertices[i]
    v.setX(this.agents[i].location.x)
    v.setY(this.agents[i].location.y)

    if (this.agents[i].opacity < 1) {
      this.clouds.Agent.geometry.colors[i] = new Color(0xFF1111);
      this.clouds.Agent.geometry.colorsNeedUpdate = true;
    }
  }
  // update position of all vertices
  for (let i = 0; i < this.walkers.length; i++) {
    const v = this.clouds.Walker.geometry.vertices[i]
    v.setX(this.walkers[i].location.x)
    v.setY(this.walkers[i].location.y)

    if (this.walkers[i].opacity < 1) {
      this.clouds.Walker.geometry.colors[i] = new Color(0xFF1111);
      this.clouds.Walker.geometry.colorsNeedUpdate = true;
    }
  }
  this.clouds.Agent.geometry.verticesNeedUpdate = true;
  this.clouds.Walker.geometry.verticesNeedUpdate = true;

  this.location.add(this._camera);
};

module.exports = World;

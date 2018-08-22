import {
  Utils,
  Vector
} from 'burner';

import Item from './Item';
// import System from './System';

/**
 * Creates a new Resource.
 *
 * Resources are the root object for any item that moves. They are not
 * aware of other Resources or stimuli. They have no means of locomotion
 * and change only due to external forces. You will never directly
 * implement Resource.
 *
 * @constructor
 * @extends Item
 */
function Resource(opt_options) {
  Item.call(this);
}
Utils.extend(Resource, Item);

/**
 * Initializes an instance of Resource.
 * @param  {Object} world An instance of World.
 * @param  {Object} opt_options A map of initial properties.
 * @param {string|Array} [opt_options.color = 255, 255, 255] Color.
 * @param {boolean} [opt_options.pointToDirection = true] If true, object will point in the direction it's moving.
 * @param {boolean} [opt_options.draggable = false] If true, object can move via drag and drop.
 * @param {Object} [opt_options.parent = null] A parent object. If set, object will be fixed to the parent relative to an offset distance.
 * @param {boolean} [opt_options.pointToParentDirection = true] If true, object points in the direction of the parent's velocity.
 * @param {number} [opt_options.offsetDistance = 30] The distance from the center of the object's parent.
 * @param {number} [opt_options.offsetAngle = 0] The rotation around the center of the object's parent.
 * @param {function} [opt_options.afterStep = null] A function to run after the step() function.
 * @param {function} [opt_options.isStatic = false] Set to true to prevent object from moving.
 * @param {Object} [opt_options.parent = null] Attach to another Flora object.
 */
Resource.prototype.init = function(world, opt_options) {
  Resource._superClass.init.call(this, world, opt_options);

  var options = opt_options || {};

  this.color = options.color || [255, 255, 255];
  this.pointToDirection = typeof options.pointToDirection === 'undefined' ? true : options.pointToDirection;
  this.parent = options.parent || null;
  this.pointToParentDirection = typeof options.pointToParentDirection === 'undefined' ? true : options.pointToParentDirection;
  this.type = options.type;
  this.offsetDistance = typeof options.offsetDistance === 'undefined' ? 0 : options.offsetDistance;
  this.offsetAngle = options.offsetAngle || 0;
  this.isStatic = !!options.isStatic;
};

Resource.prototype.step = function() {
  var i, max, x = this.location.x,
      y = this.location.y;

  this.beforeStep.call(this);

  // do stuff - check collisions, etc

  this.afterStep.call(this);
};

module.exports = Resource;

const CollisionUtils = {};

/**
 * Determines if one object is inside another.
 *
 * @function isInside
 * @memberof Utils
 * @param {Object} obj The object.
 * @param {Object} container The containing object.
 * @param {Number} tolerance Multiplier for container dimensions, to increase the number of collisions.
 * @returns {boolean} Returns true if the object is inside the container.
 */
CollisionUtils.isInside = function(obj, container, tolerance = 1) {
  if (!obj || !container) {
    throw new Error('isInside() requires both an object and a container.');
  }

  obj.width = obj.width || 0;
  obj.height = obj.height || 0;
  container.width = container.width * tolerance || 0;
  container.height = container.height * tolerance || 0;

  if (obj.location.x + obj.width / 2 > container.location.x - container.width / 2 &&
    obj.location.x - obj.width / 2 < container.location.x + container.width / 2 &&
    obj.location.y + obj.height / 2 > container.location.y - container.height / 2 &&
    obj.location.y - obj.height / 2 < container.location.y + container.height / 2) {
    return true;
  }
  return false;
};

module.exports = CollisionUtils;

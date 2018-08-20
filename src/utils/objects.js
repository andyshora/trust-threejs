import { Geometry, Points, PointsMaterial, Math, Vector3 } from 'three'

export const createPointCloud = ({ numPoints = 50, size = 1000, pointSize = 1 }) => {

  const geometry = new Geometry()

  for ( var i = 0; i < numPoints; i ++ ) {

  	var star = new Vector3()
  	star.x = Math.randFloatSpread( size / 2 )
  	star.y = Math.randFloatSpread( size / 2 )
  	star.z = Math.randFloatSpread( 0 )

  	geometry.vertices.push( star );
  }

  const material = new PointsMaterial( { color: 0xff00ff, size: pointSize } )
  const cloud = new Points( geometry, material );

  return { geometry, cloud }
}

import { Geometry, Points, PointsMaterial, Math, Vector3 } from 'three'

export const createPointCloud = () => {

  const geometry = new Geometry()

  for ( var i = 0; i < 10000; i ++ ) {

  	var star = new Vector3()
  	star.x = Math.randFloatSpread( 200 )
  	star.y = Math.randFloatSpread( 200 )
  	star.z = Math.randFloatSpread( 0 )

  	geometry.vertices.push( star );
  }

  const material = new PointsMaterial( { color: 0xff00ff, size: 1 } )
  const cloud = new Points( geometry, material );

  return { geometry, cloud }
}

import { Geometry, Points, PointsMaterial, Math, TextureLoader, Vector3, VertexColors } from 'three'

export const createPointCloud = ({ pointSize = 1, color = 0x666666 }) => {
  const sprite = new TextureLoader().load('assets/images/disc.png');
  const geometry = new Geometry()

  const material = new PointsMaterial({
    vertexColors: VertexColors,
    size: pointSize,
    map: sprite,
    alphaTest: 0.5,
    transparent: true,
    sizeAttenuation: false
  })
  return new Points(geometry, material);
}

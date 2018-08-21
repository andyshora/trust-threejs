import { Geometry, Points, PointsMaterial, Math, Vector3 } from 'three'

export const createPointCloud = ({ pointSize = 1, color = 0x666666 }) => {
  const geometry = new Geometry()
  const material = new PointsMaterial({ color, size: pointSize })
  return new Points(geometry, material);
}

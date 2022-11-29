import { distanceBetweenPointAndSegment } from '../../utils/math'
import type { BoundType, CurrentElementType } from '~/store/modules/svg'

export function hitTest(
  element: CurrentElementType,
  x: number,
  y: number,
) {
  // For shapes that are composed of lines, we only enable point-selection when the distance
  // of the click is less than x pixels of any of the lines that the shape is composed of
  const lineThreshold = 10

  if (element.type === 'Ellipse') {
    // https://stackoverflow.com/a/46007540/232122
    const px = Math.abs(x - element.bound.x - element.bound.width / 2)
    const py = Math.abs(y - element.bound.y - element.bound.height / 2)

    let tx = 0.707
    let ty = 0.707

    const a = element.bound.width / 2
    const b = element.bound.height / 2;

    [0, 1, 2, 3].forEach(() => {
      const xx = a * tx
      const yy = b * ty

      const ex = ((a * a - b * b) * tx ** 3) / a
      const ey = ((b * b - a * a) * ty ** 3) / b

      const rx = xx - ex
      const ry = yy - ey

      const qx = px - ex
      const qy = py - ey

      const r = Math.hypot(ry, rx)
      const q = Math.hypot(qy, qx)

      tx = Math.min(1, Math.max(0, ((qx * r) / q + ex) / a))
      ty = Math.min(1, Math.max(0, ((qy * r) / q + ey) / b))
      const t = Math.hypot(ty, tx)
      tx /= t
      ty /= t
    })

    return Math.hypot(a * tx - px, b * ty - py) < lineThreshold
  }
  else if (element.type === 'Rectangle') {
    const x1 = getElementAbsoluteX1(element.bound)
    const x2 = getElementAbsoluteX2(element.bound)
    const y1 = getElementAbsoluteY1(element.bound)
    const y2 = getElementAbsoluteY2(element.bound)
    // (x1, y1) --A-- (x2, y1)
    //    |D             |B
    // (x1, y2) --C-- (x2, y2)
    return (
      distanceBetweenPointAndSegment(x, y, x1, y1, x2, y1) < lineThreshold // A
      || distanceBetweenPointAndSegment(x, y, x2, y1, x2, y2) < lineThreshold // B
      || distanceBetweenPointAndSegment(x, y, x2, y2, x1, y2) < lineThreshold // C
      || distanceBetweenPointAndSegment(x, y, x1, y2, x1, y1) < lineThreshold // D
    )
  }
}

export function getElementAbsoluteX1(bound: BoundType) {
  return bound.width >= 0 ? bound.x : bound.x + bound.width
}
export function getElementAbsoluteX2(bound: BoundType) {
  return bound.width >= 0 ? bound.x + bound.width : bound.x
}
export function getElementAbsoluteY1(bound: BoundType) {
  return bound.height >= 0 ? bound.y : bound.y + bound.height
}
export function getElementAbsoluteY2(bound: BoundType) {
  return bound.height >= 0 ? bound.y + bound.height : bound.y
}


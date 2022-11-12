import { rotate } from './math'

/**
 * 1.先绘制一条直线，起点到终点，
 * 2.然后计算水平方向的两个箭翼的坐标，
 * 3.然后计算起点到终点的角度，
 * 4.计算旋转后的箭翼的坐标
 * @param element 绘制的元素
 * @returns 箭头的四个坐标
 */
export function getArrowPoints(element: any) {
  const x1 = 0
  const y1 = 0
  const x2 = element.width
  const y2 = element.height

  const size = 30 // pixels
  const distance = Math.hypot(x2 - x1, y2 - y1)
  // Scale down the arrow until we hit a certain size so that it doesn't look weird
  const minSize = Math.min(size, distance / 2)
  const xs = x2 - ((x2 - x1) / distance) * minSize
  const ys = y2 - ((y2 - y1) / distance) * minSize

  const angle = 20 // degrees
  const [x3, y3] = rotate(xs, ys, x2, y2, (-angle * Math.PI) / 180)
  const [x4, y4] = rotate(xs, ys, x2, y2, (angle * Math.PI) / 180)

  return [x1, y1, x2, y2, x3, y3, x4, y4]
}

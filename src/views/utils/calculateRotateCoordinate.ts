/**
 * end点相对start点的角度
 * @param start 起点
 * @param end 终点
 * @returns baseAngle [-π,π]
 */
export function calculateAngle(start: [number, number], end: [number, number]) {
  const distanceX = end[0] - start[0]
  const distanceY = end[1] - start[1]
  const baseAngle = Math.atan2(distanceY, distanceX)
  return baseAngle
}

/**
 * 在平面直角坐标系中， 点 end 绕点 start 逆时针旋转 angle 后的坐标
 * @returns [x2, y2] 旋转后的坐标
 */
export function calculateCoords(start: number[], end: number[], angle) {
  const x = start[0]
  const y = start[1]
  const x1 = end[0]
  const y1 = end[1]

  const sin = Math.sin(angle)
  const cos = Math.cos(angle)

  const x2 = x + (x1 - x) * cos - (y1 - y) * sin
  const y2 = y + (y1 - y) * cos + (x1 - x) * sin
  return [x2, y2]
}

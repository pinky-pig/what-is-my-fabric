import { path2Rough } from '../path2Rough'

export function getArrowDefaultPath(mouseFromPoint: number[], mouseToPoint: number[]) {
  // 1.这里得出平行于x轴的箭头
  const coords = horizontalArrow(mouseFromPoint, mouseToPoint)

  // 2.计算角度
  const angle = calculateAngle(mouseFromPoint, mouseToPoint)

  // 3.计算每个点的旋转后的坐标
  const points = coords.map((item: number[]) => {
    return calculateCoords(mouseFromPoint, item, angle)
  })

  // 4.将每个点转成Path
  let path = ` M ${points[0][0]} ${points[0][1]}`
  path += ` L ${points[1][0]} ${points[1][1]}`
  path += ` L ${points[2][0]} ${points[2][1]}`
  path += ` M ${points[1][0]} ${points[1][1]}`
  path += ` L ${points[3][0]} ${points[3][1]}`

  return path2Rough(path)
}

/**
 * 箭头的平行于x轴正方向的图形点坐标
 * @param start 起点
 * @param end 终点
 * @param h 箭翼离箭杆的距离（这里角度设置为 30 度）
 * @returns
 */
function horizontalArrow(start: number[], end: number[], h = 10) {
  const x = start[0]
  const y = start[1]
  const x1 = end[0]
  const y1 = end[1]
  // 弦的长度
  const s = Math.sqrt((x1 - x) ** 2 + (y1 - y) ** 2)
  // 第一个点是start点
  const first = start
  // 第二个点 x 是弦长，y 是 start 的 y 值
  const second = [x + s, start[1]]
  const tan = Math.tan(Math.PI / 6)
  const w = h / tan
  // 第三个点是上面的箭翼，根据三角函数算出 x ，y 就是 start 的值加 箭翼离箭杆的距离
  const three = [second[0] - w, y + h]
  // 第四个点是下面的箭翼，跟第三个点根据 start 的 y 对称
  const four = [second[0] - w, y - h]
  return [
    first, second,
    three, four,
  ]
}

/**
 * end点相对start点的角度
 * @param start 起点
 * @param end 终点
 * @returns baseAngle [-π,π]
 */
export function calculateAngle(start: number[], end: number[]) {
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

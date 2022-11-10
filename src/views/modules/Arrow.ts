import type { Object as TObject } from 'fabric/fabric-impl'
import { calculateAngle, calculateCoords } from '../utils/calculateRotateCoordinate'
import { Base } from './Base'

export type FabricObject = TObject
export interface pointType { x: number; y: number }
export class Arrow extends Base {
  svgPath2String(svgPath: pointType[]) {
    const [mouseFrom, mouseTo] = svgPath
    const mouseFromPoint: [number, number] = [mouseFrom.x, mouseFrom.y]
    const mouseToPoint: [number, number] = [mouseTo.x, mouseTo.y]

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
    return path
  }
}

/**
 * 箭头的平行于x轴正方向的图形点坐标
 * @param start 起点
 * @param end 终点
 * @param h 箭翼离箭杆的距离（这里角度设置为 30 度）
 * @returns
 */
function horizontalArrow(start: [number, number], end: [number, number], h = 10) {
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

// 效果较好的箭头
// svgPath2String(svgPath: pointType[]) {
//   const [mouseFrom, mouseTo] = svgPath
//   const x1 = mouseFrom.x
//   const y1 = mouseFrom.y
//   const x2 = mouseTo.x
//   const y2 = mouseTo.y
//   const w = x2 - x1
//   const h = y2 - y1
//   const sh = Math.cos(Math.PI / 4) * 16
//   const sin = h / Math.sqrt(w ** 2 + h ** 2)
//   const cos = w / Math.sqrt(w ** 2 + h ** 2)
//   const w1 = (16 * sin) / 4
//   const h1 = (16 * cos) / 4
//   const centeX = sh * cos
//   const centerY = sh * sin

//   let path = ` M ${x1} ${y1}`
//   path += ` L ${x2 - centeX + w1} ${y2 - centerY - h1}`
//   path += ` L ${x2 - centeX + w1 * 2} ${y2 - centerY - h1 * 2}`
//   path += ` L ${x2} ${y2}`
//   path += ` L ${x2 - centeX - w1 * 2} ${y2 - centerY + h1 * 2}`
//   path += ` L ${x2 - centeX - w1} ${y2 - centerY + h1}`
//   path += ' Z'

//   return path
// }

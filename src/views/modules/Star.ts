import { Base } from './Base'
export interface pointType { x: number; y: number }
export class Rect extends Base {
  // 生成箭头的svg路径
  svgPath2String(svgPath: pointType[]) {
    const [mouseFrom, mouseTo] = svgPath

    const x1 = mouseFrom.x
    const x2 = mouseTo.x
    const y1 = mouseFrom.y
    const y2 = mouseTo.y
    /**
     * 实现思路  (x1,y1)表示鼠标起始的位置 (x2,y2)表示鼠标抬起的位置
     * r 表示五边形外圈圆的半径，这里建议自己画个图理解
     * 正五边形夹角为36度。计算出cos18°，sin18°备用
     */
    const w = Math.abs(x2 - x1)
    const h = Math.abs(y2 - y1)
    const r = Math.sqrt(w * w + h * h)
    const cos18 = Math.cos(18 * Math.PI / 180)
    const sin18 = Math.sin(18 * Math.PI / 180)

    /**
     * 算出对应五个点的坐标转化为路径
     */
    const point1 = [x1, y1 + r]
    const point2 = [x1 + 2 * r * (sin18), y1 + r - 2 * r * (cos18)]
    const point3 = [x1 - r * (cos18), y1 + r * (sin18)]
    const point4 = [x1 + r * (cos18), y1 + r * (sin18)]
    const point5 = [x1 - 2 * r * (sin18), y1 + r - 2 * r * (cos18)]

    let path = ` M ${point1[0]} ${point1[1]}`
    path += ` L ${point2[0]} ${point2[1]}`
    path += ` L ${point3[0]} ${point3[1]}`
    path += ` L ${point4[0]} ${point4[1]}`
    path += ` L ${point5[0]} ${point5[1]}`
    path += ' Z'

    return path
  }
}

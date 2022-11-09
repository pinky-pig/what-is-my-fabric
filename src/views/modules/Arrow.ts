import { fabric } from 'fabric'
import { Base } from './Base'
export interface pointType { x: number; y: number }
export class Arrow extends Base {
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

  svgPath2String(svgPath: pointType[]) {
    const [mouseFrom, mouseTo] = svgPath
    const mouseFromPoint = [mouseFrom.x, mouseFrom.y]
    const mouseToPoint = [mouseTo.x, mouseTo.y]

    // 这里得出平行与x轴的箭头
    const coords = horizontalArrow(mouseFromPoint, mouseToPoint)

    // 计算角度
    const angle = calculateAngle(mouseFromPoint, mouseToPoint)
    const points = coords.map((item: [number, number]) => {
      return calculateCoords(mouseFromPoint, item, angle)
    })

    let path = ` M ${points[0][0]} ${points[0][1]}`
    path += ` L ${points[1][0]} ${points[1][1]}`
    path += ` L ${points[2][0]} ${points[2][1]}`
    path += ` M ${points[1][0]} ${points[1][1]}`
    path += ` L ${points[3][0]} ${points[3][1]}`
    return path
  }

  getFabricObject() {
    return new fabric.Path(this.svgPathString, this.config)
  }

  update(location: { x: number; y: number }[]) {
    const [mouseFrom, mouseTo] = location
    const path = this.svgPath2String([mouseFrom, mouseTo])
    const updatedPath = new fabric.Path(path, this.config)

    if (this.fabricObject) {
      updatedPath.oCoords = this.fabricObject.oCoords
      this.fabricObject.set(updatedPath)
    }

    this.canvas.renderAll()
  }
}

// 计算平行于x轴的箭头的P3和P4两个点。角度设为30度，h是高度，可以体现两侧的长度
export function horizontalArrow(start, end, h = 10) {
  const x = start[0]
  const y = start[1]
  const x1 = end[0]
  const y1 = end[1]
  // 弦的长度
  const s = Math.sqrt((x1 - x) ** 2 + (y1 - y) ** 2)
  // 第一个点是start点
  const first = start
  // 第二个点是以x是弦长，方向是朝end的方向

  // 符号要跟x1的相同
  const sign = (x1 - x) !== 0 ? (x1 - x) / Math.abs((x1 - x)) : 1

  const second = sign > 0 ? [x + s, start[1]] : [x - s, start[1]]
  // 第三个点是通过tan求出坐标，角度是30度 弧度为 Math.PI / 6
  const tan = Math.tan(Math.PI / 6)
  const w = h / tan
  const three = sign > 0 ? [second[0] - w, y + h] : [second[0] + w, y + h]
  // 第四个点跟第三个x轴一样，y轴成对称
  const four = sign > 0 ? [second[0] - w, y - h] : [second[0] + w, y - h]
  return [
    first, second,
    three, four,
  ]
}

// 计算坐标旋转角度后的位置
export function calculateCoords(start, end, angle) {
  const x = start[0]
  const y = start[1]
  const x1 = end[0]
  const y1 = end[1]

  const sin = Math.sin(angle)
  let cos = Math.cos(angle)

  // 因为 sin 函数和 cos 函数的 不包括钝角
  // 互为补角的两个角的sin值相等，cos和tan互为相反数。
  if (Math.abs(angle) > (Math.PI / 2)) {
    // sin = -sin
    cos = -cos
  }

  const x2 = x + (x1 - x) * cos - (y1 - y) * sin
  const y2 = y + (y1 - y) * cos + (x1 - x) * sin

  return [x2, y2]
}

// 计算角度
export function calculateAngle(start, end) {
  // atan2 方法返回一个 -pi 到 pi 之间的数值，表示点 (x, y) 对应的偏移角度。
  // 这是一个逆时针角度，以弧度为单位，正 X 轴和点 (x, y) 与原点连线 之间。
  // 注意此函数接受的参数：先传递 y 坐标，然后是 x 坐标。
  const distanceX = end[0] - start[0]
  const distanceY = end[1] - start[1]
  const baseAngle = Math.atan2(distanceY, distanceX)
  return baseAngle
}

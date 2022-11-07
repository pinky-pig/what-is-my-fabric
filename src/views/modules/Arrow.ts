import { Base } from './Base'
export interface pointType { x: number; y: number }
export class Arrow extends Base {
  svgPath2String(svgPath: pointType[]) {
    const [mouseFrom, mouseTo] = svgPath
    const x1 = mouseFrom.x
    const y1 = mouseFrom.y
    const x2 = mouseTo.x
    const y2 = mouseTo.y
    const w = x2 - x1
    const h = y2 - y1
    const sh = Math.cos(Math.PI / 4) * 16
    const sin = h / Math.sqrt(w ** 2 + h ** 2)
    const cos = w / Math.sqrt(w ** 2 + h ** 2)
    const w1 = (16 * sin) / 4
    const h1 = (16 * cos) / 4
    const centeX = sh * cos
    const centerY = sh * sin

    let path = ` M ${x1} ${y1}`
    path += ` L ${x2 - centeX + w1} ${y2 - centerY - h1}`
    path += ` L ${x2 - centeX + w1 * 2} ${y2 - centerY - h1 * 2}`
    path += ` L ${x2} ${y2}`
    path += ` L ${x2 - centeX - w1 * 2} ${y2 - centerY + h1 * 2}`
    path += ` L ${x2 - centeX - w1} ${y2 - centerY + h1}`
    path += ' Z'

    return path
  }
}

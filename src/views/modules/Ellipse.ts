import { Base } from './Base'
export interface pointType { x: number; y: number }
export class Ellipse extends Base {
  svgPath2String(svgPath: pointType[]) {
    const [mouseFrom, mouseTo] = svgPath

    const rx = (mouseTo.x - mouseFrom.x) / 2
    const ry = (mouseTo.y - mouseFrom.y) / 2
    const cx = mouseFrom.x + rx
    const cy = mouseFrom.y + ry

    const path = `M ${cx - rx} ${cy}
     a ${rx} ${ry} 0 1 0 ${2 * rx} 0
     a ${rx} ${ry} 0 1 0 ${-2 * rx} 0
     z`

    return path
  }
}

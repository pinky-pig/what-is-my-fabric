import { Base } from './Base'
export interface pointType { x: number; y: number }
export class Rect extends Base {
  svgPath2String(svgPath: pointType[]) {
    const [mouseFrom, mouseTo] = svgPath
    const path = `M ${mouseFrom.x} ${mouseFrom.y}
    L ${mouseTo.x} ${mouseFrom.y}
    L ${mouseTo.x} ${mouseTo.y}
    L ${mouseFrom.x} ${mouseTo.y}
    L ${mouseFrom.x} ${mouseFrom.y} z`
    return path
  }
}

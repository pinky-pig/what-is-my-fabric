import type { StrokeOptions } from 'perfect-freehand'
import getStroke from 'perfect-freehand'
import { Base } from '../BaseUtil/index'
import { getSvgPathFromStroke } from '~/views/whiteboard/utils'
export interface pointType { x: number; y: number }
export class Draw extends Base {
  // freehand 配置
  private _config_Draw: StrokeOptions = {
    size: 10,
    thinning: 0.618,
    smoothing: 0.5,
    streamline: 0.5,
  }

  // 生成svg路径
  svgPath2String(svgPath: (number[] | {
    x: number
    y: number
    pressure?: number
  })[]) {
    const stroke = getStroke(svgPath, this._config_Draw)
    const path = getSvgPathFromStroke(stroke)
    return path
  }

  // 获取path string生成的对象
  getFabricObject() {
    // return new fabric.Path(this.svgPathString, this._config_Draw as any)
  }

  // update(location: (number[] | {
  //   x: number
  //   y: number
  //   pressure?: number
  // })[]) {

  // }
}

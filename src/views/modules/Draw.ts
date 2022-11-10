import { fabric } from 'fabric'
import type { StrokeOptions } from 'perfect-freehand'
import getStroke from 'perfect-freehand'
import { getSvgPathFromStroke } from '../utils'
import type { FabricObject } from './Base'
import { Base } from './Base'
export interface pointType { x: number; y: number }
export class Draw extends Base {
  private _config_Draw: StrokeOptions = {
    size: 4.25,
    thinning: 0.618,
    smoothing: 0.5,
    streamline: 0.5,
    // easing: t => t,
    // start: {
    //   taper: 0,
    //   easing: t => t,
    //   cap: true,
    // },
    // end: {
    //   taper: 100,
    //   easing: t => t,
    //   cap: true,
    // },
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

  getFabricObject(): FabricObject {
    return new fabric.Path(this.svgPathString, this._config_Draw as any)
  }

  update(location: (number[] | {
    x: number
    y: number
    pressure?: number
  })[]) {
    const path = this.svgPath2String(location)
    const updatedPath = new fabric.Path(path, this._config_Draw as any)

    if (this.fabricObject) {
      updatedPath.oCoords = this.fabricObject.oCoords
      this.fabricObject.set(updatedPath)
    }

    this.canvas.renderAll()
  }
}

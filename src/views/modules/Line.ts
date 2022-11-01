import type { IObjectOptions, Object as TObject } from 'fabric/fabric-impl'
import { fabric } from 'fabric'
import useCanvas from '../control/useCanvas'
// import { RoughPath } from './rough-path'
import { useFabricStore } from '~/store/modules/fabric'

export type insertType = 'D' | 'M' | 'L' | 'V' | 'H' | 'C' | 'S' | 'Q' | 'T' | 'A' | 'Z'
export interface svgPathType { type: insertType; points: { x: number; y: number } }
export type FabricObject = TObject
export interface pointType { x: number; y: number }
/**
 * 这里是箭头， todo 扩展成为曲线箭头 Curve ArrowArrow
 * <path d="M 0 0 L 10 10 z"> + 箭头
 *
 * 目前只有两个点，起点和终点。 todo 三个点， 起点，curve点 ，和终点
 */

export class Line {
  svgPath: pointType[]
  canvas = useCanvas()[0]
  fabricStore = useFabricStore()
  fabricObject: FabricObject | null = null
  id: number = Date.now()
  private _config: IObjectOptions = {
    name: String(this.id),
    strokeWidth: 1,
    strokeUniform: true,
    fill: 'rgba(0,0,0,0)',
    hoverCursor: 'default',
    hasBorders: true,
    stroke: 'red',
    borderColor: '#00bfff',
    selectable: false,
    hasControls: true,
    flipX: false,
    flipY: false,
    evented: true,
  }

  constructor(svgPath: pointType[]) {
    this.svgPath = svgPath
  }

  set config(newConfig: IObjectOptions) {
    Object.assign(this._config, newConfig)
  }

  get config(): IObjectOptions {
    return this._config
  }

  // 生成箭头的svg路径
  svgPath2String(svgPath: pointType[]) {
    const [mouseFrom, mouseTo] = svgPath

    const path = `
     M ${mouseFrom.x} ${mouseFrom.y}
     L ${mouseTo.x} ${mouseTo.y}
     z`
    return path
  }

  get svgPathString() {
    return this.svgPath2String(this.svgPath)
  }

  getFabricObject(): FabricObject {
    // return new RoughPath(this.svgPathString, this.config, undefined)
    return new fabric.Path(this.svgPathString, this.config)
  }

  render() {
    this.fabricObject = this.getFabricObject()
    this.canvas.add(this.fabricObject)
  }

  update(location: { x: number; y: number }[]) {
    const [mouseFrom, mouseTo] = location

    const path = this.svgPath2String([mouseFrom, mouseTo])
    const updatedPath = new fabric.Path(path)

    if (this.fabricObject) {
      this.fabricObject.set({
        path: updatedPath.path,
        width: updatedPath.width,
        height: updatedPath.height,
        pathOffset: updatedPath.pathOffset,
        top: updatedPath.top,
        left: updatedPath.left,
      } as any)
    }
    this.canvas.renderAll()
  }

  remove() {
    this.canvas.remove(this.fabricObject as FabricObject)
  }
}

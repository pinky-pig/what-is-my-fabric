import type { IObjectOptions, Object as TObject } from 'fabric/fabric-impl'
// import { fabric } from 'fabric'
import rough from 'roughjs'
import type { Options } from 'roughjs/bin/core'
import useCanvas from '../control/useCanvas'
import { RoughPath } from './rough-path'
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

export class Base {
  svgPath: pointType[]
  canvas = useCanvas()[0]
  fabricStore = useFabricStore()
  fabricObject: FabricObject | null = null
  id: number = Date.now()
  seed: number = rough.newSeed()
  private _config: IObjectOptions = {
    name: String(this.id),
    strokeWidth: 1,
    strokeUniform: true,
    fill: 'rgba(0,0,0,0)',
    hoverCursor: 'default',
    hasBorders: true,
    stroke: 'red',
    borderColor: 'rgb(66, 133, 244)',
    selectable: false,
    hasControls: true,
    flipX: false,
    flipY: false,
    evented: true,
  }

  private _roughOption: Options = {
    seed: this.pathSeed,
    strokeWidth: 3,
    roughness: 3,
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

  set roughOption(newConfig: Options) {
    Object.assign(this._roughOption, newConfig)
  }

  get roughOption(): Options {
    return this._roughOption
  }

  // 生成svg路径
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

  get pathSeed() {
    return this.seed
  }

  getFabricObject(): FabricObject {
    return new RoughPath(this.svgPathString, this.config, this.roughOption)
  }

  render() {
    this.fabricObject = this.getFabricObject()
    this.canvas.add(this.fabricObject)
  }

  update(location: { x: number; y: number }[]) {
    const [mouseFrom, mouseTo] = location
    const path = this.svgPath2String([mouseFrom, mouseTo])
    const updatedPath = new RoughPath(path, this.config, this.roughOption)

    if (this.fabricObject) {
      updatedPath.oCoords = this.fabricObject.oCoords
      this.fabricObject.set(updatedPath)
    }

    this.canvas.renderAll()
  }

  remove() {
    this.canvas.remove(this.fabricObject as FabricObject)
  }
}

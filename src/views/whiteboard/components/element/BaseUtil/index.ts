import rough from 'roughjs'
import type { Options } from 'roughjs/bin/core'

export type insertType = 'D' | 'M' | 'L' | 'V' | 'H' | 'C' | 'S' | 'Q' | 'T' | 'A' | 'Z'
export interface svgPathType { type: insertType; points: { x: number; y: number } }
export interface pointType { x: number; y: number }

export class Base {
  svgPath: pointType[]
  canvas = null
  fabricStore = null
  fabricObject = null
  id: number = Date.now()
  seed: number = rough.newSeed()
  private _config = {
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

  set config(newConfig: any) {
    Object.assign(this._config, newConfig)
  }

  get config() {
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

  getObject() {
    // return new RoughPath(this.svgPathString, this.config, this.roughOption)
  }

  render() {
    // this.object = this.getObject()
    // this.canvas.add(this.object)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(location: { x: number; y: number }[]) {
    // const [mouseFrom, mouseTo] = location
    // const path = this.svgPath2String([mouseFrom, mouseTo])
    // const updatedPath = new RoughPath(path, this.config, this.roughOption)

    // if (this.object) {
    //   updatedPath.oCoords = this.object.oCoords
    //   this.object.set(updatedPath)
    // }

    // this.canvas.renderAll()
  }

  remove() {
    // this.canvas.remove(this.object)
  }
}

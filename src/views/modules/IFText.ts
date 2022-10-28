import type { IObjectOptions, ITextboxOptions, IText as TObject } from 'fabric/fabric-impl'
import { fabric } from 'fabric'
import useCanvas from '../control/useCanvas'
import { useFabricStore } from '~/store/modules/fabric'

export type insertType = 'D' | 'M' | 'L' | 'V' | 'H' | 'C' | 'S' | 'Q' | 'T' | 'A' | 'Z'
export interface svgPathType { type: insertType; points: { x: number; y: number } }
export type FabricObject = TObject
export interface pointType { x: number; y: number }
/**
 * 这里是箭头， todo 扩展成为曲线箭头 Curve Arrow
 * <path d="M 0 0 L 10 10 z"> + 箭头
 *
 * 目前只有两个点，起点和终点。 todo 三个点， 起点，curve点 ，和终点
 */

export class IFText {
  svgPath: pointType[]
  canvas = useCanvas()[0]
  fabricStore = useFabricStore()
  fabricObject: TObject | null = null
  id: number = Date.now()
  private _config: ITextboxOptions = {
    name: String(this.id),
    left: 0,
    top: 0,
    borderColor: 'rgba(0,0,0,0.5)',
    fontSize: Number(24),
    fill: 'red',
    charSpacing: Number(10),
    lineHeight: Number(36),
    selectable: false,
    editable: true,
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

  get svgPathString() {
    return ''
  }

  getFabricObject(): FabricObject {
    const [mouseFrom] = this.svgPath
    this.config = {
      left: mouseFrom.x,
      top: mouseFrom.y,
    }
    return new fabric.Textbox('', this.config)
  }

  render() {
    this.fabricObject = this.getFabricObject()
    this.canvas.add(this.fabricObject)
    this.fabricObject.enterEditing()
  }

  update() {

  }

  svgPath2String() {
    return ''
  }

  remove() {
    this.canvas.remove(this.fabricObject as FabricObject)
  }
}

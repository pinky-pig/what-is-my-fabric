import { defineStore } from 'pinia'
import { ColorStyle } from '~/views/whiteboard/types'

enum IMode {
  Hand = 'Hand',
  Erase = 'Erase',
  FreeDraw = 'FreeDraw',
  Line = 'Line',
  Rectangle = 'Rectangle',
  Ellipse = 'Ellipse',
  Arrow = 'Arrow',
  Text = 'Text',
}

export enum ControlCursor {
  top_left_corner = 'nwse-resize',
  top_right_corner = 'nesw-resize',
  bottom_left_corner = 'nesw-resize',
  bottom_right_corner = 'nwse-resize',
  top_edge = 'ns-resize',
  bottom_edge = 'ns-resize',
  left_edge = 'ew-resize',
  right_edge = 'ew-resize',
  top_center_rotate = 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 24 24\'><path fill=\'currentColor\' d=\'M19 8l-4 4h3c0 3.31-2.69 6-6 6c-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6c1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4l4-4H6z\'%3E%3C/path%3E%3C/svg%3E") 16 16, pointer',
}
export const ControlConf = {
  strokeColor: ColorStyle.Indigo,
}
export type ControlCursorTypes = keyof typeof ControlCursor
export type ModeTypes = keyof typeof IMode
export interface cfgState {
  viewPortX: number
  viewPortY: number
  viewPortWidth: number
  viewPortHeight: number
}
export interface ElementStyle {
  left?: number
  top?: number
  stroke: string
  fill: string
  strokeWidth: number
  backgroundColor?: string
  roughness?: string
  opacity?: string
}
export interface BoundType {
  x: number
  y: number
  width: number
  height: number
}
export interface CurrentElementType {
  id: string // uuid
  type: ModeTypes // 类型 圆、矩形、直线、、、
  path: string // 路径
  style: ElementStyle // 样式
  isSelected: boolean // 是否选中
  bound: BoundType // 要素所占的边界坐标
  matrix?: string // 要素的变形
  groupMatrix?: string // 用于 rotate 因为rotate后，bounds控制点不好控制，所以这个属性加载到 group中
}

export interface SvgState {
  svgWrapperRef: null | HTMLDivElement
  svgCanvasRef: null | HTMLCanvasElement
  cfg: cfgState
  viewPortZoom: number
  mode: ModeTypes // 当前绘制工具类型
  modeList: ModeTypes[] // 全部绘制工具类型
  elements: CurrentElementType[] // 所有的数据集合，按要素类型分为几种
  currentDrawingPath: string // 自由绘制的点生成的Path
  mouseFrom: { x: number; y: number; pressure?: number }
  mouseTo: { x: number; y: number; pressure?: number }
  isDrawing: boolean // 是否正在绘制
  isCanvasStateChanging: boolean // 画布的状态是否正在改变 平移 | 缩放 |
}

export const useSvgStore = defineStore({
  id: 'svgStore',
  state: (): SvgState => {
    return {
      svgWrapperRef: null,
      svgCanvasRef: null,
      cfg: {
        viewPortX: 0,
        viewPortY: 0,
        viewPortWidth: 0,
        viewPortHeight: 0,
      },
      viewPortZoom: 1,
      mode: 'FreeDraw',
      modeList: Object.keys(IMode) as ModeTypes[],
      elements: [],
      currentDrawingPath: '',
      mouseFrom: { x: 0, y: 0 },
      mouseTo: { x: 0, y: 0 },
      isDrawing: false,
      isCanvasStateChanging: false,
    }
  },
  getters: {

  },
  actions: {
    getWidth() {
      return this.svgWrapperRef?.offsetWidth || 800
    },
    getHeight() {
      return this.svgWrapperRef?.offsetHeight || 750
    },
    // 改变是否拖拽画布
    changeCanvasState(flag: boolean) {
      this.isCanvasStateChanging = flag
      if (flag) {
        // toggleSelection(false)
        this.mode = 'Hand'
        this.changeIsDrawing(false)
      }
      else {
        this.mode = 'FreeDraw'
        // toggleSelection(true)
      }
    },
    // 改变是否正在绘制状态
    changeIsDrawing(flag: boolean) {
      this.isDrawing = flag
      // 绘制结束
      if (!flag)
        this.finishDraw()
    },
    finishDraw() {
      // this.elements.push({
      //   id: generateUuid(),
      //   type: this.mode,
      //   path: this.currentDrawingPath,
      // })
      // this.currentDrawingPath = ''
    },

    handleChangeMode(mode?: ModeTypes) {
      if (mode === this.mode)
        return
      if (mode)
        this.mode = mode
    },
  },
})

import { defineStore } from 'pinia'

enum IMode {
  Hand = 'Hand',
  FreeDraw = 'FreeDraw',
  Line = 'Line',
  Rectangle = 'Rectangle',
  Ellipse = 'Ellipse',
  Arrow = 'Arrow',
  Text = 'Text',
}
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
  bound: BoundType
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

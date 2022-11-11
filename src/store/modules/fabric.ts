import { defineStore } from 'pinia'
import { toggleSelection } from '~/views/control/useCanvas'
import { exitRenderTextPreview } from '~/views/control/useDraw'
import type { Arrow } from '~/views/modules/Arrow'
import type { Text } from '~/views/modules/Text'
import type { Line } from '~/views/modules/Line'
import type { Rect } from '~/views/modules/Rect'
import type { Ellipse } from '~/views/modules/Ellipse'

enum Mode {
  Hand = 'Hand',
  FreeDraw = 'FreeDraw',
  Line = 'Line',
  Rect = 'Rect',
  Ellipse = 'Ellipse',
  Arrow = 'Arrow',
  Text = 'Text',
}
export const maxStep = 10 // 保存的最大步数
export type TMode = keyof typeof Mode
export type TObjects = Arrow | Line | Rect | Ellipse | Text
export interface IFabricState {
  wrapperRef: null | HTMLDivElement
  canvasRef: null | HTMLCanvasElement
  mode: TMode
  modeList: TMode[]
  mouseFrom: { x: number; y: number; pressure?: number }
  mouseTo: { x: number; y: number; pressure?: number }
  freeDrawPoints: { x: number; y: number; pressure?: number }[]
  isMouseDown: boolean
  isCanvasDragging: boolean
  isDrawing: boolean
  isTexting: boolean
  isCtrlKey: boolean
  zoom: number
  activeObjectId: number | null
  temp: Arrow | Text | Rect | null // 上一个对象
  objects: TObjects[] // 所有的对象
  history: string[] // 操作历史
  redoHistory: object[] // 回退操作历史
}

export const useFabricStore = defineStore({
  id: 'fabricStore',
  state: (): IFabricState => {
    return {
      wrapperRef: null,
      canvasRef: null,
      mode: 'Hand',
      modeList: Object.keys(Mode) as TMode[],
      mouseFrom: { x: 0, y: 0 },
      mouseTo: { x: 0, y: 0 },
      freeDrawPoints: [],
      isCanvasDragging: false,
      isDrawing: false,
      isTexting: false,
      isMouseDown: false,
      isCtrlKey: false,
      zoom: 1,
      activeObjectId: null,
      temp: null,
      objects: [],
      history: [],
      redoHistory: [],
    }
  },
  getters: {

  },
  actions: {
    getWidth() {
      return this.wrapperRef?.offsetWidth || 800
    },
    getHeight() {
      return this.wrapperRef?.offsetHeight || 750
    },

    setMouseFrom(data: { x?: number; y?: number; pressure?: number }) {
      Object.assign(this.mouseFrom, data)
    },

    setFreeDrawPoints(data: { x?: number; y?: number; pressure?: number }) {
      Object.assign(this.freeDrawPoints.at(-1) || {}, data)
    },

    // 改变是否绘制
    handleChangeIsDrawing(flag: boolean) {
      this.isDrawing = flag

      // 绘制结束
      if (!flag)
        this.finishDraw()
    },
    // 改变是否拖拽画布
    handleChangeIsCanvasDragging(flag: boolean) {
      this.isCanvasDragging = flag
      if (flag)
        toggleSelection(false)
      else
        toggleSelection(true)
    },
    finishDraw() {
      // 清空缓存
      if (this.temp) {
        this.objects.push(this.temp)
        this.temp = null
        this.freeDrawPoints = []
      }

      this.redoHistory = []
    },

    handleChangeMode(mode?: TMode) {
      if (mode === this.mode)
        return
      if (mode)
        this.mode = mode

      switch (this.mode) {
        case 'Hand':
          // 退出文字编辑模式
          exitRenderTextPreview()
          // 将所有的要素可选中
          toggleSelection(true)
          break
        case 'Line':
          toggleSelection(false)
          break
        case 'Arrow':
          toggleSelection(false)
          break
        case 'Text':
          toggleSelection(false)
          break
        case 'Rect':
          toggleSelection(false)
          break
        case 'Ellipse':
          toggleSelection(false)
          break
        case 'FreeDraw':
          toggleSelection(false)
          // 这里使用 perfect-freehand ，所以将 fabric.js 的笔刷禁止了
          // canvas.isDrawingMode = true
          // canvas.freeDrawingBrush.color = 'red'
          break

        default:
          break
      }
    },
  },
})

import { defineStore } from 'pinia'
import { toggleSelection } from '~/views/control/useCanvas'
import useDisableEvent from '~/views/control/useDisableEvent'
import type { Arrow } from '~/views/modules/Arrow'
import type { Line } from '~/views/modules/Line'

enum Mode {
  Hand = 'Hand',
  Line = 'Line',
  Curve = 'Curve',
  Rect = 'Rect',
  Ellipse = 'ellipse',
  Arrow = 'Arrow',
}
export type TMode = keyof typeof Mode
export type TObjects = Arrow | Line

export interface IFabricState {
  wrapperRef: null | HTMLDivElement
  canvasRef: null | HTMLCanvasElement
  mode: TMode
  modeList: TMode[]
  mouseFrom: { x: number; y: number }
  mouseTo: { x: number; y: number }
  isMouseDown: boolean
  isCanvasDragging: boolean
  isDrawing: boolean
  isCtrlKey: boolean
  zoom: number
  activeObjectId: number | null
  temp: Arrow | null // 上一个对象
  objects: TObjects[] // 所有的对象
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
      isDrawing: false,
      isMouseDown: false,
      isCanvasDragging: false,
      isCtrlKey: false,
      zoom: 1,
      activeObjectId: null,
      temp: null,
      objects: [],
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

    handleChangeIsDrawing(flag: boolean) {
      this.isDrawing = flag

      if (!flag)
        this.temp = null
    },

    handleChangeMode(mode?: TMode) {
      if (mode === this.mode)
        return
      if (mode)
        this.mode = mode

      // 切换模式，比如画直线到画箭头，
      // 先将原来绘制过程中的缓存清掉（绘制预览）

      const [, toggleDisabledEvent] = useDisableEvent()

      switch (this.mode) {
        case 'Hand':
          // 将所有的要素可选中
          toggleSelection(true)
          // 清除之前已选中
          toggleDisabledEvent(false)
          break
        case 'Arrow':
          // 将所有的不可选中
          toggleSelection(false)
          // toggleDisabledEvent(true)
          break

        default:
          break
      }
    },
  },
})

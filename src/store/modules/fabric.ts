import { defineStore } from 'pinia'
import type { Arrow } from '~/views/modules/Arrow'

enum Mode {
  Hand = 'Hand',
  Line = 'Line',
  Curve = 'Curve',
  Rect = 'Rect',
  Ellipse = 'ellipse',
  Arrow = 'Arrow',
}

export type TMode = keyof typeof Mode

export interface IDesignState {
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
  temp: Arrow | null
}
export const useFabricStore = defineStore({
  id: 'fabricStore',
  state: (): IDesignState => {
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

    handleChangeMode(mode?: TMode) {
      if (mode === this.mode)
        return
      if (mode)
        this.mode = mode
    },
  },
})

import { defineStore } from 'pinia'

enum Mode {
  Hand = 'Hand',
  Line = 'Line',
  Curve = 'Curve',
}

export type TMode = keyof typeof Mode

export interface IDesignState {
  wrapperRef: null | HTMLDivElement
  canvasRef: null | HTMLCanvasElement
  mode: TMode
  modeList: TMode[]
  pointer: { x: number; y: number }
  isMouseDown: boolean
  isCanvasDragging: boolean
  isCtrlKey: boolean
  zoom: number
  activeObjectId: number | null
}
export const useFabricStore = defineStore({
  id: 'fabricStore',
  state: (): IDesignState => {
    return {
      wrapperRef: null,
      canvasRef: null,
      mode: 'Hand',
      modeList: Object.keys(Mode) as TMode[],
      pointer: { x: 0, y: 0 },
      isMouseDown: false,
      isCanvasDragging: false,
      isCtrlKey: false,
      zoom: 1,
      activeObjectId: null,
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
      // const [canvas] = useCanvas()
    },
  },
})

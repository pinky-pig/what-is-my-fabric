import { defineStore } from 'pinia'

enum Mode {
  Hand = 'Hand',
  FreeDraw = 'FreeDraw',
  Line = 'Line',
  Rect = 'Rect',
  Ellipse = 'Ellipse',
  Arrow = 'Arrow',
  Text = 'Text',
}
export type ModeTypes = keyof typeof Mode
export interface cfgState {
  viewPortX: number
  viewPortY: number
  viewPortWidth: number
  viewPortHeight: number
}

export interface SvgState {
  svgWrapperRef: null | HTMLDivElement
  svgCanvasRef: null | HTMLCanvasElement
  cfg: cfgState
  viewPortZoom: number
  Objects: [] // 所有的数据集合，按要素类型分为几种
  freeDrawPoints: (number[] | {
    x: number
    y: number
    pressure?: number
  })[] // 自由绘制的点的集合
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
      Objects: [],
      freeDrawPoints: [],
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
  },
})

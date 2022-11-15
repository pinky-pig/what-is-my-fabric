import { defineStore } from 'pinia'

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
    }
  },
  getters: {

  },
  actions: {

  },
})

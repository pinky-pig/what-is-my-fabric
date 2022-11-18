/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Ref } from 'vue'
import type { ModeTypes } from '~/store/modules/svg'
interface elementType {
  type: ModeTypes
  path: string | (number[] | {
    x: number
    y: number
    pressure?: number
  })[]
}
export const drawElementOnCanvas = (
  element: elementType,
  canvasRef: Ref<HTMLDivElement | null>,
) => {
  switch (element.type) {
    case 'FreeDraw':

      break

    default:
      break
  }
}

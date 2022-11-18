import getStroke from 'perfect-freehand'
import { getSvgPathFromStroke } from '~/views/utils'

const default_config = {
  size: 10,
  thinning: 0.618,
  smoothing: 0.5,
  streamline: 0.5,
}

export const generateFreeDrawPath = (points: (number[] | {
  x: number
  y: number
  pressure?: number
})[], options = default_config) => {
  return getSvgPathFromStroke(
    getStroke(points, options),
  )
}

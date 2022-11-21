import { Arrow, Ellipse, Rectangle } from '../components/element'
import type { ModeTypes } from '~/store/modules/svg'
export const useRenderElement = (
  mouseFromPoint: { x: number; y: number; pressure?: number },
  mouseToPoint: { x: number; y: number; pressure?: number },
  elementType: ModeTypes,
) => {
  const startPoint = [mouseFromPoint.x, mouseFromPoint.y]
  const endPoint = [mouseToPoint.x, mouseToPoint.y]
  switch (elementType) {
    case 'Arrow':
      return Arrow.getSvgElement(startPoint, endPoint, false)
    case 'Rectangle':
      return Rectangle.getSvgElement(startPoint, endPoint, false)
    case 'Ellipse':
      return Ellipse.getSvgElement(startPoint, endPoint, false)

    default:
      break
  }
  return {
    path: '',
    style: {
      strokeWidth: 2,
      stroke: 'black',
      fill: 'transparent',
    },
  }
}

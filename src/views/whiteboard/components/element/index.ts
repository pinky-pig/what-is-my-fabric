import { TDShapeType } from '../../types'
import { ArrowUtil } from './ArrowUtil'
import { EllipseUtil } from './EllipseUtil'
import { RectangleUtil } from './RectangleUtil'

export const Arrow = new ArrowUtil()
export const Rectangle = new RectangleUtil()
export const Ellipse = new EllipseUtil()

export const shapeUtils = {
  [TDShapeType.Arrow]: Arrow,
  [TDShapeType.Rectangle]: Rectangle,
  [TDShapeType.Ellipse]: Ellipse,
}

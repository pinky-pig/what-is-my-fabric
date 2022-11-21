import { TDShapeType } from '../../types'
import { ArrowUtil } from './ArrowUtil'
import { RectangleUtil } from './RectangleUtil'

export const Arrow = new ArrowUtil()
export const Rectangle = new RectangleUtil()

export const shapeUtils = {
  [TDShapeType.Arrow]: Arrow,
  [TDShapeType.Rectangle]: Rectangle,
}

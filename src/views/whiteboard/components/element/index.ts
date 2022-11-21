import { TDShapeType } from '../../types'
import { ArrowUtil } from './ArrowUtil'

export const Arrow = new ArrowUtil()

export const shapeUtils = {
  [TDShapeType.Arrow]: Arrow,
}

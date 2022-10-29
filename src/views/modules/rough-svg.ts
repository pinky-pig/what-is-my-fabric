/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Object } from 'fabric/fabric-impl'
import { fabric } from 'fabric'
import type { Options } from 'roughjs/bin/core'
import { RoughPath } from './rough-path'
import { RoughEllipse } from './rough-ellipse'
import { RoughRect } from './rough-rect'
import { RoughLine } from './rough-line'
import { RoughPolygon } from './rough-polygon'
import { RoughCircle } from './rough-circle'

export const RoughSvg = (objects: Object[], options: any, roughOptions: Options = {}) => {
  const { height, width } = options
  const group = new fabric.Group([], options)
  for (const object of objects) {
    const { fill = 'red', stroke = 'red', strokeWidth = 2, left = 100, top = 100, opacity = 1 } = object
    const roughOption = {
      hachureGap: strokeWidth / 2,
      ...roughOptions,
      fill: fill as string,
      opacity,
      stroke: stroke || 'none',
      strokeWidth,
    }
    const newLeft = -width / 2 + left
    const newTop = -height / 2 + top
    switch (object.type) {
      case 'path':
        // @ts-expect-error
        group.add(new RoughPath(object.path, { ...object, left: newLeft, top: newTop }, roughOption))
        break
      case 'ellipse':
        group.add(new RoughEllipse({ ...object, left: newLeft, top: newTop }, roughOption))
        break
      case 'rect':
        group.add(new RoughRect({ ...object, left: newLeft, top: newTop }, roughOption))
        break
      case 'line':
        // @ts-expect-error
        group.add(new RoughLine([object.x1, object.y1, object.x2, object.y2], { ...object, left: newLeft, top: newTop }, roughOption))
        break
      case 'polyline':
        // @ts-expect-error
        group.add(new RoughPolygon(object.points, { ...object, left: newLeft, top: newTop }, roughOption))
        break
      case 'polygon':
        // @ts-expect-error
        group.add(new RoughPolygon(object.points, { ...object, left: newLeft, top: newTop }, roughOption))
        break
      case 'circle':
        group.add(new RoughCircle({ ...object, left: newLeft, top: newTop }, roughOption))
        break
    }
  }
  return group
}

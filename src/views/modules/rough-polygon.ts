import { fabric } from 'fabric'
import roughjs from 'roughjs/bin/rough'
import type { Options } from 'roughjs/bin/core'
import type { IPolylineOptions } from 'fabric/fabric-impl'

export const RoughPolygon: { new (points: Array<{ x: number; y: number }>, options?: IPolylineOptions, roughOptions?: Options): fabric.Polygon } = fabric.util.createClass(fabric.Polygon, {
  type: 'roughPolygon',
  instance: null,
  roughOptions: null,
  initialize(points, options, roughOptions) {
    this.roughOptions = roughOptions
    this.callSuper('initialize', points, options)
  },
  /**
     * Recalculates line points given width and height
     * @private
     */
  _render(ctx) {
    const rc = roughjs.canvas(ctx.canvas)
    if (this.instance) {
      rc.draw(this.instance)
    }
    else {
      const l = -this.pathOffset.x
      const t = -this.pathOffset.y
      const points = this.points.map(({ x, y }) => [x + l, y + t])
      this.instance = rc.polygon(points, this.roughOptions)
    }
  },
  _toSVG() {
    const r: string[] = this.callSuper('_toSVG')
    r[0] = '<polyline '
    return r
  },
})

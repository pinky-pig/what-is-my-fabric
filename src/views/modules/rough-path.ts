import type { Options } from 'roughjs/bin/core'
import { fabric } from 'fabric'
import roughjs from 'roughjs/bin/rough'
import type { IPathOptions, Point } from 'fabric/fabric-impl'
import { withCustomMathRandom } from '../utils/random'

export const RoughPath: { new (path: string | Point[], config: IPathOptions, roughOption?: Options): fabric.Path } = fabric.util.createClass(fabric.Path, {
  type: 'roughPath',
  instance: null,
  fillInstance: null,
  roughOptions: null,
  initialize(path, options, roughOptions) {
    this.roughOptions = roughOptions
    this.callSuper('initialize', path, options)
  },
  _render(ctx) {
    const rc = roughjs.canvas(ctx.canvas)
    if (this.instance) {
      rc.draw(this.instance)
    }
    else {
      const l = -this.pathOffset.x
      const t = -this.pathOffset.y
      const path = this.path
        .map(o => o
          .map((i, index) => {
            if (Number.isFinite(i)) {
              if (index % 2) { // x
                return i + l
              }
              else { // y
                return i + t
              }
            }
            else {
              return i
            }
          }))
        .join(' ')
      // this.instance = rc.path(path, this.roughOptions)

      const createPath = (path: any, style: any) => {
        return rc.path(path, style)
      }
      const generateShape = (path: any, style: any) =>
        withCustomMathRandom(746071638, () => {
          return createPath(path, {
            stroke: 'rgba(0, 0, 0, 0)',
            roughness: 2,
            ...style,
          })
        })

      this.instance = generateShape(path, {
        stroke: 'black',
        strokeWidth: 2,
      })

      this.fillInstance = generateShape(path, {
        fill: 'green',
        fillStyle: 'hachure',
      })
    }
  },
})

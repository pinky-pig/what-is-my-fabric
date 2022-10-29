import { fabric } from 'fabric'
import type { IEllipseOptions } from 'fabric/fabric-impl'
import type { Options } from 'roughjs/bin/core'
import roughjs from 'roughjs/bin/rough'

export const RoughEllipse: { new (config: IEllipseOptions, roughOptions?: Options): fabric.Ellipse } = fabric.util.createClass(fabric.Ellipse, {
  type: 'roughEllipse',
  instance: null,
  roughOptions: null,
  initialize(config, roughOptions) {
    this.roughOptions = roughOptions
    this.callSuper('initialize', config)
  },
  _render(ctx) {
    const rc = roughjs.canvas(ctx.canvas)
    if (this.instance)
      rc.draw(this.instance)

    else
      this.instance = rc.ellipse(0, 0, this.rx * 2, this.ry * 2, this.roughOptions)
  },
})

import { fabric } from 'fabric'
import roughjs from 'roughjs/bin/rough'
import type { IRectOptions } from 'fabric/fabric-impl'
import type { Options } from 'roughjs/bin/core'

export const RoughRect: { new (config: IRectOptions, roughOption?: Options): fabric.Rect } = fabric.util.createClass(fabric.Rect, {
  type: 'roughRect',
  instance: null,
  roughOptions: null,
  initialize(options, roughOption) {
    this.roughOptions = roughOption
    this.callSuper('initialize', options)
  },
  _render(ctx) {
    const rc = roughjs.canvas(ctx.canvas)
    if (this.instance) {
      rc.draw(this.instance)
    }
    else {
      this.instance = rc.rectangle(
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height,
        this.roughOptions,
      )
    }
  },
})

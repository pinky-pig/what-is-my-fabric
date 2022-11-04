/* eslint-disable prefer-const */
import { fabric } from 'fabric'

const clamp = function (n, max, min) {
  if (typeof min !== 'number')
    min = 0
  return n > max ? max : n < min ? min : n
}
const getRandom = function (max, min?: number) {
  min = min || 0
  return Math.random() * ((max || 1) - min) + min
}
export const CrayonBrush: { new (canvas, opt): any } = fabric.util.createClass(fabric.BaseBrush, {

  color: '#000',
  opacity: 0.6,
  width: 30,

  _baseWidth: 20,
  _inkAmount: 10,
  _latestStrokeLength: 0,
  _point: null,
  _sep: 5,
  _size: 0,
  _latest: null,
  _drawn: false,

  initialize(canvas, opt) {
    opt = opt || {}

    this.canvas = canvas
    this.width = opt.width || canvas.freeDrawingBrush.width
    this.color = opt.color || canvas.freeDrawingBrush.color
    this.opacity = opt.opacity || canvas.contextTop.globalAlpha
    this._point = new fabric.Point(0, 0)
  },

  onMouseDown(pointer) {
    this.canvas.contextTop.globalAlpha = this.opacity
    this._size = this.width / 2 + this._baseWidth
    this._drawn = false
    this.set(pointer)
  },

  onMouseMove(pointer) {
    this.update(pointer)
    this.draw(this.canvas.contextTop)
  },

  onMouseUp() {
    if (this._drawn)
      this.convertToImg()

    this._latest = null
    this._latestStrokeLength = 0
    this.canvas.contextTop.globalAlpha = 1
  },

  set(p) {
    if (this._latest)
      this._latest.setFromPoint(this._point)
    else
      this._latest = new fabric.Point(p.x, p.y)

    fabric.Point.prototype.setFromPoint.call(this._point, p)
  },

  update(p) {
    this.set(p)
    this._latestStrokeLength = this._point.subtract(this._latest).distanceFrom({ x: 0, y: 0 })
  },

  draw(ctx) {
    let i, j, p, r, c, x, y, w, h, v, s, stepNum, dotSize, dotNum, range

    v = this._point.subtract(this._latest)
    s = Math.ceil(this._size / 2)
    stepNum = Math.floor(v.distanceFrom({ x: 0, y: 0 }) / s) + 1

    dotSize = this._sep * clamp(this._inkAmount / this._latestStrokeLength * 3, 1, 0.5)
    dotNum = Math.ceil(this._size * this._sep)

    range = this._size / 2

    ctx.save()
    ctx.fillStyle = this.color
    ctx.beginPath()
    for (i = 0; i < dotNum; i++) {
      for (j = 0; j < stepNum; j++) {
        p = this._latest.add(v.multiply(j))
        r = getRandom(range)
        c = getRandom(Math.PI * 2)
        w = getRandom(dotSize, dotSize / 2)
        h = getRandom(dotSize, dotSize / 2)
        x = p.x + r * Math.sin(c) - w / 2
        y = p.y + r * Math.cos(c) - h / 2
        ctx.rect(x, y, w, h)
      }
    }
    ctx.fill()
    ctx.restore()
    this._drawn = true
  },

  _render() {},

})

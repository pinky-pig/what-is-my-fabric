/* eslint-disable eqeqeq */
import 'pathseg'
export const translateRegExp = /translate\((.*)[\s\,\s](.*)\)\s*/

export function getTranslateFromString(str: string) {
  const translate = str.replace(/\s+/g, '')
    .match(translateRegExp)
  if (translate)
    return [translate[1], translate[2]]
  else
    return [0, 0]
}

export function getTransformList(elem: any) {
  if (elem.transform)
    return elem.transform.baseVal

  else if (elem.gradientTransform)
    return elem.gradientTransform.baseVal

  else if (elem.patternTransform)
    return elem.patternTransform.baseVal

  return null
}

export function transformPoint(x, y, m) {
  return { x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f }
}
export function matrixMultiply(...arg: any[]) {
  const args = arg
  const NEAR_ZERO = 1e-14
  let i = args.length; let m = args[i - 1]
  while (i-- > 1) {
    const m1 = args[i - 1]
    m = m1.multiply(m)
  }
  if (Math.abs(m.a) < NEAR_ZERO)
    m.a = 0
  if (Math.abs(m.b) < NEAR_ZERO)
    m.b = 0
  if (Math.abs(m.c) < NEAR_ZERO)
    m.c = 0
  if (Math.abs(m.d) < NEAR_ZERO)
    m.d = 0
  if (Math.abs(m.e) < NEAR_ZERO)
    m.e = 0
  if (Math.abs(m.f) < NEAR_ZERO)
    m.f = 0

  return m
}
const pathMap = [0, 'z', 'M', 'm', 'L', 'l', 'C', 'c', 'Q', 'q', 'A', 'a',
  'H', 'h', 'V', 'v', 'S', 's', 'T', 't']
export function transformListToTransform(tlist, mi?: any, ma?: any) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  if (tlist === null) {
    // Or should tlist = null have been prevented before this?
    return svg.createSVGTransformFromMatrix(svg.createSVGMatrix())
  }
  let min = mi === undefined ? 0 : mi
  let max = ma === undefined ? (tlist.numberOfItems - 1) : ma
  min = parseInt(min)
  max = parseInt(max)
  if (min > max) { const temp = max; max = min; min = temp }
  let m = svg.createSVGMatrix()
  for (let i = min; i <= max; ++i) {
    // if our indices are out of range, just use a harmless identity matrix
    const mtom = (i >= 0 && i < tlist.numberOfItems
      ? tlist.getItem(i).matrix
      : svg.createSVGMatrix())
    m = matrixMultiply(m, mtom)
  }
  return svg.createSVGTransformFromMatrix(m)
}
const svgRoot = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

export function recalculateDimensions(selected: SVGPathElement) {
  // 主要是为了获取transform的矩阵
  let m = svgRoot.createSVGMatrix()
  const tlist = getTransformList(selected)
  const N = tlist.numberOfItems
  if ((N === 1 || (N > 1 && tlist.getItem(1).type !== 3)) && tlist.getItem(0).type === 2) {
    const oldXLate = tlist.getItem(0).matrix
    const meq = transformListToTransform(tlist, 1).matrix
    const meq_inv = meq.inverse()
    m = matrixMultiply(meq_inv, oldXLate, meq)
    tlist.removeItem(0)
  }
  // 如果是平移或者缩放，需要重新计算
  return remapPath(selected, { d: selected.getAttribute('d') }, m)
}

export function remapPath(selected: any, changes: any, m: any) {
  const remap = (x, y) => transformPoint(x, y, m)
  const scaleW = w => m.a * w
  const scaleH = h => m.d * h
  const segList = selected.pathSegList
  const len = segList.numberOfItems
  changes.d = new Array(len)
  for (let i = 0; i < len; ++i) {
    const seg = segList.getItem(i)
    changes.d[i] = {
      type: seg.pathSegType,
      x: seg.x,
      y: seg.y,
      x1: seg.x1,
      y1: seg.y1,
      x2: seg.x2,
      y2: seg.y2,
      r1: seg.r1,
      r2: seg.r2,
      angle: seg.angle,
      largeArcFlag: seg.largeArcFlag,
      sweepFlag: seg.sweepFlag,
    }
  }
  const firstSeg = changes.d[0]
  const currentPt = remap(firstSeg.x, firstSeg.y)
  changes.d[0].x = currentPt.x
  changes.d[0].y = currentPt.y
  for (let i = 1; i < len; ++i) {
    const seg = changes.d[i]
    const type = seg.type
    // if absolute or first segment, we want to remap x, y, x1, y1, x2, y2
    // if relative, we want to scaleW, scaleH
    if (type % 2 == 0) { // absolute
      const thisx = (seg.x != undefined) ? seg.x : currentPt.x // for V commands
      const thisy = (seg.y != undefined) ? seg.y : currentPt.y // for H commands
      const pt = remap(thisx, thisy)
      const pt1 = remap(seg.x1, seg.y1)
      const pt2 = remap(seg.x2, seg.y2)
      seg.x = pt.x
      seg.y = pt.y
      seg.x1 = pt1.x
      seg.y1 = pt1.y
      seg.x2 = pt2.x
      seg.y2 = pt2.y
      seg.r1 = scaleW(seg.r1)
      seg.r2 = scaleH(seg.r2)
    }
    else { // relative
      seg.x = scaleW(seg.x)
      seg.y = scaleH(seg.y)
      seg.x1 = scaleW(seg.x1)
      seg.y1 = scaleH(seg.y1)
      seg.x2 = scaleW(seg.x2)
      seg.y2 = scaleH(seg.y2)
      seg.r1 = scaleW(seg.r1)
      seg.r2 = scaleH(seg.r2)
    }
  } // for each segment

  let dStr = ''
  for (let i = 0; i < len; ++i) {
    const seg = changes.d[i]
    const type = seg.type
    dStr += pathMap[type]
    switch (type) {
      case 13: // relative horizontal line (h)
      case 12: // absolute horizontal line (H)
        dStr += `${seg.x} `
        break
      case 15: // relative vertical line (v)
      case 14: // absolute vertical line (V)
        dStr += `${seg.y} `
        break
      case 3: // relative move (m)
      case 5: // relative line (l)
      case 19: // relative smooth quad (t)
      case 2: // absolute move (M)
      case 4: // absolute line (L)
      case 18: // absolute smooth quad (T)
        dStr += `${seg.x},${seg.y} `
        break
      case 7: // relative cubic (c)
      case 6: // absolute cubic (C)
        dStr += `${seg.x1},${seg.y1} ${seg.x2},${seg.y2} ${
               seg.x},${seg.y} `
        break
      case 9: // relative quad (q)
      case 8: // absolute quad (Q)
        dStr += `${seg.x1},${seg.y1} ${seg.x},${seg.y} `
        break
      case 11: // relative elliptical arc (a)
      case 10: // absolute elliptical arc (A)
        dStr += `${seg.r1},${seg.r2} ${seg.angle} ${+seg.largeArcFlag
              } ${+seg.sweepFlag} ${seg.x},${seg.y} `
        break
      case 17: // relative smooth cubic (s)
      case 16: // absolute smooth cubic (S)
        dStr += `${seg.x2},${seg.y2} ${seg.x},${seg.y} `
    }
  }

  return dStr
}

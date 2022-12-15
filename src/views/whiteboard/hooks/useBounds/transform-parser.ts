import 'pathseg'
import { remapPath } from './path-coords'

export function getMatrixFromString(str: string): string[] | null {
  const reg = /(^|\s)matrix\([^\)]*\)/g
  return str.match(reg)
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

export function getRotationAngle(elem, to_rad?: number) {
  const selected = elem
  // find the rotation transform (if any) and set it
  const tlist = getTransformList(selected)
  if (!tlist)
    return 0 // <svg> elements have no tlist
  const N = tlist.numberOfItems
  for (let i = 0; i < N; ++i) {
    const xform = tlist.getItem(i)
    if (xform.type === 4)
      return to_rad ? xform.angle * Math.PI / 180.0 : xform.angle
  }
  return 0.0
}

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
// 画布的变形。本项目没有transform，所以一直都是 1 0 0 1 0 0
const svgRoot = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
export function recalculateDimensions(selected: SVGPathElement) {
  // 1.获取默认矩阵
  let m = svgRoot.createSVGMatrix()
  // 2.获取变形的数组
  const tlist = getTransformList(selected)
  const N = tlist.numberOfItems
  // 3.将transform - scale 转成矩阵 （因为scale和rotate都需要设置 transfrom-origin ，所以多设置两个矩阵平移）
  if (N >= 3 && tlist.getItem(N - 2).type === 3 && tlist.getItem(N - 3).type === 2 && tlist.getItem(N - 1).type === 2) {
    m = transformListToTransform(tlist, N - 3, N - 1).matrix
    tlist.removeItem(N - 1)
    tlist.removeItem(N - 2)
    tlist.removeItem(N - 3)
  }
  // 4.将transform - rotate 转成矩阵（因为scale和rotate都需要设置 transfrom-origin ，所以多设置两个矩阵平移）
  // 修正： 设置rotate的时候，不再重新计算坐标，因为对rotate的控制点不好控制，直接设置transform属性，之后的操作相当于都是对正方向的要素进行操作，
  // 最后设置 rotate()
  else if (N === 1 && tlist.getItem(0).type === 4 ) {
    m = transformListToTransform(tlist).matrix
  }
  // 5.将transform - translate 转成矩阵
  else if ((N === 1 || (N > 1 && tlist.getItem(1).type !== 3)) && tlist.getItem(0).type === 2) {
    const oldXLate = tlist.getItem(0).matrix
    const meq = transformListToTransform(tlist, 1).matrix
    const meq_inv = meq.inverse()
    m = matrixMultiply(meq_inv, oldXLate, meq)
    tlist.removeItem(0)
  }

  // 6.将要变换的要素及其变化后的要素的矩阵传入生成新的路径
  return remapPath(selected as SVGPathElement & { pathSegList: any }, m)
}

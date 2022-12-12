/* eslint-disable eqeqeq */
export function transformPoint(x, y, m) {
  return { x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f }
}
const pathMap = [0, 'z', 'M', 'm', 'L', 'l', 'C', 'c', 'Q', 'q', 'A', 'a',
  'H', 'h', 'V', 'v', 'S', 's', 'T', 't']
export function remapPath(selected: SVGPathElement & { pathSegList: any }, m: any) {
  const remap = (x, y) => transformPoint(x, y, m)
  const scaleW = w => m.a * w
  const scaleH = h => m.d * h
  // 1.获取path的点位。e.g. 有7个点，获取到的numberOfItems也是7
  const segList = selected.pathSegList
  const len = segList.numberOfItems
  // 2.初始化长度的数组
  const changes = {
    d: new Array(len),
  }
  // changes.d = new Array(len)
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
        dStr += `${seg.x1},${seg.y1} ${seg.x2},${seg.y2} ${seg.x},${seg.y} `
        break
      case 9: // relative quad (q)
      case 8: // absolute quad (Q)
        dStr += `${seg.x1},${seg.y1} ${seg.x},${seg.y} `
        break
      case 11: // relative elliptical arc (a)
      case 10: // absolute elliptical arc (A)
        dStr += `${seg.r1},${seg.r2} ${seg.angle} ${+seg.largeArcFlag} ${+seg.sweepFlag} ${seg.x},${seg.y} `
        break
      case 17: // relative smooth cubic (s)
      case 16: // absolute smooth cubic (S)
        dStr += `${seg.x2},${seg.y2} ${seg.x},${seg.y} `
    }
  }

  return dStr
}

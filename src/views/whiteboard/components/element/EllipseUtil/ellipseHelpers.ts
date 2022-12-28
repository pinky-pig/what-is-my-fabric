//  A rx ry x-axis-rotation large-arc-flag sweep-flag x y
//  a rx ry x-axis-rotation large-arc-flag sweep-flag dx dy
// x-axis-rotation 角度制
// large-arc-flag - 0:小弧 1:大弧
// sweep-flag - 0:逆时针 1:顺时针
// https://pomax.github.io/bezierinfo/#circles_cubic

import { path2Rough } from '../path2Rough'

export function getEllipseDefaultPath(mouseFromPoint: number[], mouseToPoint: number[]) {
  // const rx = (mouseToPoint[0] - mouseFromPoint[0]) / 2
  // const ry = (mouseToPoint[1] - mouseFromPoint[1]) / 2
  // const cx = mouseFromPoint[0] + rx
  // const cy = mouseFromPoint[1] + ry

  // const path = `M ${cx - rx} ${cy}
  //    a ${rx} ${ry} 0 1 0 ${2 * rx} 0
  //    a ${rx} ${ry} 0 1 0 ${-2 * rx} 0
  //    z`

  // 使用二次贝塞尔曲线重构圆 http://jsfiddle.net/nwHm6/
  //     __
  //   /    \
  //  |      |
  //   \    /
  //    -——-
  // 四条曲线，一条是四分之一弧。条数越多，越精确
  const rx = (mouseToPoint[0] - mouseFromPoint[0]) / 2
  const ry = (mouseToPoint[1] - mouseFromPoint[1]) / 2
  const path = `
    M ${mouseFromPoint[0]} ${mouseFromPoint[1] + ry}
    C ${mouseFromPoint[0]} ${mouseFromPoint[1] + ry / 2} ${mouseFromPoint[0] + rx / 2} ${mouseFromPoint[1]} ${mouseFromPoint[0] + rx} ${mouseFromPoint[1]}
    M ${mouseToPoint[0] - rx} ${mouseFromPoint[1]}
    C ${mouseToPoint[0] - rx / 2} ${mouseFromPoint[1]} ${mouseToPoint[0]} ${mouseToPoint[1] - ry - ry / 2} ${mouseToPoint[0]} ${mouseToPoint[1] - ry}
    M ${mouseToPoint[0]} ${mouseToPoint[1] - ry}
    C ${mouseToPoint[0]} ${mouseToPoint[1] - ry / 2} ${mouseToPoint[0] - rx / 2} ${mouseToPoint[1]} ${mouseToPoint[0] - rx} ${mouseToPoint[1]}
    M ${mouseToPoint[0] - rx} ${mouseToPoint[1]}
    C ${mouseFromPoint[0] + rx / 2} ${mouseToPoint[1]} ${mouseFromPoint[0]} ${mouseToPoint[1] - ry / 2} ${mouseFromPoint[0]} ${mouseFromPoint[1] + ry}
 `
  return path2Rough(path)
}


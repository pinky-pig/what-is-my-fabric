export function getEllipseDefaultPath(mouseFromPoint: number[], mouseToPoint: number[]) {
  const rx = (mouseToPoint[0] - mouseFromPoint[0]) / 2
  const ry = (mouseToPoint[1] - mouseFromPoint[1]) / 2
  const cx = mouseFromPoint[0] + rx
  const cy = mouseFromPoint[1] + ry

  const path = `M ${cx - rx} ${cy}
     a ${rx} ${ry} 0 1 0 ${2 * rx} 0
     a ${rx} ${ry} 0 1 0 ${-2 * rx} 0
     z`

  return path
}


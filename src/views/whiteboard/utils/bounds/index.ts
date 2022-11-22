/* eslint-disable @typescript-eslint/no-unused-vars */
export type Bounds = readonly [number, number, number, number]
export type FillStyle = 'hachure' | 'cross-hatch' | 'solid'
export type StrokeStyle = 'solid' | 'dashed' | 'dotted'
export type StrokeSharpness = 'round' | 'sharp'
export type FontString = string & { _brand: 'fontString' }
export type GroupId = string

export const rotate = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  angle: number,
): [number, number] =>
  [
    (x1 - x2) * Math.cos(angle) - (y1 - y2) * Math.sin(angle) + x2,
    (x1 - x2) * Math.sin(angle) + (y1 - y2) * Math.cos(angle) + y2,
  ]

export const distance2d = (x1: number, y1: number, x2: number, y2: number) => {
  const xd = x2 - x1
  const yd = y2 - y1
  return Math.hypot(xd, yd)
}

type _ExcalidrawElementBase = Readonly<{
  id: string
  x: number
  y: number
  type: string
  points: any[]
  strokeColor: string
  backgroundColor: string
  fillStyle: FillStyle
  strokeWidth: number
  strokeStyle: StrokeStyle
  strokeSharpness: StrokeSharpness
  roughness: number
  opacity: number
  width: number
  height: number
  angle: number
  seed: number
  version: number
  versionNonce: number
  isDeleted: boolean
  groupIds: readonly GroupId[]
  boundElements:
  | readonly Readonly<{
    id: string
    type: 'arrow' | 'text'
  }>[]
  | null
  updated: number
  link: string | null
  locked: boolean
  customData?: Record<string, any>
}>
export type ExcalidrawElement = _ExcalidrawElementBase

export const isFreeDrawElementType = (
  elementType: ExcalidrawElement['type'],
): boolean => {
  return elementType === 'freedraw'
}

export const isFreeDrawElement = (
  element?: ExcalidrawElement | null,
) => {
  return element != null && isFreeDrawElementType(element.type)
}

const getBoundsFromPoints = (
  points: ExcalidrawElement['points'],
): [number, number, number, number] => {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (const [x, y] of points) {
    minX = Math.min(minX, x)
    minY = Math.min(minY, y)
    maxX = Math.max(maxX, x)
    maxY = Math.max(maxY, y)
  }

  return [minX, minY, maxX, maxY]
}

const getFreeDrawElementAbsoluteCoords = (
  element: ExcalidrawElement,
): [number, number, number, number] => {
  const [minX, minY, maxX, maxY] = getBoundsFromPoints(element.points)

  return [
    minX + element.x,
    minY + element.y,
    maxX + element.x,
    maxY + element.y,
  ]
}

const getLinearElementAbsoluteCoords = (
  element: ExcalidrawElement,
): [number, number, number, number] => {
  let coords: [number, number, number, number] = [0, 0, 0, 0]

  if (element.points.length < 2) {
    // XXX this is just a poor estimate and not very useful
    const { minX, minY, maxX, maxY } = element.points.reduce(
      (limits, [x, y]) => {
        limits.minY = Math.min(limits.minY, y)
        limits.minX = Math.min(limits.minX, x)

        limits.maxX = Math.max(limits.maxX, x)
        limits.maxY = Math.max(limits.maxY, y)

        return limits
      },
      { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
    )
    coords = [
      minX + element.x,
      minY + element.y,
      maxX + element.x,
      maxY + element.y,
    ]
  }

  return coords
}

export const isLinearElementType = (elementType): boolean => {
  return (
    elementType === 'arrow' || elementType === 'line' // || elementType === "freedraw"
  )
}

export const isLinearElement = (
  element?: ExcalidrawElement | null,
) => {
  return element != null && isLinearElementType(element.type)
}

export const getElementAbsoluteCoords = (
  element: ExcalidrawElement,
): Bounds => {
  if (isFreeDrawElement(element))
    return getFreeDrawElementAbsoluteCoords(element)

  else if (isLinearElement(element))
    return getLinearElementAbsoluteCoords(element)

  return [
    element.x,
    element.y,
    element.x + element.width,
    element.y + element.height,
  ]
}

// We could cache this stuff
export const getElementBounds = (
  element: ExcalidrawElement,
): [number, number, number, number] => {
  let bounds: [number, number, number, number]

  const [x1, y1, x2, y2] = getElementAbsoluteCoords(element)
  const cx = (x1 + x2) / 2
  const cy = (y1 + y2) / 2
  if (isFreeDrawElement(element)) {
    const [minX, minY, maxX, maxY] = getBoundsFromPoints(
      element.points.map(([x, y]) =>
        rotate(x, y, cx - element.x, cy - element.y, element.angle),
      ),
    )

    return [
      minX + element.x,
      minY + element.y,
      maxX + element.x,
      maxY + element.y,
    ]
  }
  else {
    const [x11, y11] = rotate(x1, y1, cx, cy, element.angle)
    const [x12, y12] = rotate(x1, y2, cx, cy, element.angle)
    const [x22, y22] = rotate(x2, y2, cx, cy, element.angle)
    const [x21, y21] = rotate(x2, y1, cx, cy, element.angle)
    const minX = Math.min(x11, x12, x22, x21)
    const minY = Math.min(y11, y12, y22, y21)
    const maxX = Math.max(x11, x12, x22, x21)
    const maxY = Math.max(y11, y12, y22, y21)
    bounds = [minX, minY, maxX, maxY]
  }

  return bounds
}

export const getClosestElementBounds = (
  elements: any,
  from: { x: number; y: number },
): [number, number, number, number] => {
  if (!elements.length)
    return [0, 0, 0, 0]

  const minDistance = Infinity
  const closestElement = elements[0]

  elements.forEach((element) => {
    // const [x1, y1, x2, y2] = getElementBounds(element)
    const bbox = browserComputePathBoundingBox(element.path)
    // const distance = distance2d((x1 + x2) / 2, (y1 + y2) / 2, from.x, from.y)

    // if (distance < minDistance) {
    //   minDistance = distance
    //   closestElement = element
    // }
  })

  return getElementBounds(closestElement)
}

export function browserComputePathBoundingBox(path) {
  const svgNS = 'http://www.w3.org/2000/svg'
  const svgEl = document.createElementNS(svgNS, 'svg')
  svgEl.style.position = 'absolute'
  svgEl.style.width = '0px'
  svgEl.style.height = '0px'
  const pathEl = document.createElementNS(svgNS, 'path')
  pathEl.setAttributeNS(null, 'd', path)
  svgEl.appendChild(pathEl)
  document.body.appendChild(svgEl)
  const result = pathEl.getBBox()
  svgEl.remove()
  return result
}

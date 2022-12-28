import rough from 'roughjs'
import { withCustomMathRandom } from '~/views/utils/random'
const svgNS = 'http://www.w3.org/2000/svg'
const svgEl = document.createElementNS(svgNS, 'svg')
const rc = rough.svg(svgEl)
const generator = rc.generator

const createPath = (path: any, style: any) => {
  return generator.path(path, style)
}
const generateShape = (path: any, style: any) =>
  withCustomMathRandom(746071638, () => {
    return createPath(path, {
      stroke: 'rgba(0, 0, 0, 0)',
      roughness: 2,
      ...style,
    })
  })

export const path2Rough = (path: any, style = {
  stroke: 'black',
  strokeWidth: 2,
}) => {
  return generator.toPaths(generateShape(path, style))[0].d
}

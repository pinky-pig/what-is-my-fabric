import type { ShapeStyles, Theme } from '~/views/whiteboard/types'
import { ColorStyle, DashStyle, SizeStyle } from '~/views/whiteboard/types'
import { lerpColor } from '~/views/whiteboard/utils'

const canvasLight = '#fafafa'

const canvasDark = '#343d45'

const colors = {
  [ColorStyle.White]: '#f0f1f3',
  [ColorStyle.LightGray]: '#c6cbd1',
  [ColorStyle.Gray]: '#788492',
  [ColorStyle.Black]: '#1d1d1d',
  [ColorStyle.Green]: '#36b24d',
  [ColorStyle.Cyan]: '#0e98ad',
  [ColorStyle.Blue]: '#1c7ed6',
  [ColorStyle.Indigo]: '#4263eb',
  [ColorStyle.Violet]: '#7746f1',
  [ColorStyle.Red]: '#ff2133',
  [ColorStyle.Orange]: '#ff9433',
  [ColorStyle.Yellow]: '#ffc936',
}

export const strokes = {
  light: {
    ...colors,
    [ColorStyle.White]: '#1d1d1d',
  },
  dark: {
    ...(Object.fromEntries(
      Object.entries(colors).map(([k, v]) => [k, lerpColor(v, canvasDark, 0.1)]),
    ) as Record<ColorStyle, string>),
    [ColorStyle.White]: '#cecece',
    [ColorStyle.Black]: '#cecece',
  },
}

export const fills = {
  light: {
    ...(Object.fromEntries(
      Object.entries(colors).map(([k, v]) => [k, lerpColor(v, canvasLight, 0.82)]),
    ) as Record<ColorStyle, string>),
    [ColorStyle.White]: '#fefefe',
  },
  dark: {
    ...(Object.fromEntries(
      Object.entries(colors).map(([k, v]) => [k, lerpColor(v, canvasDark, 0.82)]),
    ) as Record<ColorStyle, string>),
    [ColorStyle.White]: 'rgb(30,33,37)',
    [ColorStyle.Black]: '#1e1e1f',
  },
}

const strokeWidths = {
  [SizeStyle.Small]: 2,
  [SizeStyle.Medium]: 3.5,
  [SizeStyle.Large]: 5,
}

export function getStrokeWidth(size: SizeStyle): number {
  return strokeWidths[size]
}

export function getShapeStyle(
  style: ShapeStyles,
  isDarkMode?: boolean,
): {
    stroke: string
    fill: string
    strokeWidth: number
  } {
  const { color, size, isFilled } = style

  const strokeWidth = getStrokeWidth(size)

  const theme: Theme = isDarkMode ? 'dark' : 'light'

  return {
    stroke: strokes[theme][color],
    fill: isFilled ? fills[theme][color] : 'none',
    strokeWidth,
  }
}

export const defaultStyle: ShapeStyles = {
  color: ColorStyle.Black,
  size: SizeStyle.Small,
  isFilled: false,
  dash: DashStyle.Draw,
  scale: 1,
}

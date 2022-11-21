export const lerpColor = (color1: string, color2: string, factor = 0.5): string => {
  function h2r(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)!
    return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
  }

  function r2h(rgb: number[]) {
    return `#${((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1)}`
  }

  const c1 = h2r(color1) || [0, 0, 0]
  const c2 = h2r(color2) || [0, 0, 0]

  const result = c1.slice()

  for (let i = 0; i < 3; i++)
    result[i] = Math.round(result[i] + factor * (c2[i] - c1[i]))

  return r2h(result)
}

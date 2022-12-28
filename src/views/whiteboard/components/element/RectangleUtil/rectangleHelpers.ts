import { path2Rough } from '../path2Rough'

export function getRectDefaultPath(mouseFromPoint: number[], mouseToPoint: number[]) {
  const path = `M ${mouseFromPoint[0]} ${mouseFromPoint[1]}
    L ${mouseToPoint[0]} ${mouseFromPoint[1]}
    L ${mouseToPoint[0]} ${mouseToPoint[1]}
    L ${mouseFromPoint[0]} ${mouseToPoint[1]}
    L ${mouseFromPoint[0]} ${mouseFromPoint[1]} z`

  return path2Rough(path)
}


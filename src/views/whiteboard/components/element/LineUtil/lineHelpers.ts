export function getLineDefaultPath(mouseFromPoint: number[], mouseToPoint: number[]) {
  const path = `M ${mouseFromPoint[0]} ${mouseFromPoint[1]}
    L ${mouseToPoint[0]} ${mouseToPoint[1]} z`
  return path
}


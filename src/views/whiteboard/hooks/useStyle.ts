const styles = new Map<string, HTMLStyleElement>()

export function useStyle(uid: string, rules: string) {
  if (styles.get(uid))
    return () => null

  const style = document.createElement('style')
  style.innerHTML = rules
  style.setAttribute('id', uid)
  document.head.appendChild(style)
  styles.set(uid, style)

  return () => {
    if (style && document.head.contains(style)) {
      document.head.removeChild(style)
      styles.delete(uid)
    }
  }
}

export const defaultTheme = {
  accent: 'rgb(255, 0, 0)',
  brushFill: 'rgba(0,0,0,.05)',
  brushStroke: 'rgba(0,0,0,.25)',
  brushDashStroke: 'rgba(0,0,0,.6)',
  selectStroke: 'rgb(66, 133, 244)',
  selectFill: 'rgba(65, 132, 244, 0.05)',
  binding: 'rgba(65, 132, 244, 0.12)',
  background: 'rgb(248, 249, 250)',
  foreground: 'rgb(51, 51, 51)',
  grid: 'rgba(144, 144, 144, 1)',
}

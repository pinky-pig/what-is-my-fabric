import type { IText } from 'fabric/fabric-impl'
import { Arrow } from '../modules/Arrow'
import { IFText } from '../modules/IFText'
import { Rect } from '../modules/Rect'
// import { Ellipse } from '../modules/Ellipse'
import { Ellipse } from '../modules/Ellipse'
import { Line } from '../modules/Line'
import useCanvas from './useCanvas'
import { useFabricStore } from '~/store/modules/fabric'

export const renderArrowPreview = () => {
  const fabricStore = useFabricStore()
  const temp = fabricStore.temp
  if (temp)
    temp.remove()
  const arrow = new Arrow([fabricStore.mouseFrom, fabricStore.mouseTo])
  arrow.render()
  fabricStore.temp = arrow
}

export const renderRectPreview = () => {
  const fabricStore = useFabricStore()
  const temp = fabricStore.temp
  if (temp)
    temp.remove()
  const arrow = new Rect([fabricStore.mouseFrom, fabricStore.mouseTo])
  arrow.render()

  fabricStore.temp = arrow
}

export const renderCirclePreview = () => {
  const fabricStore = useFabricStore()
  const temp = fabricStore.temp
  // if (temp)
  //   temp.update()

  if (temp)
    temp.remove()
  const circle = new Ellipse([fabricStore.mouseFrom, fabricStore.mouseTo])
  circle.render()
  fabricStore.temp = circle
}
export const renderLinePreview = () => {
  const fabricStore = useFabricStore()
  const temp = fabricStore.temp
  if (temp) { temp.update([fabricStore.mouseFrom, fabricStore.mouseTo]) }
  else {
    const line = new Line([fabricStore.mouseFrom, fabricStore.mouseTo])
    line.render()
    fabricStore.temp = line
  }
}

// 增加新的textbox之前，要判断上一个是否关闭编辑状态
export const exitRenderTextPreview = () => {
  const fabricStore = useFabricStore()
  const [canvas] = useCanvas()
  const l = canvas.getObjects() as IText[]
  l.forEach((i) => {
    if (i.type === 'textbox') {
      if (i.text === '')
        canvas.remove(i)
      i.exitEditing()
    }
  })
  fabricStore.isTexting = false
}

export const renderTextPreview = () => {
  const fabricStore = useFabricStore()

  exitRenderTextPreview()
  const Text = new IFText([fabricStore.mouseFrom, fabricStore.mouseTo])
  Text.render()
  fabricStore.isTexting = true
}

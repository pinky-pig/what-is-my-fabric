import type { IEvent, IText } from 'fabric/fabric-impl'
import { toggleSelection } from '../control/useCanvas'
import { exitRenderTextPreview, renderTextPreview } from '../control/useDraw'
import useKeyStoke from './useKeyStoke'
import { useFabricStore } from '~/store/modules/fabric'

/**
 * 鼠标左键按下有几种可能 [拖拽画布, 框选, 绘制]
 */

const [isPressedCtrl] = useKeyStoke()
export const useMouseDown = (evt: IEvent<MouseEvent>) => {
  const fabricStore = useFabricStore()

  // 按下ctrl和左键，拖拽画布
  if (evt.button === 1 && isPressedCtrl.value) {
    // 拖拽画布
    fabricStore.handleChangeIsCanvasDragging(true)
  }

  // 按下左键，设置 mouseFrom 的点
  if (fabricStore.mode !== 'Hand') {
    // 1.正常的需要拖拽绘制图形
    if (evt.button === 1) {
      fabricStore.handleChangeIsDrawing(true)
      if (evt.absolutePointer) {
        const { x, y } = evt.absolutePointer
        fabricStore.mouseFrom = { x, y }
      }
    }

    // 2.点击在文字上
    if (evt?.target?.type === 'textbox') {
      (evt.target as IText).enterEditing()
    }
    else {
      // 点击输入文字
      if (fabricStore.isTexting) {
        // 有已经输入的text，这里是退出输入
        exitRenderTextPreview()
      }
      else {
        if (evt.button === 1 && fabricStore.mode === 'Text')
          renderTextPreview()
      }
    }
  }

  // 右键
  if (evt.button === 3)
    toggleSelection(true)
}

import type { Object as TObject } from 'fabric/fabric-impl'
import { fabric } from 'fabric'
import useCanvas from '../control/useCanvas'
import { useFabricStore } from '~/store/modules/fabric'

export const keyListener = () => {
  // 这里目前只实现了新增对象的撤销
  const canUndo = (): boolean => {
    const [canvas] = useCanvas()
    return canvas._objects.length > 0
  }
  const undo = () => {
    const fabricStore = useFabricStore()
    const [canvas] = useCanvas()

    if (canUndo()) {
      fabricStore.redoHistory.push(canvas._objects.pop() as Object)
      canvas.renderAll()
    }
  }
  const canRedo = (): boolean => {
    const fabricStore = useFabricStore()
    return fabricStore.redoHistory.length > 0
  }
  const redo = () => {
    const fabricStore = useFabricStore()
    if (canRedo()) {
      const [canvas] = useCanvas()
      canvas.add(fabricStore.redoHistory.pop() as TObject)
    }
  }
  const deleteActiveObjects = () => {
    const [canvas] = useCanvas()

    canvas.getActiveObjects().forEach((item) => {
      canvas.remove(item)
      canvas.discardActiveObject()
    })
  }

  const setAllObjectsActive = () => {
    const [canvas] = useCanvas()
    canvas.discardActiveObject()
    const sel = new fabric.ActiveSelection(canvas.getObjects(), {
      canvas,
    })
    canvas.setActiveObject(sel)
    canvas.requestRenderAll()
  }

  let _clipboard: any = null
  const copy = () => {
    const [canvas] = useCanvas()
    canvas.getActiveObject().clone((cloned) => {
      _clipboard = cloned
    })
  }

  const paste = () => {
    const [canvas] = useCanvas()

    if (_clipboard) {
      _clipboard.clone((clonedObj) => {
        canvas.discardActiveObject()
        clonedObj.set({
          left: clonedObj.left + 10,
          top: clonedObj.top + 10,
          evented: true,
        })
        if (clonedObj.type === 'activeSelection') {
        // active selection needs a reference to the canvas.
          clonedObj.canvas = canvas
          clonedObj.forEachObject((obj) => {
            canvas.add(obj)
          })
          // this should solve the unselectability
          clonedObj.setCoords()
        }
        else {
          canvas.add(clonedObj)
        }
        _clipboard.top += 10
        _clipboard.left += 10
        canvas.setActiveObject(clonedObj)
        canvas.requestRenderAll()
      })
    }
  }

  return { undo, redo, deleteActiveObjects, setAllObjectsActive, copy, paste }
}

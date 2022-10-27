import type { Object as TObject } from 'fabric/fabric-impl'
import { fabric } from 'fabric'
import useCanvas from '../control/useCanvas'
import { useFabricStore } from '~/store/modules/fabric'

const { Ctrl, Space, Ctrl_Z, Ctrl_Y, Ctrl_A, Ctrl_C, Ctrl_V, Delete } = useMagicKeys()
const isPressedCtrl = ref(false)
const isPressedSpace = ref(false)

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
watch(Ctrl, (v) => {
  isPressedCtrl.value = v
})

watch(Space, (v) => {
  isPressedSpace.value = v
})
watch(Ctrl_Z, (v) => {
  if (v)
    undo()
})
watch(Ctrl_Y, (v) => {
  if (v)
    redo()
})
watch(Ctrl_A, (v) => {
  if (v) {
    // 按下Ctrl_A
    setAllObjectsActive()
  }
})
watch(Ctrl_C, (v) => {
  if (v) {
    // 按下Ctrl_C
    copy()
  }
})
watch(Ctrl_V, (v) => {
  if (v) {
    // 按下Ctrl_V
    paste()
  }
})
watch(Delete, (v) => {
  if (v)
    deleteActiveObjects()
})

export { isPressedCtrl, isPressedSpace }

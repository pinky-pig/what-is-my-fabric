import { keyListener } from './useTools'

const { Ctrl, Space, Ctrl_Z, Ctrl_Y, Ctrl_A, Ctrl_C, Ctrl_V, Delete } = useMagicKeys()
const isPressedCtrl = ref(false)
const isPressedSpace = ref(false)

const { undo, redo, deleteActiveObjects, setAllObjectsActive, copy, paste } = keyListener()

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
  if (v)
    setAllObjectsActive()
})
watch(Ctrl_C, (v) => {
  if (v)
    copy()
})
watch(Ctrl_V, (v) => {
  if (v)
    paste()
})
watch(Delete, (v) => {
  if (v)
    deleteActiveObjects()
})

export { isPressedCtrl, isPressedSpace }

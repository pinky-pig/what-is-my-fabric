import type { Ref } from 'vue'
import { useMutations } from '../control/useMutations'

const { Ctrl, Space, Ctrl_Z, Ctrl_Y, Ctrl_A, Ctrl_C, Ctrl_V, Delete } = useMagicKeys()
const isPressedCtrl = ref(false)
const isPressedSpace = ref(false)

export const useWatchKeyboard = () => {
  const { undo, redo, deleteActiveObjects, setAllObjectsActive, copy, paste } = useMutations()

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
}

export default (): [Ref<boolean>, Ref<boolean>, Function] => [isPressedCtrl, isPressedSpace, useWatchKeyboard]


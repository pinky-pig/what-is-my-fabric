const { Ctrl, Space } = useMagicKeys()
const isPressedCtrl = ref(false)
const isPressedSpace = ref(false)

watch(Ctrl, (v) => {
  isPressedCtrl.value = v
})

watch(Space, (v) => {
  isPressedSpace.value = v
})

export { isPressedCtrl, isPressedSpace }

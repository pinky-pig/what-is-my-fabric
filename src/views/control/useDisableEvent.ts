// import useCanvas from './useCanvas'
// import { useFabricStore } from '~/store/modules/fabric'

// let disabled = false

// const toggle = (status = false) => {
//   const fabricStore = useFabricStore()
//   const [canvas] = useCanvas()
//   disabled = status || !disabled
//   fabricStore.objects.forEach(object => object.update())
//   canvas.selection = !status
//   canvas.discardActiveObject()
// }

// export default (): [boolean, typeof toggle] => [disabled, toggle]

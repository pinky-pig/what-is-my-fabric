import { Arrow } from '../modules/Arrow'
import { useFabricStore } from '~/store/modules/fabric'

export const renderArrowPreview = () => {
  const fabricStore = useFabricStore()
  // 先删除上一个
  const temp = fabricStore.temp
  if (temp)
    temp.remove()

  // 再添加当前这个
  const arrow = new Arrow([fabricStore.mouseFrom, fabricStore.mouseTo])
  arrow.render()
  fabricStore.temp = arrow
}


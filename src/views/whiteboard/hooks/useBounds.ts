import { storeToRefs } from 'pinia'
// import { Rectangle } from '../components/element'
// import { generateUuid } from '../utils'
import type { Ref } from 'vue'
import { browserComputePathBoundingBox } from '../utils/bounds'
import { generateUuid } from '../utils'
import { useSvgStore } from '~/store/modules/svg'

/**
 * 1. 绘制框选预选框
 * 2. 鼠标move的时候重绘预选框
 * 3. move的时候计算预选框的范围
 * 4. move的时候遍历每个element，计算坐标
 * 5. 如果在范围内，将其属性isSelect设置为true
 * 6. 当要素被选中的时候，给其增加选框
 * 7. 只选择一个的时候，可以放大缩小旋转等。
 * 8. 选中多个的时候，只能移动位置
 */
export interface ElementBound {
  id: string
  elementId: string
  bounds: {
    x: number
    y: number
    width: number
    height: number
  }
}
export function useBoundsBox(selectedBounds: Ref<ElementBound[]>) {
  const store = useSvgStore()
  const { svgWrapperRef, elements } = storeToRefs(store)

  watch(() => elements, () => {
    elements.value.forEach((element) => {
      if (element.isSelected) {
        selectedBounds.value?.push({
          id: generateUuid(),
          elementId: element.id,
          bounds: browserComputePathBoundingBox(element?.path),
        })
      }
    })
  }, {
    deep: true,
  })

  function handlePointerDown() {

  }
  function handlePointerMove() {
  }
  function handlePointerUp() {
  }

  // 监听鼠标滚轮事件
  useEventListener(svgWrapperRef, 'pointerdown', handlePointerDown)
  useEventListener(svgWrapperRef, 'pointermove', handlePointerMove)
  useEventListener(svgWrapperRef, 'pointerup', handlePointerUp)
}


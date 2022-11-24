import { storeToRefs } from 'pinia'
// import { Rectangle } from '../components/element'
// import { generateUuid } from '../utils'
import type { CurrentElementType } from '~/store/modules/svg'
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
export function useBoundsBox() {
  const store = useSvgStore()
  const { svgWrapperRef, elements } = storeToRefs(store)

  function handlePointerDown() {
    elements.value.forEach((element: CurrentElementType) => {
      element.isSelected = true
    })
    elements.value.forEach((element: CurrentElementType) => {
      if (element.isSelected) {
        // const { x, y, width, height } = browserComputePathBoundingBox(element.path)
        // bounds.value = { x, y, width, height }
        // elements.value.push({
        //   id: generateUuid(),
        //   type: 'FreeDraw',
        //   path: Rectangle.getSvgElement([x, y], [x + width, y + height], false).path,
        //   style: { fill: 'none', stroke: 'black', strokeWidth: 2 },
        //   isSelected: false,
        // })
      }
    })
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


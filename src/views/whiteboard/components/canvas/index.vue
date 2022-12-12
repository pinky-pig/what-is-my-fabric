<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useKeyEvents } from '../../hooks/useKeyEvents'
import { useZoomEvents } from '../../hooks/useZoomEvents'
import { useResizeObserver } from '../../hooks/useResizeObserver'
import { useCanvasEvents } from '../../hooks/useCanvasEvents'
import type { ElementBound } from '../../hooks/useBounds'
import { useBoundsBox } from '../../hooks/useBounds'
import Bounds from '../bounds/index.vue'
import type { CurrentElementType } from '~/store/modules/svg'
import { useSvgStore } from '~/store/modules/svg'
// 全局状态 pinia
const store = useSvgStore()
// 设置画布的Dom
const { svgWrapperRef, svgCanvasRef } = storeToRefs(store)
// 设置画布的尺寸，缩放比例，自由绘制的点的集合（当前正在绘制的要素），所有的已添加的要素
const { cfg, viewPortZoom, elements } = storeToRefs(store)
// 监听键盘按键
useKeyEvents()

// 监听画布缩放
useZoomEvents(cfg, svgWrapperRef, viewPortZoom)
// 监听窗口尺寸改变
useResizeObserver(cfg, svgWrapperRef, viewPortZoom)
// 监听画布触发事件（包括拖拽画布）
const currentDrawingElement = ref<CurrentElementType>()
useCanvasEvents(currentDrawingElement)
// 框选的预选框
const previewContainerBoxElement = ref<CurrentElementType>()
// 如要要素多个，生成一个大范围的
const selectedAllBoxElement = ref<CurrentElementType>()
// 实际的每个要素选框
const selectedBounds = ref<ElementBound[]>([])
useBoundsBox(selectedBounds, previewContainerBoxElement, selectedAllBoxElement)
</script>

<template>
  <div id="svgWrapperRef" ref="svgWrapperRef" class=" w-screen h-screen rounded-md overflow-hidden">
    <svg
      id="svgCanvasRef"
      ref="svgCanvasRef"
      :viewBox="`${cfg.viewPortX} ${cfg.viewPortY} ${cfg.viewPortWidth} ${cfg.viewPortHeight}`"
      class="w-full h-full"
    >
      <!-- 当前绘制的要素 -->
      <g v-if="currentDrawingElement">
        <path
          :id="currentDrawingElement?.id"
          :d="currentDrawingElement?.path"
          :stroke="currentDrawingElement?.style.stroke"
          :fill="currentDrawingElement?.style.fill"
          :strokeWidth="currentDrawingElement?.style.strokeWidth"
        />
      </g>
      <!-- 已经绘制的要素 -->
      <g v-for="element in elements" :key="element.id">
        <path
          :id="element?.id"
          :d="element.path"
          :stroke="element?.style.stroke"
          :fill="element?.style.fill"
          :strokeWidth="element?.style.strokeWidth"
          :transform="element.matrix"
          vector-effect="non-scaling-stroke"
        />
      </g>
      <!-- 当前的文字要素 -->
      <!-- <foreignObject x="10" y="100" overflow="visible" width="100" height="100">
        <p
          contentEditable="true"
          style="
            display:table-cell;
            padding:10px;
            border:1px solid red;
            background-color:white;
            opacity:0.5;
            font-family:Verdana;
            font-size:20px;
            white-space: pre;
            word-wrap: normal;
            overflow: visible;
            overflow-y: visible;
            overflow-x:visible;"
        >
          Write here some text.
        </p>
      </foreignObject> -->
      <!-- 框选预选框 -->
      <g v-if="previewContainerBoxElement">
        <path
          :id="previewContainerBoxElement?.id"
          :d="previewContainerBoxElement?.path"
          :stroke="previewContainerBoxElement?.style.stroke"
          :fill="previewContainerBoxElement?.style.fill"
          :strokeWidth="previewContainerBoxElement?.style.strokeWidth"
        />
      </g>
      <!-- 多选要素的框 -->
      <g v-if="selectedAllBoxElement">
        <path
          :id="selectedAllBoxElement?.id"
          :d="selectedAllBoxElement?.path"
          :stroke="selectedAllBoxElement?.style.stroke"
          :fill="selectedAllBoxElement?.style.fill"
          :strokeWidth="selectedAllBoxElement?.style.strokeWidth"
        />
      </g>
      <!-- 实际选择框 -->
      <template v-for="(item) in selectedBounds" :key="item.id">
        <Bounds :element-bound="item" />
      </template>

      <!-- <path id="svg_12" fill="#0fffff" stroke-dasharray="5,5" d="M440.6048125429633,151.34998328481402 L440.6048125429633,151.34998328481402 C440.6048125429633,97.74027600856368 515.7628631288453,54.2810123868494 608.4749975643101,54.2810123868494 L608.4749975643101,54.2810123868494 C652.9969196470818,54.2810123868494 695.6953771945861,64.50788645524943 727.1771207719861,82.71184946386666 C758.6588981487578,100.91581898718215 776.3451825856582,125.60568307275253 776.3451825856582,151.34998328481402 L776.3451825856582,151.34998328481402 C776.3451825856582,204.95968404636682 701.1871319997772,248.41895418277716 608.4749975643101,248.41895418277716 L608.4749975643101,248.41895418277716 C515.7628743953003,248.41895418277716 440.6048125429633,204.95968404636682 440.6048125429633,151.34998328481402 zM524.5399050536353,151.34998328481402 L524.5399050536353,151.34998328481402 C524.5399050536353,178.15483040823915 562.1189528794876,199.88446873379542 608.4749975643101,199.88446873379542 C654.8310760485017,199.88446873379542 692.4100900749863,178.15483040823915 692.4100900749863,151.34998328481402 C692.4100900749863,124.54513616138536 654.8310535155873,102.81549783583216 608.4749975643101,102.81549783583216 L608.4749975643101,102.81549783583216 C562.1189528794876,102.81549783583216 524.5399050536353,124.54514267607925 524.5399050536353,151.34998328481402 z" stroke="#000" />
      <path id="svg_13" fill="#0fffff" stroke="#000" stroke-dasharray="5,5" d="M489.7728610746177,32.64785932167854 L489.7728610746177,32.64785932167854 C527.6806486270801,-5.259928230783885 611.5557558694068,17.15449898696687 677.1131348270028,82.7118779445629 L677.1131348270028,82.7118779445629 C708.5948878431898,114.19363096074983 731.5557647171295,151.6174918429025 740.9445733964228,186.75059189792046 C750.3334013688936,221.88372045929066 745.381122706739,251.84818244009796 727.177153449888,270.05215169694895 L727.177153449888,270.05215169694895 C689.2693705040124,307.95993464282446 605.3942586551007,285.54551203166034 539.836879697503,219.98813307406272 L539.836879697503,219.98813307406272 C474.27950870649374,154.43076208305342 451.8650781287421,70.55564226755416 489.7728610746177,32.64785932167854 zM549.1239341684341,91.99893241549489 L549.1239341684341,91.99893241549489 C530.1700449987914,110.95282158513754 541.3772699342533,152.89039574606318 574.1559434798779,185.66906929168783 C606.9346409252655,218.44776673707554 648.8721911864292,229.6549677727753 667.8260803560718,210.70107860313271 C686.779969525717,191.7471894334875 675.5727525568384,149.80962323914946 642.7940710446273,117.03094172693841 L642.7940710446273,117.03094172693841 C610.0153974990027,84.25226818131375 568.077818731495,73.04504785243398 549.1239341684341,91.99893241549489 z" />

      <path id="svg_14" d="M 483 648 a 115 74 0 1 0 230 0 a 115 74 0 1 0 -230 0 z" stroke="#1c7ed6" fill="none" strokeWidth="2" vector-effect="non-scaling-stroke" /> -->
    </svg>
  </div>
</template>

<style lang="less" scoped>

</style>

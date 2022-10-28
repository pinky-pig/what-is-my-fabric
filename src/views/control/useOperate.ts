import { fabric } from 'fabric'
import useCanvas from './useCanvas'

/**
 * 系统的操作
 * 1. 导入图片
 * 2. 导出图片
 */
export const setBackground = () => {
  const [canvas] = useCanvas()

  // 设置背景图片
  fabric.Image.fromURL('https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.sj456.cn%2Fuploadfile%2F2015%2F0915%2F20150915151423_82523.jpg&refer=http%3A%2F%2Fwww.sj456.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1669279685&t=336908e6ab263840da7d180324c57406', (images) => {
    if (images?.width && images?.height) {
      images.scaleX = 800 / images.width
      images.scaleY = 750 / images.height
      if (canvas) {
        canvas.setBackgroundImage(images, () => {})
        canvas.renderAll()
      }
    }
  }, { crossOrigin: 'anonymous' })
}

// 导出编辑后的图片
export const exportImage = () => {
  const [canvas] = useCanvas()
  const dataURL = canvas.toDataURL({
    width: canvas.width,
    height: canvas.height,
    left: 0,
    top: 0,
    format: 'png',
  })
  const link = document.createElement('a')
  link.download = 'canvas.png'
  link.href = dataURL
  link.click()
}

// 预览编辑后的图片
export const previewImage = () => {
  const [canvas] = useCanvas()
  const dataURL = canvas.toDataURL({
    width: canvas.width,
    height: canvas.height,
    left: 0,
    top: 0,
    format: 'png',
  })

  const w = window.open('about:blank', 'image from canvas') as Window
  w.document.write(`<img src='${dataURL}' alt='from canvas'/>`)
}


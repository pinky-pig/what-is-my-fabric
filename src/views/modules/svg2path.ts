/**
 * @param  node  需要转换路径的SVG元素节点
 * @returns String path路径字符串
 */
export function svg2path(node) {
  // 匹配路径中数值的正则
  const regNumber = /[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g

  if (!node.tagName)
    return
  const tagName = String(node.tagName).toLowerCase()

  let path: any = null

  switch (tagName) {
    case 'path':
      path = node.getAttribute('d')
      break
    case 'rect':{
      const x = Number(node.getAttribute('x'))
      const y = Number(node.getAttribute('y'))
      const width = Number(node.getAttribute('width'))
      const height = Number(node.getAttribute('height'))
      /*
       * rx 和 ry 的规则是：
       * 1. 如果其中一个设置为 0 则圆角不生效
       * 2. 如果有一个没有设置则取值为另一个
       * 3.rx 的最大值为 width 的一半, ry 的最大值为 height 的一半
       */
      let rx = Number(node.getAttribute('rx')) || Number(node.getAttribute('ry')) || 0
      let ry = Number(node.getAttribute('ry')) || Number(node.getAttribute('rx')) || 0

      // 非数值单位计算，如当宽度像100%则移除
      // if (isNaN(x - y + width - height + rx - ry)) return;

      rx = rx > width / 2 ? width / 2 : rx
      ry = ry > height / 2 ? height / 2 : ry

      // 如果其中一个设置为 0 则圆角不生效
      if (rx === 0 || ry === 0) {
        path = `M${x} ${y} h ${width} v ${height} h ${-width}z`
      }
      else {
        path
          = `M ${x} ${y + ry}
          a ${rx} ${ry} 0 0 1 ${rx} ${-ry}
          h ${width - rx - rx}
          a ${rx} ${ry} 0 0 1 ${rx} ${ry}
          v ${height - ry - ry}
          a ${rx} ${ry} 0 0 1 ${-rx} ${ry}
          h ${rx + rx - width}
          a ${rx} ${ry} 0 0 1 ${-rx} ${-ry}
          z`
      }

      break
    }

    case 'circle':{
      const cx = node.getAttribute('cx')
      const cy = node.getAttribute('cy')
      const r = node.getAttribute('r')
      path
        = `M ${cx - r} ${cy}
        a ${r} ${r} 0 1 0 ${2 * r} 0
        a ${r} ${r} 0 1 0 ${-2 * r} 0
        z`

      break
    }

    case 'ellipse':{
      const cx = node.getAttribute('cx') * 1
      const cy = node.getAttribute('cy') * 1
      const rx = node.getAttribute('rx') * 1
      const ry = node.getAttribute('ry') * 1

      if (isNaN(cx - cy + rx - ry))
        return
      path
        = `M ${cx - rx} ${cy}
        a ${rx} ${ry} 0 1 0 ${2 * rx} 0
        a ${rx} ${ry} 0 1 0 ${-2 * rx} 0
        z`

      break
    }

    case 'line':{
      const x1 = node.getAttribute('x1')
      const y1 = node.getAttribute('y1')
      const x2 = node.getAttribute('x2')
      const y2 = node.getAttribute('y2')
      if (isNaN(x1 - y1 + (x2 - y2)))
        return

      path = `M${x1} ${y1}L${x2} ${y2}`

      break
    }

    case 'polygon':
    case 'polyline': {
      // polygon与polyline是一样的,polygon多边形，polyline折线
      const points = (node.getAttribute('points').match(regNumber) || []).map(
        Number,
      )
      if (points.length < 4)
        return

      path
        = `M ${points.slice(0, 2).join(' ')}
        L ${points.slice(2).join(' ')}
        ${tagName === 'polygon' ? 'z' : ''}`

      break
    }
  }
  return path || ''
}

export const testSvg2path = () => {
  [].slice.call(document.querySelectorAll('svg')).forEach((svg: Element) => {
    const svgNew: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svgNew.setAttribute('width', svg.getAttribute('width') as string)
    svgNew.setAttribute('height', svg.getAttribute('height') as string)

    // result.appendChild(svgNew);
    // 转换为路径
    const arr = []

    arr.slice.call(svg.childNodes).forEach((node: Element) => {
      const path = svg2path(node)
      if (path) {
        const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        svgPath.setAttribute('d', path)
        svgNew.appendChild(svgPath)

        const fill = node.getAttribute('fill')
        const stroke = node.getAttribute('stroke')
        const strokeWidth = node.getAttribute('stroke-width')

        if (fill)
          svgPath.setAttribute('fill', fill)

        if (stroke)
          svgPath.setAttribute('stroke', stroke)

        if (strokeWidth)
          svgPath.setAttribute('stroke-width', strokeWidth)
      }
    })
  })
}

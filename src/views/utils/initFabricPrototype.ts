import { fabric } from 'fabric'

fabric.Canvas.prototype.selectionColor = 'rgba(0, 191, 255, .3)'
fabric.Canvas.prototype.selectionBorderColor = 'rgba(0, 191, 255, .5)'
fabric.Canvas.prototype.selectionLineWidth = 4

// 将控制线默认的浅蓝色改为 #dc143c，
fabric.Object.prototype.borderColor = 'rgb(66, 133, 244)'
// 将控制线 solid 改成 dash
fabric.Object.prototype.borderDashArray = [10, 5]
// 控制线宽度
fabric.Object.prototype.width = 4

// 将内边距设置为1px
fabric.Object.prototype.padding = 5

// 修改控制点的形状，默认为`rect`矩形，可选的值还有`circle`圆形
fabric.Object.prototype.cornerStyle = 'rect'

// 修改控制点的填充色为白色
fabric.Object.prototype.cornerColor = 'white'

// 修改控制点的大小为10px
fabric.Object.prototype.cornerSize = 10

// 设置控制点不透明，即可以盖住其下的控制线
fabric.Object.prototype.transparentCorners = false

// 修改控制点的边框颜色为`gray`灰色
fabric.Object.prototype.cornerStrokeColor = 'rgb(66, 133, 244)'

// 修改控制点的大小为8px
fabric.Object.prototype.cornerSize = 8

// 单独修改旋转控制点距离主体的纵向距离为-20px
fabric.Object.prototype.controls.mtr.offsetY = -20

// 单独修改旋转控制点，光标移动到该点上时的样式为`pointer`，一个手的形状
fabric.Object.prototype.controls.mtr.cursorStyle = 'grab'

// 旋转控制点和主体之间一般没有那条控制线，这里我们对它进行隐藏。
fabric.Object.prototype.controls.mtr.withConnection = false

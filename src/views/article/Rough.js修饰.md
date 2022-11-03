# 使用rough.js库修改线条样式

这里遇到了两个坑，一个是fabric.js，一个是rough.js

本来的预览是先删除上一个，再添加当前这个。
这样就是fabric.js对象总是在销毁重建中。

如果使用rough.js，因为其线条为了模拟手绘，是采用了随机数，一直销毁重建，导致新的线条样式跟之前的不一样，出现闪动的效果。

为了保持稳定，这里主要设置两点解决。

1. fabric.js预览，将销毁重建改成，new出来的对象的属性，赋值给前一个对象
2. rough.js new 出来的对象，有个稳定的 seed，之后的更新，就一直用这个seed

这样就解决了使用rough.js绘制过程中闪动的问题

然后就遇到了新的问题，上一步是将new出来的新对象赋值给旧对象，达到刷新预览的效果
但是上一步的对象，添加到画布上后，会有一些画布相关的属性，比如相对画布的坐标 oCoords 等
这里全覆盖，就不太合适

但是当使用 `Object.assign` 合并对象后，却影响了绘制。
没有究其原因，直接将报错的 `oCoords` 给了新的对象，再赋值给旧的对象

```ts
update(location: { x: number; y: number }[]) {
  const [mouseFrom, mouseTo] = location
  const path = this.svgPath2String([mouseFrom, mouseTo])
  const updatedPath = new RoughPath(path, this.config, { seed: this.pathSeed })

  if (this.fabricObject) {
    updatedPath.oCoords = this.fabricObject.oCoords
    this.fabricObject.set(updatedPath)
  }

  this.canvas.renderAll()
}
```

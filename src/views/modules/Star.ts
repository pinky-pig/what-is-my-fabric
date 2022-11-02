// // 创建五角星的五个顶点
// for (let i = 0; i < 5; i++) {
//   // 外层五角星坐标
//   let deg = -90 + i * 72;
//   let x1 = radius1 * Math.cos(deg * Math.PI / 180) + canvas.width / 2;
//   let y1 = radius1 * Math.sin(deg * Math.PI / 180) + canvas.height / 2;
//   points.push([x1, y1]);
//   // 旋转36度，生成内顶角坐标
//   deg = deg + 36;
//   let x2 = radius2 * Math.cos(deg * Math.PI / 180) + canvas.width / 2;
//   let y2 = radius2 * Math.sin(deg * Math.PI / 180) + canvas.height / 2;
//   points.push([x2, y2]);
// }

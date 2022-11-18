export const generateUuid = (a = ''): string => {
  return a
    ? ((Number(a) ^ (Math.random() * 16)) >> (Number(a) / 4)).toString(16)
    : `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, generateUuid)
}
// 简单理解其实就是。uuid是32位的16进制数字。即每个都是在0-9或者a-f的数字或字母
// 1. replace() 第二个参数是函数的情况下，满足匹配条件多少次，就调用多少次函数
// 2. 因为调用函数的时候没有传参，先走一个值，然后返回给上层，在通过`Math.random()`生成后，返回给上层
// 3. 一直循环调用32次
// const uuid = generateUuid()
// console.log(uuid)

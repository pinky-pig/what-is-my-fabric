// 1.根据value值获取key值
export const getKeyByValue = (obj: object, value: any) => {
  const regExp = new RegExp(value, 'g')
  for (const key in obj) {
    if (regExp.exec(obj[key]))
      return key
  }
  return null
}

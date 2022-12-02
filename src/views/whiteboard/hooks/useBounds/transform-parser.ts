// const kCommandTypeRegex = /^[\t\n\f\r ]*([MLHVZCSQTAmlhvzcsqta])[\t\n\f\r ]*/
// const kFlagRegex = /^[01]/
// const kNumberRegex = /^[+-]?(([0-9]*\.[0-9]+)|([0-9]+\.)|([0-9]+))([eE][+-]?[0-9]+)?/
// const kCoordinateRegex = kNumberRegex
// const kCommaWsp = /^(([\t\n\f\r ]+,?[\t\n\f\r ]*)|(,[\t\n\f\r ]*))/

export const translateRegExp = /translate\((.*)[\s\,\s](.*)\)\s*/

export function getTranslateFromString(str: string) {
  const translate = str.replace(/\s+/g, '')
    .match(translateRegExp)
  if (translate)
    return [translate[1], translate[2]]
  else
    return [0, 0]
}

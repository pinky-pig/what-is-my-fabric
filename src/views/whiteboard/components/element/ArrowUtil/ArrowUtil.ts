import type { Options } from 'roughjs/bin/core'
import rough from 'roughjs'
import { getShapeStyle } from '../shared'
import { getArrowDefaultPath } from './arrowHelpers'
import { ColorStyle, DashStyle, SizeStyle } from '~/views/whiteboard/types'
export class ArrowUtil {
  private _roughOption: Options = {
    seed: rough.newSeed(),
    strokeWidth: 3,
    roughness: 3,
  }

  set roughOption(newConfig: Options) {
    Object.assign(this._roughOption, newConfig)
  }

  get roughOption(): Options {
    return this._roughOption
  }

  getShape() {

  }

  getSvgElement = (mouseFromPoint: number[], mouseToPoint: number[], isDarkMode: boolean) => {
    return {
      path: getArrowDefaultPath(mouseFromPoint, mouseToPoint),
      style: getShapeStyle(
        { color: ColorStyle.Blue, size: SizeStyle.Small, isFilled: false, dash: DashStyle.Solid },
        isDarkMode,
      ),
    }
  }

  renderElement() {

  }
}

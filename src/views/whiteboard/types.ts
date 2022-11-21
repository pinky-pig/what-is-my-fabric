/*                       Theme                        */
export type Theme = 'dark' | 'light'

/* -------------------------------------------------- */
/*                       Shapes                       */
/* -------------------------------------------------- */
export enum TDShapeType {
  Sticky = 'sticky',
  Ellipse = 'ellipse',
  Rectangle = 'rectangle',
  Triangle = 'triangle',
  Draw = 'draw',
  Arrow = 'arrow',
  Line = 'line',
  Text = 'text',
  Group = 'group',
  Image = 'image',
  Video = 'video',
}
// The extended handle (used for arrows)
export interface TDHandle extends TLHandle {
  canBind?: boolean
  bindingId?: string
}

export interface TLHandle {
  id: string
  index: number
  point: number[]
}

export interface TLShape {
  id: string
  type: string
  parentId: string
  childIndex: number
  name: string
  point: number[]
  assetId?: string
  rotation?: number
  children?: string[]
  handles?: Record<string, TLHandle>
  isGhost?: boolean
  isHidden?: boolean
  isLocked?: boolean
  isGenerated?: boolean
  isAspectRatioLocked?: boolean
}

export interface TDBaseShape extends TLShape {
  style: ShapeStyles
  type: TDShapeType
  defaultPath?: string
  label?: string
  handles?: Record<string, TDHandle>
}
export enum Decoration {
  Arrow = 'arrow',
}
// The shape created with the arrow tool
export interface ArrowShape extends TDBaseShape {
  type: TDShapeType.Arrow
  bend: number
  handles: {
    start: TDHandle
    bend: TDHandle
    end: TDHandle
  }
  decorations?: {
    start?: Decoration
    end?: Decoration
    middle?: Decoration
  }
  label?: string
  labelPoint?: number[]
}

/* ------------------ Shape Styles ------------------ */
export enum ColorStyle {
  White = 'white',
  LightGray = 'lightGray',
  Gray = 'gray',
  Black = 'black',
  Green = 'green',
  Cyan = 'cyan',
  Blue = 'blue',
  Indigo = 'indigo',
  Violet = 'violet',
  Red = 'red',
  Orange = 'orange',
  Yellow = 'yellow',
}

export enum SizeStyle {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

export enum DashStyle {
  Draw = 'draw',
  Solid = 'solid',
  Dashed = 'dashed',
  Dotted = 'dotted',
}

export enum FontSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  ExtraLarge = 'extraLarge',
}

export enum AlignStyle {
  Start = 'start',
  Middle = 'middle',
  End = 'end',
  Justify = 'justify',
}

export enum FontStyle {
  Script = 'script',
  Sans = 'sans',
  Serif = 'serif',
  Mono = 'mono',
}

export interface ShapeStyles {
  color: ColorStyle
  size: SizeStyle
  dash: DashStyle
  font?: FontStyle
  textAlign?: AlignStyle
  isFilled?: boolean
  scale?: number
}

export enum TDAssetType {
  Image = 'image',
  Video = 'video',
}

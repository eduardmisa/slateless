import { BaseEditor } from "slate"
import { ReactEditor } from "slate-react"

export const HOTKEYS = {
  "ctrl+b": "bold",
  "ctrl+i": "italic",
  "ctrl+u": "underline"
}

export const HEADING_TYPES = ["heading-1", "heading-2", "heading-3", "heading-4", "heading-5", "heading-6"] as const
export type HeadingType = (typeof HEADING_TYPES)[number]

export const MARK_TYPES = ["bold", "italic", "underline", "strikethrough"] as const
export type MarkType = (typeof MARK_TYPES)[number]

export const INLINE_TYPES = ["link"] as const
export type InlineType = (typeof INLINE_TYPES)[number]

export const LIST_TYPES = ["numbered-list", "bulleted-list"] as const
export type ListType = (typeof LIST_TYPES)[number]

export const TEXT_ALIGN_TYPES = ["left", "center", "right"] as const
export type TextAlignType = (typeof TEXT_ALIGN_TYPES)[number]

export type ToolTypes = HeadingType | MarkType | InlineType | ListType | TextAlignType

export type CustomElement = {
  type: "paragraph" | HeadingType | InlineType | MarkType | ListType
  url?: string
  align?: TextAlignType
  children: CustomText[]
}
export type CustomText = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  children?: CustomText[]
}

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

import { BaseEditor } from "slate"
import { ReactEditor } from "slate-react"

export const HOTKEYS = {
  // 'mod+b': 'bold',
  // 'mod+i': 'italic',
  // 'mod+u': 'underline',
  'ctrl+b': 'bold',
  'ctrl+i': 'italic',
  'ctrl+u': 'underline',
}

export const FORMAT_TYPE = [
  "bold",
  "italic",
  "underline",
  "link",
  "numbered-list",
  "bulleted-list",
  "left",
  "center",
  "right",
]
export type FormatType = typeof FORMAT_TYPE[number]

export const LIST_TYPES = ['numbered-list', 'bulleted-list']
export type ListType = typeof LIST_TYPES[number]

export const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']
export type TextAlignType = typeof TEXT_ALIGN_TYPES[number]

export type CustomElement = {
  type: "link" | "paragraph" | "bulleted-list" | "numbered-list"
  url?: string
  align?: TextAlignType
  children: CustomText[]
}
export type CustomText = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  children?: CustomText[]
}

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

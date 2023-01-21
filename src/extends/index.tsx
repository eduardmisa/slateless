import { BaseEditor, Editor, Range, Text, Transforms } from "slate"
import { ReactEditor } from "slate-react"

export type TEXT_ALIGN_TYPES = "left" | "center" | "right" | "justify"
export type LIST_TYPES = "bullet" | "number"

export type CustomElement = {
  type: "link" | "paragraph" | "bullet-list" | "number-list"
  bold?: boolean
  italic?: boolean
  underline?: boolean
  url?: string
  align?: TEXT_ALIGN_TYPES
  list?: LIST_TYPES
  children: CustomText[]
}
export type CustomText = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  url?: string
  align?: TEXT_ALIGN_TYPES
  list?: LIST_TYPES
  children?: CustomText[]
}

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

export const CustomEditor = {
  isBoldActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n: any) => n.bold === true,
      universal: true
    })

    return !!match
  },

  isItalicActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n: any) => n.italic === true,
      universal: true
    })

    return !!match
  },

  isUnderlineActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n: any) => n.underline === true,
      universal: true
    })

    return !!match
  },

  isLinkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n: any) => n.type === "link"
    })
    return !!match
  },

  isLeftAlignActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n: any) => n.align === "left"
    })
    return !!match
  },
  isCenterAlignActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n: any) => n.align === "center"
    })
    return !!match
  },
  isRightAlignActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n: any) => n.align === "right"
    })
    return !!match
  },

  isNumberListActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n: any) => n.list === "number"
    })
    return !!match
  },
  isBulletListActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n: any) => n.list === "bullet"
    })
    return !!match
  },

  toggleBoldMark(editor) {
    const isActive = CustomEditor.isBoldActive(editor)
    Transforms.setNodes(editor, { bold: isActive ? null : true } as any, {
      match: (n) => Text.isText(n),
      split: true
    })
  },

  toggleItalicMark(editor) {
    const isActive = CustomEditor.isItalicActive(editor)
    Transforms.setNodes(editor, { italic: isActive ? null : true } as any, {
      match: (n) => Text.isText(n),
      split: true
    })
  },

  toggleUnderlineMark(editor) {
    const isActive = CustomEditor.isUnderlineActive(editor)
    Transforms.setNodes(editor, { underline: isActive ? null : true } as any, {
      match: (n) => Text.isText(n),
      split: true
    })
  },

  toggleLinkMark(editor, url: string) {
    const isActive = CustomEditor.isLinkActive(editor)

    if (isActive) {
      Transforms.unwrapNodes(editor, {
        match: (n: any) => n.type === "link"
      })
      return
    }

    const { selection } = editor
    const isCollapsed = selection && Range.isCollapsed(selection)
    const link: CustomElement = {
      type: "link",
      url,
      children: isCollapsed ? [{ text: url }] : []
    }

    if (isCollapsed) {
      Transforms.insertNodes(editor, link)
    } else {
      Transforms.wrapNodes(editor, link, { split: true })
      Transforms.collapse(editor, { edge: "end" })
    }
  },

  toggleLeftAlignMark(editor) {
    const isActive = CustomEditor.isLeftAlignActive(editor)
    Transforms.setNodes(editor, { align: isActive ? null : "left" } as any, {
      match: (n) => Editor.isBlock(editor, n),
      split: true
    })
  },
  toggleCenterAlignMark(editor) {
    const isActive = CustomEditor.isCenterAlignActive(editor)
    Transforms.setNodes(editor, { align: isActive ? null : "center" } as any, {
      match: (n) => Editor.isBlock(editor, n),
      split: true
    })
  },
  toggleRightAlignMark(editor) {
    const isActive = CustomEditor.isRightAlignActive(editor)
    Transforms.setNodes(editor, { align: isActive ? null : "right" } as any, {
      match: (n) => Editor.isBlock(editor, n),
      split: true
    })
  },

  toggleNumberListMark(editor) {
    const isActive = CustomEditor.isRightAlignActive(editor)
    Transforms.setNodes(editor, { list: isActive ? null : "number" } as any, {
      match: (n) => Editor.isBlock(editor, n),
      split: true
    })
  },
  toggleBulletListMark(editor) {
    const isActive = CustomEditor.isRightAlignActive(editor)
    Transforms.setNodes(editor, { list: isActive ? null : "bullet" } as any, {
      match: (n) => Editor.isBlock(editor, n),
      split: true
    })
  }
}

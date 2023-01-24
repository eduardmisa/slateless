import { Editor, Transforms, Element as SlateElement, Range } from "slate"
import { useSlate } from "slate-react"
import { TEXT_ALIGN_TYPES, LIST_TYPES, FormatType, CustomElement } from "../extends"
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListNumberedIcon,
  ListBulletIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  LinkIcon
} from "../icons"

export const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? "align" : "type")
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true
  })
  let newProperties: Partial<SlateElement>
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format
    }
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format
    }
  }
  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

export const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

export const toggleLink = (editor, url) => {
  const isActive = isLinkActive(editor)

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
}

export const isBlockActive = (editor, format, blockType = "type") => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n[blockType] === format
    })
  )

  return !!match
}

export const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

export const isLinkActive = (editor) => {
  const [match] = Editor.nodes(editor, {
    match: (n: any) => n.type === "link"
  })
  return !!match
}

export const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align }
  switch (element.type) {
    case "link":
      return (
        <a style={style} {...attributes} href={element.url} target='_blank'>
          {children}
        </a>
      )
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      )
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      )
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
}

export const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

interface IIcon {
  format: FormatType
}
const Icon = ({ format }: IIcon) => {
  return (
    <>
      {format === "bold" && <BoldIcon />}
      {format === "italic" && <ItalicIcon />}
      {format === "underline" && <UnderlineIcon />}
      {format === "link" && <LinkIcon />}
      {format === "numbered-list" && <ListNumberedIcon />}
      {format === "bulleted-list" && <ListBulletIcon />}
      {format === "left" && <AlignLeftIcon />}
      {format === "center" && <AlignCenterIcon />}
      {format === "right" && <AlignRightIcon />}
    </>
  )
}

interface IBlockButton {
  format: FormatType
}
export const BlockButton = ({ format }: IBlockButton) => {
  const editor = useSlate()
  return (
    <Button
      active={isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? "align" : "type")}
      onClick={(event) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <Icon format={format} />
    </Button>
  )
}

interface IMarkButton {
  format: FormatType
  onClick?: () => void
}
export const MarkButton = ({ format, onClick }: IMarkButton) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onClick={(event) => {
        event.preventDefault()

        if (onClick) {
          onClick()
          return
        }

        toggleMark(editor, format)
      }}
    >
      <Icon format={format} />
    </Button>
  )
}

const Button = ({ children, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "0.25rem",
        width: "1.75rem",
        height: "1.75rem",
        cursor: "pointer",
        color: !active ? "rgb(31 41 55)" : "rgb(30 64 175)",
        marginLeft: "0.5rem"
      }}
    >
      {children}
    </button>
  )
}

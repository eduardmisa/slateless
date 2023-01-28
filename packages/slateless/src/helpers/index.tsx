import { Editor, Transforms, Element as SlateElement, Range } from "slate"
import { useSlate } from "slate-react"
import {
  TEXT_ALIGN_TYPES,
  LIST_TYPES,
  CustomElement,
  HeadingType,
  MarkType,
  ListType,
  InlineType,
  TextAlignType,
  ToolTypes
} from "../extends"
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListNumberedIcon,
  ListBulletIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  LinkIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon,
  StrikethroughIcon
} from "../icons"

export const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? "align" : "type")
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type as any) &&
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
    case "heading-1":
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      )
    case "heading-2":
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      )
    case "heading-3":
      return (
        <h3 style={style} {...attributes}>
          {children}
        </h3>
      )
    case "heading-4":
      return (
        <h4 style={style} {...attributes}>
          {children}
        </h4>
      )
    case "heading-5":
      return (
        <h5 style={style} {...attributes}>
          {children}
        </h5>
      )
    case "heading-6":
      return (
        <h6 style={style} {...attributes}>
          {children}
        </h6>
      )
    case "link":
      return (
        <a style={style} {...attributes} href={element.url} target='_blank' rel='noreferrer'>
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

  if (leaf.strikethrough) {
    children = <s>{children}</s>
  }

  return <span {...attributes}>{children}</span>
}

interface IIcon {
  format: ToolTypes
}
const Icon = ({ format }: IIcon) => {
  return (
    <>
      {format === "heading-1" && <Heading1Icon />}
      {format === "heading-2" && <Heading2Icon />}
      {format === "heading-3" && <Heading3Icon />}
      {format === "heading-4" && <Heading4Icon />}
      {format === "heading-5" && <Heading5Icon />}
      {format === "heading-6" && <Heading6Icon />}
      {format === "bold" && <BoldIcon />}
      {format === "italic" && <ItalicIcon />}
      {format === "underline" && <UnderlineIcon />}
      {format === "strikethrough" && <StrikethroughIcon />}
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
  format: InlineType | HeadingType | ListType | TextAlignType
  onClick?: () => void
}
export const BlockButton = ({ format, onClick }: IBlockButton) => {
  const editor = useSlate()
  return (
    <Button
      active={isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format as any) ? "align" : "type")}
      onClick={(event) => {
        event.preventDefault()
        if (onClick) {
          onClick()
          return
        }
        toggleBlock(editor, format)
      }}
    >
      <Icon format={format} />
    </Button>
  )
}

interface IMarkButton {
  format: MarkType
}
export const MarkButton = ({ format }: IMarkButton) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onClick={(event) => {
        event.preventDefault()
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
        marginRight: "0.5rem"
      }}
    >
      {children}
    </button>
  )
}

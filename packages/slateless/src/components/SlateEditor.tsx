import { useCallback, useMemo, useState } from "react"
import isHotkey from "is-hotkey"
import { Editable, withReact, Slate } from "slate-react"
import { createEditor, Descendant } from "slate"
import { withHistory } from "slate-history"
import { HOTKEYS } from "../extends"
import { Element, MarkButton, BlockButton, toggleMark, Leaf, toggleLink } from "../helpers"
import { withInLines } from "../hooks/withInLines"

const Toolbar = ({ children }) => {
  return <div style={{ margin: "0.5rem" }}>{children}</div>
}

interface IEditor {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}
export const SlateEditor = ({ value, onChange, disabled }: IEditor) => {
  const parsedValue = useMemo<Descendant[]>(() => {
    try {
      return JSON.parse(value)
    } catch (e) {
      return [
        {
          type: "paragraph",
          children: [
            {
              text: value
            }
          ]
        }
      ]
    }
  }, [value])

  const [slateValue, setSlateValue] = useState<Descendant[]>(parsedValue)
  const onValueChange = (val: any) => {
    setSlateValue(val)
    onChange(JSON.stringify(val))
  }

  const renderElement = useCallback((props) => <Element {...props} />, [])
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
  const editor = useMemo(() => withInLines(withHistory(withReact(createEditor()))), [])

  const [showLink, setShowLink] = useState(false)
  const toggleShowLink = () => {
    setShowLink(!showLink)
  }
  const [link, setLink] = useState("")
  const onLinkChange = (value: string) => {
    setLink(value)
  }
  const onLinkApply = () => {
    toggleLink(editor, link)
    toggleShowLink()
    onLinkChange("")
  }

  return (
    <Slate editor={editor} value={slateValue} onChange={onValueChange}>
      {!disabled && (
        <>
          <Toolbar>
            <MarkButton format='bold' />
            <MarkButton format='italic' />
            <MarkButton format='underline' />
            <div style={{ position: "relative", display: "inline-block" }}>
              <MarkButton format='link' onClick={toggleShowLink} />
              <div
                style={{
                  display: showLink ? "flex" : "none",
                  position: "absolute",
                  padding: "0.5rem",
                  border: "1px solid",
                  backgroundColor: "#ffffff",
                  marginLeft: "0.5rem",
                  marginTop: "0.1rem",
                  zIndex: "9999"
                }}
              >
                <input
                  value={link}
                  onChange={(e) => onLinkChange(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.key === "Escape") {
                      toggleShowLink()
                      onLinkChange("")
                    }
                    if (e.key === "Enter") {
                      onLinkApply()
                    }
                  }}
                />
                <button style={{ marginLeft: "0.5rem", cursor: "pointer" }} onClick={onLinkApply}>
                  link
                </button>
              </div>
            </div>
            <BlockButton format='numbered-list' />
            <BlockButton format='bulleted-list' />
            <BlockButton format='left' />
            <BlockButton format='center' />
            <BlockButton format='right' />
          </Toolbar>
          <hr />
        </>
      )}

      <Editable
        style={{
          marginTop: "1.25rem",
          marginBottom: "1.25rem",
          marginLeft: "0.5rem",
          marginRight: "0.5rem"
        }}
        disabled={disabled}
        readOnly={disabled}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder='Enter content.'
        spellCheck
        autoFocus
        onKeyDown={(event) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault()
              const mark = HOTKEYS[hotkey]
              toggleMark(editor, mark)
            }
          }
        }}
      />
    </Slate>
  )
}

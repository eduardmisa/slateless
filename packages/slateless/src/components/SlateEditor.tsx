import { Fragment, useCallback, useMemo, useState } from "react"
import isHotkey from "is-hotkey"
import { Editable, withReact, Slate } from "slate-react"
import { createEditor, Descendant } from "slate"
import { withHistory } from "slate-history"
import { HeadingType, HOTKEYS, InlineType, ListType, MarkType, TextAlignType } from "../extends"
import { Element, MarkButton, BlockButton, toggleMark, Leaf, toggleLink } from "../helpers"
import { withInLines } from "../hooks/withInLines"

interface IEditor {
  value: string
  onChange: (value: string) => void
  toolbar?: (HeadingType | MarkType | InlineType | ListType | TextAlignType)[]
  disabled?: boolean
}
export const SlateEditor = ({
  value,
  onChange,
  toolbar,
  disabled
}: IEditor) => {
  toolbar = (toolbar && toolbar.length > 0) ? toolbar : defaultTools

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
            {toolbar && toolbar.length > 0 && (
              toolbar.map((format, index) => (
                <Fragment key={index}>
                  {format === "heading-1" && <BlockButton format='heading-1' />}
                  {format === "heading-2" && <BlockButton format='heading-2' />}
                  {format === "heading-3" && <BlockButton format='heading-3' />}
                  {format === "heading-4" && <BlockButton format='heading-4' />}
                  {format === "heading-5" && <BlockButton format='heading-5' />}
                  {format === "heading-6" && <BlockButton format='heading-6' />}
                  {format === "bold" && <MarkButton format='bold' />}
                  {format === "italic" && <MarkButton format='italic' />}
                  {format === "underline" && <MarkButton format='underline' />}
                  {format === "link" && (
                    <div style={{ position: "relative", display: "inline-block" }}>
                      <BlockButton format='link' onClick={toggleShowLink} />
                      <div
                        style={{
                          display: showLink ? "flex" : "none",
                          position: "absolute",
                          padding: "0.5rem",
                          backgroundColor: "#ffffff",
                          marginLeft: "0.5rem",
                          marginTop: "0.1rem",
                          zIndex: "9999",
                          boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)"
                        }}
                      >
                        <input
                          style={{ padding: "0.3rem" }}
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
                  )}
                  {format === "numbered-list" && <BlockButton format='numbered-list' />}
                  {format === "bulleted-list" && <BlockButton format='bulleted-list' />}
                  {format === "left" && <BlockButton format='left' />}
                  {format === "center" && <BlockButton format='center' />}
                  {format === "right" && <BlockButton format='right' />}
                </Fragment>
              ))
            )}
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

const Toolbar = ({ children }) => {
  return <div style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>{children}</div>
}

const defaultTools: (HeadingType | MarkType | InlineType | ListType | TextAlignType)[] = [
  "bold",
  "italic",
  "underline",
  "link",
  "numbered-list",
  "bulleted-list",
  "left",
  "center",
  "right"
]
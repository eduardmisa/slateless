import { createEditor, Descendant } from "slate"
import { Editable, Slate, withReact } from "slate-react"
import { useCallback, useMemo, useState } from "react"
import { withInLines } from "../hooks/withInLines"
import { withHistory } from "slate-history"
import { DefaultElement, Leaf, LinkElement } from "./SlateEditor"

interface IContent {
  value: string
}
export const SlateContent = ({ value }: IContent) => {
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

  const [editor] = useState(withInLines(withHistory(withReact(createEditor()))))

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "link":
        return <LinkElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])
  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />
  }, [])

  return (
    <Slate editor={editor} value={[...parsedValue]}>
      <Editable readOnly={true} renderElement={renderElement} renderLeaf={renderLeaf}></Editable>
    </Slate>
  )
}

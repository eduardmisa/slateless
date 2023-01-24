// import { withInLines } from "../hooks/withInLines"
import { createEditor, Descendant } from "slate"
import { Editable, Slate, withReact } from "slate-react"
import { useCallback, useMemo } from "react"
import { withHistory } from "slate-history"
import { Element, Leaf } from "../helpers"
import { withInLines } from "../hooks/withInLines"

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

  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withInLines(withHistory(withReact(createEditor()))), [])

  return (
    <Slate editor={editor} value={[...parsedValue]}>
      <Editable
        readOnly={true}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        style={{ width: "100%" }}
      />
    </Slate>
  )
}

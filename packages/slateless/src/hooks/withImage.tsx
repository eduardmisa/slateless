import isUrl from "is-url"
import { toggleImageLink } from "../helpers"

export const withImages = (editor) => {
  const { insertData, isVoid } = editor

  editor.isVoid = (element) => {
    return element.type === "image" ? true : isVoid(element)
  }

  editor.insertData = (data) => {
    const text = data.getData("text/plain")
    const { files } = data

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader()
        const [mime] = file.type.split("/")

        if (mime === "image") {
          reader.addEventListener("load", () => {
            const url = reader.result
            toggleImageLink(editor, url)
          })

          reader.readAsDataURL(file)
        }
      }
    } else if (isImageUrl(text)) {
      toggleImageLink(editor, text)
    } else {
      insertData(data)
    }
  }

  return editor
}

const isImageUrl = (url) => {
  if (!url) return false
  if (!isUrl(url)) return false
  return true
}

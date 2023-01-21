import { useCallback, useMemo, useState } from "react";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import { withHistory } from "slate-history";
import { CustomEditor } from "../extends";
import { withInLines } from "../hooks/withInLines";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  LinkIcon,
  ListBulletIcon,
  ListNumberedIcon,
  UnderlineIcon
} from "../icons";

interface IEditor {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const SlateEditor = ({ value, onChange, disabled }: IEditor) => {
  const parsedValue = useMemo<Descendant[]>(() => {
    try {
      return JSON.parse(value);
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
      ];
    }
  }, [value]);

  const [slateValue, setSlateValue] = useState<Descendant[]>(parsedValue);
  const onValueChange = (val: any) => {
    setSlateValue(val);
    onChange(JSON.stringify(val));
  };

  const editor = useMemo(
    () => withInLines(withHistory(withReact(createEditor()))),
    []
  );

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "link":
        return <LinkElement {...props} />;
      case "bullet-list":
        return <BulletListElement {...props} />;
      case "number-list":
        return <NumberedListElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);
  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <>
      <div className="border border-gray-400 rounded">
        <Slate editor={editor} value={slateValue} onChange={onValueChange}>
          {!disabled && (
            <>
              <Toolbar />
              <hr />
            </>
          )}

          <Editable
            className="m-2 my-5"
            disabled={disabled}
            readOnly={disabled}
            placeholder="Enter some plain text..."
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={(event) => {
              if (!event.ctrlKey) {
                return;
              }
              event.preventDefault();

              switch (event.key) {
                case "b": {
                  CustomEditor.toggleBoldMark(editor);
                  break;
                }

                case "i": {
                  CustomEditor.toggleItalicMark(editor);
                  break;
                }
              }
            }}
          ></Editable>
        </Slate>
      </div>
    </>
  );
};

export const BulletListElement = (props) => {
  return <li {...props.attributes}>{props.children}</li>;
};
export const NumberedListElement = (props) => {
  return <li {...props.attributes}>{props.children}</li>;
};
export const LinkElement = (props) => {
  return (
    <a {...props.attributes} href={props.element.url} className="text-blue-500">
      {props.children}
    </a>
  );
};
export const DefaultElement = (props) => {
  return (
    <p
      style={{ textAlign: props.element.align || "left" }}
      {...props.attributes}
    >
      {props.children}
    </p>
  );
};
export const Leaf = (props) => {
  return (
    <span
      {...props.attributes}
      style={{
        fontWeight: props.leaf.bold ? "bold" : "normal",
        fontStyle: props.leaf.italic ? "italic" : "normal",
        textDecoration: props.leaf.underline ? "underline" : "none"
      }}
    >
      {props.children}
    </span>
  );
};

const ToolbarButton = ({ children, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`p-1 w-7 h-7 ${active ? "text-primary" : "text-black"}`}
    >
      {children}
    </button>
  );
};
const Toolbar = () => {
  const editor = useSlate();

  return (
    <div className="space-x-2 m-2">
      <ToolbarButton
        active={CustomEditor.isBoldActive(editor)}
        onClick={() => CustomEditor.toggleBoldMark(editor)}
      >
        <BoldIcon />
      </ToolbarButton>
      <ToolbarButton
        active={CustomEditor.isItalicActive(editor)}
        onClick={() => CustomEditor.toggleItalicMark(editor)}
      >
        <ItalicIcon />
      </ToolbarButton>
      <ToolbarButton
        active={CustomEditor.isUnderlineActive(editor)}
        onClick={() => CustomEditor.toggleUnderlineMark(editor)}
      >
        <UnderlineIcon />
      </ToolbarButton>
      <ToolbarButton
        active={CustomEditor.isLinkActive(editor)}
        onClick={() =>
          CustomEditor.toggleLinkMark(editor, "https://google.com")
        }
      >
        <LinkIcon />
      </ToolbarButton>
      <ToolbarButton
        active={CustomEditor.isLeftAlignActive(editor)}
        onClick={() => CustomEditor.toggleLeftAlignMark(editor)}
      >
        <AlignLeftIcon />
      </ToolbarButton>
      <ToolbarButton
        active={CustomEditor.isCenterAlignActive(editor)}
        onClick={() => CustomEditor.toggleCenterAlignMark(editor)}
      >
        <AlignCenterIcon />
      </ToolbarButton>
      <ToolbarButton
        active={CustomEditor.isRightAlignActive(editor)}
        onClick={() => CustomEditor.toggleRightAlignMark(editor)}
      >
        <AlignRightIcon />
      </ToolbarButton>
      <ToolbarButton
        active={CustomEditor.isBulletListActive(editor)}
        onClick={() => CustomEditor.toggleBulletListMark(editor)}
      >
        <ListBulletIcon />
      </ToolbarButton>
      <ToolbarButton
        active={CustomEditor.isNumberListActive(editor)}
        onClick={() => CustomEditor.toggleNumberListMark(editor)}
      >
        <ListNumberedIcon />
      </ToolbarButton>
    </div>
  );
};

export default SlateEditor;

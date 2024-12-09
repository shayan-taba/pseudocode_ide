// components/Editor.tsx
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { indentUnit } from "@codemirror/language";
import { autocompletion } from "@codemirror/autocomplete";

import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";

const myTheme = createTheme({
  theme: "light",
  settings: {
    background: "",
    backgroundImage: "",
    foreground: "",
    caret: "#ffffff", // this is the cursor colour
    selection: "#000000",
    selectionMatch: "#000000",
    lineHighlight: "#8a91991a",
    gutterBorder: "#121826",
    gutterBackground: "#121826",
    gutterForeground: "#8a919966",
  },
  styles: [
    { tag: t.comment, color: "#787b8099" },
    { tag: t.variableName, color: "#f5f5f5" },
    { tag: [t.string, t.special(t.brace)], color: "#5c6166" },
    { tag: t.number, color: "#ffffff" },
    { tag: t.bool, color: "#5c6166" },
    { tag: t.null, color: "#5c6166" },
    { tag: t.keyword, color: "#0080ff" },
    { tag: t.operator, color: "#5c6166" },
    { tag: t.className, color: "#5c6166" },
    { tag: t.definition(t.typeName), color: "#5c6166" },
    { tag: t.typeName, color: "#5c6166" },
    { tag: t.angleBracket, color: "#5c6166" },
    { tag: t.tagName, color: "#5c6166" },
    { tag: t.attributeName, color: "#5c6166" },
  ],
});
interface EditorProps {
  code: string;
  onCodeChange: (value: string) => void; // Update this to expect only a string
  editorWidth: string;
}

const Editor: React.FC<EditorProps> = ({ code, onCodeChange, editorWidth }) => {
  return (
    <div
      className={`z-10 outline-2 outline border-x-2 border-gray-300 outline-gray-300 flex-grow bg-gray-900 p-4 overflow-y-auto ${
        editorWidth == undefined ? "flex-grow" : editorWidth
      }`}
    >
      <CodeMirror
        value={code}
        height="100%"
        extensions={[
          python(),
          autocompletion({ activateOnTyping: false }),
          indentUnit.of("    "),
        ]}
        theme={myTheme}
        onChange={(value) => onCodeChange(value || "")} // Ensure `value` is never `undefined`
      />
    </div>
  );
};

export default Editor;

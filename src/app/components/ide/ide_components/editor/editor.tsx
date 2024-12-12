// components/Editor.tsx
import React, { Dispatch, SetStateAction } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { indentUnit } from "@codemirror/language";
import { autocompletion } from "@codemirror/autocomplete";
import { EditorView } from "@uiw/react-codemirror";

import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";

import {
  PlayIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

import { CodeBracketIcon } from "@heroicons/react/24/solid";

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
    gutterBorder: "#1E293B",
    gutterBackground: "#1E293B",
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
  width: string;
  code: string;
  onCodeChange: (value: string) => void; // Update this to expect only a string
  onRun: () => void;
  expandEditor: boolean;
  setExpandEditor: Dispatch<React.SetStateAction<boolean>>;
}

const Editor: React.FC<EditorProps> = ({
  width,
  code,
  onCodeChange,
  onRun,
  expandEditor,
  setExpandEditor
}) => {

  const logval:((this: Window, ev: KeyboardEvent) => any) | null = () => {
    console.log
  }
  return (
    <div className={`z-10 container-els ${!expandEditor ? "h-[100%]":""} ${width}`}>
      <div className="container-headings text-green-400">
        <div className="container-nav-box">
          <div className={"container-navs"}>
            <h1>Pseudocode</h1>
            <CodeBracketIcon className="nav-icons" />
          </div>
        </div>
        <div className="container-utils-box">
          <button
            onClick={onRun}
            className="nav-btns px-3 bg-green-600 hover:bg-green-700"
          >
            <PlayIcon className="nav-icons" />
            Run
          </button>
          
          <button
            onClick={() => setExpandEditor(!expandEditor)}
            className={`nav-btns`}
          >
            {expandEditor ? (
              <ArrowsPointingOutIcon className="nav-icons" />
            ) : (
              <ArrowsPointingInIcon className="nav-icons" />
            )}
          </button>
        </div>
      </div>
      <div className="container-body scrollable-container">
        <CodeMirror
          value={code}
          height="100%"
          extensions={[
            python(),
            autocompletion({ activateOnTyping: false }),
            indentUnit.of("    "),
            EditorView.lineWrapping
          ]}
          theme={myTheme}
          onChange={(value) => onCodeChange(value || "")} // Ensure `value` is never `undefined`
          
        />
      </div>
    </div>
  );
};

export default Editor;

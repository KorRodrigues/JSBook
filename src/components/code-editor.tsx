import MonacoEditor, { EditorDidMount,  } from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import { useRef } from 'react';   

interface CodeEditorProps {
  initialValue: string;
  onChange(value:string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({onChange, initialValue}) => {
  const editorRef = useRef<any>();

  const onEditorDidMount: EditorDidMount = (getValue, monaco) => {
    editorRef.current = monaco;
    monaco.onDidChangeModelContent(() => {
      onChange(getValue())
    })

    monaco.getModel()?.updateOptions({tabSize: 2})
  }

  const format = () => {
    const unformated = editorRef.current.getModel().getValue();

    const formated = prettier.format(unformated, {
      parser: ['babel'],
      plugins: [parser],
      useTabs: false,
      semi: true,
      singleQuote: true,
    });

    editorRef.current.setValue(formated);
  }

  return (
    <MonacoEditor
      value={initialValue}
      editorDidMount={onEditorDidMount}
      height="500px"
      language="javascript"
      theme="dark"
      options={{
        wordWrap: 'on',
        minimap: { enabled: false },
        showUnused: false,
        folding: false,
        lineNumbersMinChars: 3,
        fontSize: 16,
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  )
};

export default CodeEditor;
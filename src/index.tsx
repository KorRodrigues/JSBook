import * as esbuild from 'esbuild-wasm'
import ReactDom from 'react-dom'
import { useState, useEffect, useRef } from 'react';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';
import CodeEditor from './components/code-editor'

const App = () => {
  const ref = useRef<any>();
  const iframe = useRef<any>();
  const [input, setInput] = useState('')

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'//'/esbuild.wasm'
    })
  }

  useEffect(() => {
    startService();
  })

  const onClick = async () => {
    if (!ref.current) {
      return
    }

    iframe.current.srcdoc = html;
    
    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [
        unpkgPathPlugin(),
        fetchPlugin(input)
      ],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window'
      }
    })

    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
  }

  const html = `<html><head></head><body><div id="root"></div><script>
    window.addEventListener('message', (event) => {
      try {
        eval(event.data);
      } catch (err) {
        const root = document.getElementById('root');
        root.innerHTML = '<div style="color: red"><h4>Runtime Error</h4><p>' + err + '</p></div>';
        throw err;
      }
    }, false);
  </script></body></html>`

  return ( 
    <div>
      <textarea
        value={input}
        onChange={e=> setInput(e.target.value)}
      />
      <CodeEditor
        initialValue="import React from 'react';"
        onChange={(value) => setInput(value)}
      />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <iframe
        ref={iframe}
        title="code preview"
        sandbox="allow-scripts"
        srcDoc={html}
      />
    </div>
  )
}

ReactDom.render(<App />, document.getElementById('root'))
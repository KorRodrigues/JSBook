import ReactDom from 'react-dom'
import { useState } from 'react';

const App = () => {
  const [input, setInput] = useState('')
  const [code, setCode] = useState('')

  const onClick = () => {
    console.log(input)
  }

  return (
    <div>
      <textarea onChange={e=> setInput(e.target.value)}>{input}</textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  )
}

ReactDom.render(<App />, document.getElementById('root'))
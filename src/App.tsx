import { useState } from 'react'
import '/src/App.css'
import MainPage from "@pages/main-page/main-page.tsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <MainPage/>
    </>
  )
}

export default App

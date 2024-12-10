import Welcome from './welcome.jsx'
import Quiz from './quiz.jsx'
import Finish from './finish.jsx'
import Create from './create.jsx'
import Edit from './edit.jsx'


import './App.css'
import { Routes, Route } from "react-router-dom";

function App() {
  

  return (
    <Routes>
      <Route path="/" element={<Welcome />}/>
      <Route path="/quiz" element={<Quiz />}/>
      <Route path="/done" element={<Finish />}/>
      <Route path="/create" element={<Create />}/>
      <Route path="/edit" element={<Edit />}/>
    </Routes>
  )

}

export default App

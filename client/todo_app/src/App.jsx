
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Todo_app from './Todo_app'
import All_routin from './AllPart/All_routin'
import Private_route from './AllPart/Private_route'

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Todo_app />} />
     
         <Route path='/all-work' element={<Private_route><All_routin/></Private_route>} />
      
      </Routes>
    </BrowserRouter>
  )
}

export default App

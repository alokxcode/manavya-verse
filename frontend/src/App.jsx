import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SigninPage from './pages/Signin'
import SignupPage from './pages/Signup'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} /> 
      <Route path='/signup' element = {<SignupPage />} />
      <Route path='/signin' element = {<SigninPage />} /> 
    </Routes>

  )
}

export default App

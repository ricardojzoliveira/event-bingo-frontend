import { Routes, Route} from 'react-router-dom'
import Homepage from './pages/Homepage.jsx'
import Navbar from './components/Navbar.jsx'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </>
  )
}

export default App;
import '@mantine/core/styles.css';
import './App.css'
import { Route, Routes } from "react-router-dom"
import MainPage from './View/MainPage';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </>
  )
}

export default App

import React from 'react'
import { Routes, Route } from 'react-router-dom'
import BirthdayGreeting from './components/BirthdayGreeting'
import MemoryPage from './components/MemoryPage'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<BirthdayGreeting />} />
      <Route path="/memories" element={<MemoryPage />} />
    </Routes>
  )
}

export default App
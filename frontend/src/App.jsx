import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Upload from './pages/Upload'
import Result from './pages/Result'
import About from './pages/About'
import Root from './components/Root'

function App() {

  const router = createBrowserRouter(createRoutesFromElements(
    <>
      <Route path="/" element={<Root />} >
        <Route index element={<Home />} />
        <Route path="upload" element={<Upload />} />
        <Route path="result/:fileUID" element={<Result />} />
        <Route path="about" element={<About />} />
      </Route>

    </>
  ))

  return (
    <RouterProvider router={router} />
  )
}

export default App
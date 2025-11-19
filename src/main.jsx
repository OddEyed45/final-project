import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router"
import './index.css'
import App from './App.jsx'
import Layout from './routes/Layout.jsx'
import Login from './pages/Login.jsx'
import MuseumTour from './pages/MuseumTour.jsx'
import Post from './pages/Post.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Login />} />
        <Route path="/" element={<App />} />
        <Route path="/create" element={<Post />} />
        <Route path="/louvre" element={<MuseumTour />} />
      </Route>
    </Routes>
  </BrowserRouter>
)

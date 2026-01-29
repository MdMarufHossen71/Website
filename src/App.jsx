import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import BlogIndex from './pages/BlogIndex'
import CategoryPage from './pages/CategoryPage'
import BlogPost from './pages/BlogPost'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:category" element={<CategoryPage />} />
        <Route path="/blog/:category/:slug" element={<BlogPost />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App

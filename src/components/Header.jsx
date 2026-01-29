import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>MD Maruf Hossen</h1>
          </Link>
          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/blog/digital-marketing">Digital Marketing</Link>
            <Link to="/blog/graphic-design">Graphic Design</Link>
            <Link to="/blog/freelancing">Freelancing</Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

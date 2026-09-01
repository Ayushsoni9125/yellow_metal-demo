import { Link, useLocation } from 'react-router-dom'

export default function PageHeader() {
  const { pathname } = useLocation()

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        {/* Logo */}
        <Link to="/" className="site-logo" aria-label="GoldCredit home">
          <div className="site-logo__mark" aria-hidden="true">G</div>
          <span className="site-logo__name">
            Gold<span>Credit</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="site-nav" aria-label="Main navigation">
          <Link
            to="/"
            id="nav-home"
            className={`nav-link${pathname === '/' ? ' is-active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/apply"
            id="nav-apply"
            className={`nav-link${pathname.startsWith('/apply') ? ' is-active' : ''}`}
          >
            Apply
          </Link>
          <Link
            to="/admin"
            id="nav-admin"
            className={`nav-link${pathname.startsWith('/admin') ? ' is-active' : ''}`}
          >
            Partner Dashboard
          </Link>
        </nav>
      </div>
    </header>
  )
}

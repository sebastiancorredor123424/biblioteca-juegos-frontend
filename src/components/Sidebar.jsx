import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Sidebar(){
  const loc = useLocation()
  const active = (path) => loc.pathname === path ? 'side-link active' : 'side-link'

  return (
    <aside className="sidebar">
      <h2 className="brand">GameTracker</h2>
      <nav>
        <ul>
          <li><Link to="/" className={active('/')}>Biblioteca</Link></li>
          <li><Link to="/wishlist" className={active('/wishlist')}>Lista de deseos</Link></li>
          <li><Link to="/community" className={active('/community')}>Comunidad</Link></li>
        </ul>
      </nav>
      <footer className="sidebar-footer">Bienvenido — Tu biblioteca</footer>
    </aside>
  )
}

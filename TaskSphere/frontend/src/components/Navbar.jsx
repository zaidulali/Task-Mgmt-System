import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import authService from '../services/authService'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = authService.isAuthenticated()

  const handleLogout = async () => {
    await authService.logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to={isAuthenticated ? "/tasks" : "/login"} className="navbar-brand">
        TaskSphere
      </Link>

      <div className="navbar-actions">
        {isAuthenticated ? (
          <>
            <Link 
              to="/tasks" 
              className={`navbar-item ${location.pathname === '/tasks' ? 'active' : ''}`}
            >
              Tasks
            </Link>
            <button className="logout-btn" onClick={handleLogout}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className={`navbar-item ${location.pathname === '/login' || location.pathname === '/' ? 'active' : ''}`}
            >
              Log In
            </Link>
            <Link 
              to="/register" 
              className={`navbar-item ${location.pathname === '/register' ? 'active' : ''}`}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar

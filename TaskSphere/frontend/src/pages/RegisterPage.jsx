import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import './RegisterPage.css'

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  })

  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Real-time checklist validation checks
  const isPasswordLongEnough = formData.password.length >= 8
  const doPasswordsMatch = formData.password !== '' && formData.password === formData.passwordConfirm

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear specific errors dynamically as the user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    setServerError('')
  }

  const validateForm = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required.'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters.'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.'
    }

    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Please confirm your password.'
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Passwords do not match.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    setSuccessMessage('')

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await authService.register(
        formData.username,
        formData.email,
        formData.password,
        formData.passwordConfirm
      )

      setSuccessMessage('Registration successful! Redirecting to login page...')
      setFormData({
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
      })

      // Delayed navigation to allow user to read success message
      setTimeout(() => {
        navigate('/login')
      }, 2500)
    } catch (err) {
      if (err && typeof err === 'object') {
        const fieldErrors = {}
        let generalMsg = ''

        // Map API response field-level errors (e.g. username taken) to matching input fields
        Object.keys(err).forEach((key) => {
          // Some backend validation might return field "password_confirm" rather than "passwordConfirm"
          const mappedKey = key === 'password_confirm' ? 'passwordConfirm' : key
          
          if (Array.isArray(err[key])) {
            fieldErrors[mappedKey] = err[key][0]
          } else if (typeof err[key] === 'string') {
            fieldErrors[mappedKey] = err[key]
          } else {
            generalMsg = 'Registration failed. Please check details.'
          }
        })

        setErrors(fieldErrors)
        if (generalMsg || Object.keys(fieldErrors).length === 0) {
          setServerError(generalMsg || 'Registration failed. Please try again.')
        }
      } else {
        setServerError('Unable to connect to the server. Please try again later.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">TaskSphere</h1>
          <p className="register-subtitle">Create an account to manage your projects</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          {serverError && (
            <div className="form-alert form-alert-error">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{serverError}</span>
            </div>
          )}

          {successMessage && (
            <div className="form-alert form-alert-success">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{successMessage}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <div className="input-wrapper">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                className={`form-input ${errors.username ? 'input-error' : ''}`}
                placeholder="e.g. alex_dev"
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                className={`form-input ${errors.password ? 'input-error' : ''}`}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="passwordConfirm">Confirm Password</label>
            <div className="input-wrapper">
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                autoComplete="new-password"
                className={`form-input ${errors.passwordConfirm ? 'input-error' : ''}`}
                placeholder="••••••••"
                value={formData.passwordConfirm}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            {errors.passwordConfirm && <span className="field-error">{errors.passwordConfirm}</span>}
          </div>

          {/* Real-time feedback rules checklist */}
          <div className="password-guidelines">
            <div className={`guideline-item ${isPasswordLongEnough ? 'valid' : ''}`}>
              <div className="bullet" />
              <span>Password must be at least 8 characters</span>
            </div>
            <div className={`guideline-item ${doPasswordsMatch ? 'valid' : ''}`}>
              <div className="bullet" />
              <span>Passwords must match</span>
            </div>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner" />
                <span>Registering...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="register-footer">
          <span>Already have an account?</span>
          <Link to="/login" className="register-link">Log in</Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage

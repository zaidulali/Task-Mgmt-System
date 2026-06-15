const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

const authService = {
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/accounts/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()
    if (!response.ok) {
      throw data
    }

    if (data.access) {
      localStorage.setItem('access_token', data.access)
    }
    if (data.refresh) {
      localStorage.setItem('refresh_token', data.refresh)
    }

    return data
  },

  register: async (username, email, password, passwordConfirm) => {
    const response = await fetch(`${API_BASE_URL}/accounts/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
        password_confirm: passwordConfirm,
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      throw data
    }
    return data
  },

  logout: async () => {
    const accessToken = localStorage.getItem('access_token')
    const refreshToken = localStorage.getItem('refresh_token')

    // Always clear local tokens first for immediate UI response
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')

    if (accessToken && refreshToken) {
      try {
        await fetch(`${API_BASE_URL}/accounts/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refresh: refreshToken }),
        })
      } catch (err) {
        console.error('Error blacklisting token on server:', err)
      }
    }
  },

  getAccessToken: () => {
    return localStorage.getItem('access_token')
  },

  getRefreshToken: () => {
    return localStorage.getItem('refresh_token')
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('access_token')
    if (!token) return false
    
    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const expiry = payload.exp * 1000
      return Date.now() < expiry
    } catch (e) {
      return false
    }
  },
}

export default authService

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

const authService = {
  login: async (username, password) => {
    // TODO: POST /api/accounts/login/
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

  logout: async (refreshToken) => {
    // TODO: POST /api/accounts/logout/
  },
}

export default authService

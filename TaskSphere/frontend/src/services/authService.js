const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

const authService = {
  login: async (username, password) => {
    // TODO: POST /api/accounts/login/
  },

  register: async (username, email, password, passwordConfirm) => {
    // TODO: POST /api/accounts/register/
  },

  logout: async (refreshToken) => {
    // TODO: POST /api/accounts/logout/
  },
}

export default authService

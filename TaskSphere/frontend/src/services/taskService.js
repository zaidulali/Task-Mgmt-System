import authService from './authService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

const getAuthHeaders = () => {
  const token = authService.getAccessToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  }
}

const taskService = {
  getTasks: async () => {
    const response = await fetch(`${API_BASE_URL}/tasks/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    if (!response.ok) {
      throw data
    }
    return data
  },

  getTask: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    if (!response.ok) {
      throw data
    }
    return data
  },

  createTask: async (taskData) => {
    const response = await fetch(`${API_BASE_URL}/tasks/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    })
    const data = await response.json()
    if (!response.ok) {
      throw data
    }
    return data
  },

  updateTask: async (id, taskData) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    })
    const data = await response.json()
    if (!response.ok) {
      throw data
    }
    return data
  },

  deleteTask: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw data
    }
    return true
  },
}

export default taskService

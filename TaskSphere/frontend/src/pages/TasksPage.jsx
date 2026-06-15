import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import taskService from '../services/taskService'
import TaskCard from '../components/TaskCard'
import Navbar from '../components/Navbar'
import './TasksPage.css'

function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Modals Visibility State
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // Selected/Active Task State
  const [selectedTask, setSelectedTask] = useState(null)
  const [deleteTaskId, setDeleteTaskId] = useState(null)

  // Form Field State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
  })
  const [formErrors, setFormErrors] = useState({})

  const navigate = useNavigate()

  // Authentication Guard Check
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login')
    } else {
      loadTasks()
    }
  }, [navigate])

  const loadTasks = async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await taskService.getTasks()
      setTasks(data)
    } catch (err) {
      console.error('Failed to load tasks:', err)
      setError('Failed to fetch tasks from server. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Quick Move Status Operations
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // Optimistic state updates
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
      setTasks(updatedTasks)

      const targetTask = tasks.find((t) => t.id === taskId)
      if (targetTask) {
        await taskService.updateTask(taskId, {
          title: targetTask.title,
          description: targetTask.description || '',
          status: newStatus,
        })
      }
    } catch (err) {
      console.error('Failed to update task status:', err)
      setError('Failed to update task status on the server.')
      loadTasks() // Revert to server state on error
    }
  }

  // Modal Validation & Submission (Create)
  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      setFormErrors({ title: 'Title is required.' })
      return
    }

    try {
      await taskService.createTask(formData)
      setIsCreateOpen(false)
      resetForm()
      loadTasks()
    } catch (err) {
      console.error('Failed to create task:', err)
      setError('Could not create task. Check fields and try again.')
    }
  }

  // Modal Validation & Submission (Edit)
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      setFormErrors({ title: 'Title is required.' })
      return
    }

    try {
      await taskService.updateTask(selectedTask.id, formData)
      setIsEditOpen(false)
      resetForm()
      loadTasks()
    } catch (err) {
      console.error('Failed to edit task:', err)
      setError('Could not save task details. Try again.')
    }
  }

  // Delete Confirm Operation
  const handleDeleteConfirm = async () => {
    try {
      await taskService.deleteTask(deleteTaskId)
      setIsDeleteOpen(false)
      setDeleteTaskId(null)
      loadTasks()
    } catch (err) {
      console.error('Failed to delete task:', err)
      setError('Could not delete the task. Try again.')
    }
  }

  // Action Openers
  const openCreateModal = () => {
    resetForm()
    setIsCreateOpen(true)
  }

  const openEditModal = (task) => {
    setSelectedTask(task)
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
    })
    setFormErrors({})
    setIsEditOpen(true)
  }

  const openDeleteModal = (id) => {
    setDeleteTaskId(id)
    setIsDeleteOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'To Do',
    })
    setFormErrors({})
    setSelectedTask(null)
  }

  // Filter Tasks by Search Query
  const filteredTasks = tasks.filter((task) =>
    task?.title?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
    task?.description?.toLowerCase()?.includes(searchQuery.toLowerCase())
  )

  const todoTasks = filteredTasks.filter((task) => task.status === 'To Do')
  const inProgressTasks = filteredTasks.filter((task) => task.status === 'In Progress')
  const completedTasks = filteredTasks.filter((task) => task.status === 'Completed')

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        {/* Header Title Section */}
        <div className="dashboard-header">
          <div className="header-title-section">
            <h1 className="dashboard-title">Task Board</h1>
            <p className="dashboard-subtitle">Organize, track, and complete your tasks</p>
          </div>

          <div className="header-actions">
            <div className="search-wrapper">
              <svg 
                className="search-icon" 
                width="16" 
                height="16" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button className="create-btn" onClick={openCreateModal}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Task</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="alert-banner">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Kanban Board Columns Section */}
        <div className="kanban-board">
          {/* To Do Column */}
          <div className="kanban-column">
            <div className="column-header">
              <div className="column-title-group">
                <div className="column-dot todo-dot" />
                <span className="column-title">To Do</span>
              </div>
              <span className="column-count">{todoTasks.length}</span>
            </div>

            <div className="task-list">
              {isLoading ? (
                <div className="skeleton-card" />
              ) : todoTasks.length > 0 ? (
                todoTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                    onStatusChange={handleStatusChange}
                  />
                ))
              ) : (
                <div className="empty-column-state">
                  <span className="empty-state-title">No Tasks</span>
                  <span className="empty-state-subtitle">Get started by creating a task</span>
                </div>
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="kanban-column">
            <div className="column-header">
              <div className="column-title-group">
                <div className="column-dot inprogress-dot" />
                <span className="column-title">In Progress</span>
              </div>
              <span className="column-count">{inProgressTasks.length}</span>
            </div>

            <div className="task-list">
              {isLoading ? (
                <div className="skeleton-card" />
              ) : inProgressTasks.length > 0 ? (
                inProgressTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                    onStatusChange={handleStatusChange}
                  />
                ))
              ) : (
                <div className="empty-column-state">
                  <span className="empty-state-title">No Active Tasks</span>
                  <span className="empty-state-subtitle">Shift tasks here when you start them</span>
                </div>
              )}
            </div>
          </div>

          {/* Completed Column */}
          <div className="kanban-column">
            <div className="column-header">
              <div className="column-title-group">
                <div className="column-dot completed-dot" />
                <span className="column-title">Completed</span>
              </div>
              <span className="column-count">{completedTasks.length}</span>
            </div>

            <div className="task-list">
              {isLoading ? (
                <div className="skeleton-card" />
              ) : completedTasks.length > 0 ? (
                completedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                    onStatusChange={handleStatusChange}
                  />
                ))
              ) : (
                <div className="empty-column-state">
                  <span className="empty-state-title">No Tasks Done</span>
                  <span className="empty-state-subtitle">Complete your tasks to show them here</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MODAL: CREATE TASK */}
        {isCreateOpen && (
          <div className="modal-backdrop" onClick={() => setIsCreateOpen(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">New Task</h2>
                <button className="modal-close-btn" onClick={() => setIsCreateOpen(false)}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form className="modal-form" onSubmit={handleCreateSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="create-title">Title</label>
                  <input
                    id="create-title"
                    name="title"
                    type="text"
                    className={`form-input ${formErrors.title ? 'input-error' : ''}`}
                    placeholder="E.g. Design homepage layout"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                  {formErrors.title && <span className="field-error">{formErrors.title}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="create-description">Description</label>
                  <textarea
                    id="create-description"
                    name="description"
                    className="form-input modal-textarea"
                    placeholder="E.g. Implement the dashboard container grid styling using CSS Variables"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="create-status">Status</label>
                  <select
                    id="create-status"
                    name="status"
                    className="form-input modal-select"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="create-btn">
                    Add Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT TASK */}
        {isEditOpen && (
          <div className="modal-backdrop" onClick={() => setIsEditOpen(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Edit Task</h2>
                <button className="modal-close-btn" onClick={() => setIsEditOpen(false)}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form className="modal-form" onSubmit={handleEditSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-title">Title</label>
                  <input
                    id="edit-title"
                    name="title"
                    type="text"
                    className={`form-input ${formErrors.title ? 'input-error' : ''}`}
                    placeholder="E.g. Design homepage layout"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                  {formErrors.title && <span className="field-error">{formErrors.title}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-description">Description</label>
                  <textarea
                    id="edit-description"
                    name="description"
                    className="form-input modal-textarea"
                    placeholder="E.g. Implement the dashboard container grid styling using CSS Variables"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-status">Status</label>
                  <select
                    id="edit-status"
                    name="status"
                    className="form-input modal-select"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setIsEditOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="create-btn">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: DELETE CONFIRMATION */}
        {isDeleteOpen && (
          <div className="modal-backdrop" onClick={() => setIsDeleteOpen(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Delete Task</h2>
                <button className="modal-close-btn" onClick={() => setIsDeleteOpen(false)}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="dashboard-subtitle">
                Are you sure you want to delete this task? This action cannot be undone.
              </p>

              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setIsDeleteOpen(false)}>
                  Cancel
                </button>
                <button className="btn-danger" onClick={handleDeleteConfirm}>
                  Delete Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default TasksPage

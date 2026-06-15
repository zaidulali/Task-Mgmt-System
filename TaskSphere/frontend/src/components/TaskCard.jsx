import React from 'react'
import './TaskCard.css'

function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const statusClass = task?.status?.toLowerCase()?.replace(' ', '') || 'todo'

  const handleMoveLeft = () => {
    if (task.status === 'Completed') {
      onStatusChange(task.id, 'In Progress')
    } else if (task.status === 'In Progress') {
      onStatusChange(task.id, 'To Do')
    }
  }

  const handleMoveRight = () => {
    if (task.status === 'To Do') {
      onStatusChange(task.id, 'In Progress')
    } else if (task.status === 'In Progress') {
      onStatusChange(task.id, 'Completed')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className={`task-card ${statusClass}`}>
      <div className="card-header">
        <h3 className="card-title">{task?.title}</h3>
      </div>

      {task?.description && (
        <p className="card-body">{task.description}</p>
      )}

      <div className="card-footer">
        <div className="card-date">
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDate(task?.created_at)}</span>
        </div>

        <div className="card-actions">
          {/* Quick status navigation buttons */}
          <div className="status-navigation">
            <button 
              className="nav-arrow" 
              onClick={handleMoveLeft}
              disabled={task?.status === 'To Do'}
              title="Move left"
            >
              &larr;
            </button>
            <button 
              className="nav-arrow" 
              onClick={handleMoveRight}
              disabled={task?.status === 'Completed'}
              title="Move right"
            >
              &rarr;
            </button>
          </div>

          <button 
            className="card-btn card-btn-edit" 
            onClick={() => onEdit(task)}
            title="Edit Task"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button 
            className="card-btn card-btn-delete" 
            onClick={() => onDelete(task.id)}
            title="Delete Task"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskCard

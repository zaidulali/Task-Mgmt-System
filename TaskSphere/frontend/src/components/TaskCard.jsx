// TaskCard component placeholder
function TaskCard({ task }) {
  return (
    <div>
      <h3>{task?.title}</h3>
      <p>{task?.status}</p>
    </div>
  )
}

export default TaskCard

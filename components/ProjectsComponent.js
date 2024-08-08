import { useState, useEffect } from 'react'

export default function ProjectsComponent() {
  const [projects, setProjects] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [plannedEndDate, setPlannedEndDate] = useState('')
  const [statusId, setStatusId] = useState('')
  const [accountId, setAccountId] = useState('')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    const res = await fetch('/api/projectsApi')
    const data = await res.json()
    setProjects(data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const project = { name, description, startDate, plannedEndDate, statusId, accountId }
    
    if (editingId) {
      await updateProject(editingId, project)
    } else {
      await createProject(project)
    }

    resetForm()
    fetchProjects()
  }

  const createProject = async (project) => {
    const res = await fetch('/api/projectsApi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    })
    if (!res.ok) {
      console.error('Failed to create project')
    }
  }

const updateProject = async (id, projectData) => {
  const response = await fetch(`/api/projectsApi?id=${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    throw new Error('Failed to update project');
  }

  return response.json();
}

const deleteProject = async (id) => {
  try {
    const res = await fetch(`/api/projectsApi?id=${id}`, {
      method: 'DELETE',
    });
    
    if (res.ok) {
      fetchProjects(); // Обновляем список проектов после успешного удаления
    } else {
      // Если сервер вернул ошибку, выбрасываем исключение
      throw new Error('Server responded with an error');
    }
  } catch (error) {
    console.error('Failed to delete project:', error);
  }
}


  const editProject = (project) => {
    setName(project.name)
    setDescription(project.description)
    setStartDate(project.startDate.split('T')[0])
    setPlannedEndDate(project.plannedEndDate.split('T')[0])
    setStatusId(project.statusId)
    setAccountId(project.accountId)
    setEditingId(project.id)
  }

  const resetForm = () => {
    setName('')
    setDescription('')
    setStartDate('')
    setPlannedEndDate('')
    setStatusId('')
    setAccountId('')
    setEditingId(null)
  }

  return (
    <div className="container">
      <h1 className="my-4">Project Management</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project Name"
              required
            />
          </div>
          <div className="col-md-6">
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              value={plannedEndDate}
              onChange={(e) => setPlannedEndDate(e.target.value)}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              value={statusId}
              onChange={(e) => setStatusId(e.target.value)}
              placeholder="Status ID"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              placeholder="Account ID"
              required
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary me-2">
              {editingId ? 'Update' : 'Create'} Project
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Start Date</th>
              <th>Planned End Date</th>
              <th>Status ID</th>
              <th>Account ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.id}</td>
                <td>{project.name}</td>
                <td>{project.description}</td>
                <td>{new Date(project.startDate).toLocaleDateString()}</td>
                <td>{new Date(project.plannedEndDate).toLocaleDateString()}</td>
                <td>{project.statusId}</td>
                <td>{project.accountId}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-outline-primary me-2" 
                    onClick={() => editProject(project)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger" 
                    onClick={() => deleteProject(project.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

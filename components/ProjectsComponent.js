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
    const res = await fetch('/api/projects')
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
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    })
    if (!res.ok) {
      console.error('Failed to create project')
    }
  }

const updateProject = async (id, projectData) => {
  const response = await fetch(`/api/projects?id=${id}`, {
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
    const res = await fetch(`/api/projects?id=${id}`, {
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
    <div>
      <h1>Project Management</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project Name"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <input
          type="date"
          value={plannedEndDate}
          onChange={(e) => setPlannedEndDate(e.target.value)}
          required
        />
        <input
          type="number"
          value={statusId}
          onChange={(e) => setStatusId(e.target.value)}
          placeholder="Status ID"
          required
        />
        <input
          type="number"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          placeholder="Account ID"
          required
        />
        <button type="submit">{editingId ? 'Update' : 'Create'} Project</button>
        {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <p>Start Date: {new Date(project.startDate).toLocaleDateString()}</p>
            <p>Planned End Date: {new Date(project.plannedEndDate).toLocaleDateString()}</p>
            <p>Status: {project.status.status}</p>
            <p>Account: {project.account.name}</p>
            <button onClick={() => editProject(project)}>Edit</button>
            <button onClick={() => deleteProject(project.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

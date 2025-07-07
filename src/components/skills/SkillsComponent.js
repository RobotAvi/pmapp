import { useState, useEffect } from 'react'

export default function SkillsComponent() {
  const [skills, setSkills] = useState([])
  const [skillName, setSkillName] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/skillsApi')
      const data = await res.json()
      setSkills(data)
    } catch (error) {
      console.error('Failed to fetch skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!skillName.trim() || !description.trim()) {
      alert('Пожалуйста, заполните все поля')
      return
    }

    const skill = { skillName: skillName.trim(), description: description.trim() }
    
    try {
      if (editingId) {
        await updateSkill(editingId, skill)
      } else {
        await createSkill(skill)
      }
      resetForm()
      fetchSkills()
    } catch (error) {
      console.error('Error saving skill:', error)
      alert('Ошибка при сохранении навыка')
    }
  }

  const createSkill = async (skill) => {
    const res = await fetch('/api/skillsApi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skill),
    })
    if (!res.ok) {
      throw new Error('Failed to create skill')
    }
  }

  const updateSkill = async (id, skillData) => {
    const response = await fetch(`/api/skillsApi?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(skillData),
    });

    if (!response.ok) {
      throw new Error('Failed to update skill');
    }

    return response.json();
  }

  const deleteSkill = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить этот навык?')) {
      return
    }

    try {
      const res = await fetch(`/api/skillsApi?id=${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        fetchSkills()
      } else {
        throw new Error('Server responded with an error');
      }
    } catch (error) {
      console.error('Failed to delete skill:', error);
      alert('Ошибка при удалении навыка')
    }
  }

  const editSkill = (skill) => {
    setSkillName(skill.skillName)
    setDescription(skill.description)
    setEditingId(skill.id)
  }

  const resetForm = () => {
    setSkillName('')
    setDescription('')
    setEditingId(null)
  }

  const filteredSkills = skills.filter(skill =>
    skill.skillName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getEmployeeCount = (skill) => {
    return skill.employeeSkills?.length || 0
  }

  const getEmployeeList = (skill) => {
    return skill.employeeSkills?.map(es => `${es.employee.firstName} ${es.employee.lastName}`).join(', ') || 'Нет'
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center my-4">
        <h1>🎯 Управление навыками</h1>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Поиск навыков..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
      </div>

      {/* Форма добавления/редактирования */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            {editingId ? '✏️ Редактировать навык' : '➕ Добавить новый навык'}
          </h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Название навыка *</label>
                <input
                  type="text"
                  className="form-control"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="Например: JavaScript, React, Node.js"
                  required
                />
              </div>
              <div className="col-md-8">
                <label className="form-label">Описание *</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Опишите навык и его применение..."
                  required
                />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary me-2">
                  {editingId ? '💾 Обновить' : '➕ Добавить'} навык
                </button>
                {editingId && (
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    ❌ Отмена
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Статистика */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">🎯 Всего навыков</h5>
              <h2>{skills.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">👥 С сотрудниками</h5>
              <h2>{skills.filter(s => s.employeeSkills?.length > 0).length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">📊 Средний уровень</h5>
              <h2>
                {skills.length > 0 ? 
                  Math.round(
                    skills.reduce((sum, skill) => {
                      const avgLevel = skill.employeeSkills?.length > 0 ?
                        skill.employeeSkills.reduce((levelSum, es) => levelSum + es.proficiencyLevel, 0) / skill.employeeSkills.length :
                        0;
                      return sum + avgLevel;
                    }, 0) / skills.length * 10
                  ) / 10 : 0
                }
              </h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h5 className="card-title">🔍 Найдено</h5>
              <h2>{filteredSkills.length}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Таблица навыков */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">📋 Список навыков ({filteredSkills.length})</h5>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Загрузка...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-light">
                  <tr>
                    <th>🎯 Навык</th>
                    <th>📝 Описание</th>
                    <th>👥 Сотрудники</th>
                    <th>📊 Количество</th>
                    <th>🔧 Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSkills.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        {searchTerm ? '🔍 Навыки не найдены' : '🎯 Нет навыков'}
                      </td>
                    </tr>
                  ) : (
                    filteredSkills.map((skill) => (
                      <tr key={skill.id}>
                        <td>
                          <strong className="text-primary">{skill.skillName}</strong>
                        </td>
                        <td>
                          <small className="text-muted">{skill.description}</small>
                        </td>
                        <td>
                          <small title={getEmployeeList(skill)}>
                            {getEmployeeList(skill).length > 50 ? 
                              getEmployeeList(skill).substring(0, 47) + '...' : 
                              getEmployeeList(skill)
                            }
                          </small>
                        </td>
                        <td>
                          <span className={`badge ${
                            getEmployeeCount(skill) === 0 ? 'bg-secondary' :
                            getEmployeeCount(skill) <= 2 ? 'bg-warning' :
                            getEmployeeCount(skill) <= 5 ? 'bg-info' :
                            'bg-success'
                          }`}>
                            {getEmployeeCount(skill)} чел.
                          </span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm" role="group">
                            <button 
                              className="btn btn-outline-primary" 
                              onClick={() => editSkill(skill)}
                              title="Редактировать"
                            >
                              ✏️
                            </button>
                            <button 
                              className="btn btn-outline-danger" 
                              onClick={() => deleteSkill(skill.id)}
                              title="Удалить"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Популярные навыки */}
      {skills.length > 0 && (
        <div className="card mt-4">
          <div className="card-header">
            <h5 className="mb-0">📈 Топ навыков по популярности</h5>
          </div>
          <div className="card-body">
            <div className="row">
              {skills
                .sort((a, b) => getEmployeeCount(b) - getEmployeeCount(a))
                .slice(0, 6)
                .map((skill, index) => (
                  <div key={skill.id} className="col-md-4 mb-3">
                    <div className={`card ${
                      index === 0 ? 'border-success' :
                      index === 1 ? 'border-info' :
                      index === 2 ? 'border-warning' :
                      'border-secondary'
                    }`}>
                      <div className="card-body text-center">
                        <h6 className="card-title">
                          {index === 0 && '🥇 '}
                          {index === 1 && '🥈 '}
                          {index === 2 && '🥉 '}
                          {skill.skillName}
                        </h6>
                        <h4 className={`${
                          index === 0 ? 'text-success' :
                          index === 1 ? 'text-info' :
                          index === 2 ? 'text-warning' :
                          'text-secondary'
                        }`}>
                          {getEmployeeCount(skill)}
                        </h4>
                        <small className="text-muted">сотрудников</small>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
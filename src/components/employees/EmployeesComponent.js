import { useState, useEffect } from 'react'

export default function EmployeesComponent() {
  const [employees, setEmployees] = useState([])
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [position, setPosition] = useState('')
  const [employmentType, setEmploymentType] = useState('Full-time')
  const [hireDate, setHireDate] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/employeesApi')
      const data = await res.json()
      setEmployees(data)
    } catch (error) {
      console.error('Failed to fetch employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!firstName || !lastName || !position || !hireDate || !contactInfo) {
      alert('Пожалуйста, заполните все обязательные поля')
      return
    }

    const employee = { 
      firstName, 
      lastName, 
      position, 
      employmentType, 
      hireDate, 
      contactInfo 
    }
    
    try {
      if (editingId) {
        await updateEmployee(editingId, employee)
      } else {
        await createEmployee(employee)
      }
      resetForm()
      fetchEmployees()
    } catch (error) {
      console.error('Error saving employee:', error)
      alert('Ошибка при сохранении сотрудника')
    }
  }

  const createEmployee = async (employee) => {
    const res = await fetch('/api/employeesApi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee),
    })
    if (!res.ok) {
      throw new Error('Failed to create employee')
    }
  }

  const updateEmployee = async (id, employeeData) => {
    const response = await fetch(`/api/employeesApi?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      throw new Error('Failed to update employee');
    }

    return response.json();
  }

  const deleteEmployee = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
      return
    }

    try {
      const res = await fetch(`/api/employeesApi?id=${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        fetchEmployees()
      } else {
        throw new Error('Server responded with an error');
      }
    } catch (error) {
      console.error('Failed to delete employee:', error);
      alert('Ошибка при удалении сотрудника')
    }
  }

  const editEmployee = (employee) => {
    setFirstName(employee.firstName)
    setLastName(employee.lastName)
    setPosition(employee.position)
    setEmploymentType(employee.employmentType)
    setHireDate(employee.hireDate.split('T')[0])
    setContactInfo(employee.contactInfo)
    setEditingId(employee.id)
  }

  const resetForm = () => {
    setFirstName('')
    setLastName('')
    setPosition('')
    setEmploymentType('Full-time')
    setHireDate('')
    setContactInfo('')
    setEditingId(null)
  }

  const filteredEmployees = employees.filter(employee =>
    employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.contactInfo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getEmployeeSkills = (employee) => {
    return employee.employeeSkills?.map(es => es.skill.skillName).join(', ') || 'Нет навыков'
  }

  const getCurrentSalary = (employee) => {
    return employee.salaries?.[0]?.amount || 'Не указана'
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center my-4">
        <h1>👥 Управление сотрудниками</h1>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Поиск сотрудников..."
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
            {editingId ? '✏️ Редактировать сотрудника' : '➕ Добавить нового сотрудника'}
          </h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Имя *</label>
                <input
                  type="text"
                  className="form-control"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Введите имя"
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Фамилия *</label>
                <input
                  type="text"
                  className="form-control"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Введите фамилию"
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Должность *</label>
                <input
                  type="text"
                  className="form-control"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Введите должность"
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Тип трудоустройства *</label>
                <select
                  className="form-select"
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  required
                >
                  <option value="Full-time">Полная занятость</option>
                  <option value="Part-time">Частичная занятость</option>
                  <option value="Contract">Контракт</option>
                  <option value="Freelance">Фрилансер</option>
                  <option value="Intern">Стажер</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Дата найма *</label>
                <input
                  type="date"
                  className="form-control"
                  value={hireDate}
                  onChange={(e) => setHireDate(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Контактная информация *</label>
                <input
                  type="email"
                  className="form-control"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary me-2">
                  {editingId ? '💾 Обновить' : '➕ Добавить'} сотрудника
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
              <h5 className="card-title">👥 Всего сотрудников</h5>
              <h2>{employees.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">💼 Полная занятость</h5>
              <h2>{employees.filter(e => e.employmentType === 'Full-time').length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">📋 Контракт</h5>
              <h2>{employees.filter(e => e.employmentType === 'Contract').length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h5 className="card-title">🎯 Активные проекты</h5>
              <h2>{employees.filter(e => e.projectAssignments?.length > 0).length}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Таблица сотрудников */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">📋 Список сотрудников ({filteredEmployees.length})</h5>
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
                    <th>👤 ФИО</th>
                    <th>💼 Должность</th>
                    <th>📋 Тип занятости</th>
                    <th>📅 Дата найма</th>
                    <th>📧 Контакты</th>
                    <th>🎯 Навыки</th>
                    <th>💰 Зарплата</th>
                    <th>🔧 Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-muted">
                        {searchTerm ? '🔍 Сотрудники не найдены' : '👥 Нет сотрудников'}
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <tr key={employee.id}>
                        <td>
                          <strong>{employee.firstName} {employee.lastName}</strong>
                        </td>
                        <td>
                          <span className="badge bg-secondary">{employee.position}</span>
                        </td>
                        <td>
                          <span className={`badge ${
                            employee.employmentType === 'Full-time' ? 'bg-success' :
                            employee.employmentType === 'Contract' ? 'bg-info' :
                            employee.employmentType === 'Part-time' ? 'bg-warning' :
                            'bg-light text-dark'
                          }`}>
                            {employee.employmentType}
                          </span>
                        </td>
                        <td>{new Date(employee.hireDate).toLocaleDateString('ru-RU')}</td>
                        <td>
                          <a href={`mailto:${employee.contactInfo}`} className="text-decoration-none">
                            {employee.contactInfo}
                          </a>
                        </td>
                        <td>
                          <small className="text-muted">{getEmployeeSkills(employee)}</small>
                        </td>
                        <td>
                          <small>{getCurrentSalary(employee)}</small>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm" role="group">
                            <button 
                              className="btn btn-outline-primary" 
                              onClick={() => editEmployee(employee)}
                              title="Редактировать"
                            >
                              ✏️
                            </button>
                            <button 
                              className="btn btn-outline-danger" 
                              onClick={() => deleteEmployee(employee.id)}
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
    </div>
  )
}
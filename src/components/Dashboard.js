import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: { total: 0, active: 0, completed: 0, onHold: 0 },
    employees: { total: 0, fullTime: 0, contract: 0, withProjects: 0 },
    accounts: { total: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentEmployees, setRecentEmployees] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Получаем данные о проектах
      const projectsRes = await fetch('/api/projectsApi');
      const projects = await projectsRes.json();

      // Получаем данные о сотрудниках
      const employeesRes = await fetch('/api/employeesApi');
      const employees = await employeesRes.json();

      // Получаем данные об аккаунтах
      const accountsRes = await fetch('/api/accountsApi');
      const accounts = await accountsRes.json();

      // Обрабатываем статистику
      const projectStats = {
        total: projects.length,
        active: projects.filter(p => p.status?.status === 'Active').length,
        completed: projects.filter(p => p.status?.status === 'Completed').length,
        onHold: projects.filter(p => p.status?.status === 'On Hold').length,
      };

      const employeeStats = {
        total: employees.length,
        fullTime: employees.filter(e => e.employmentType === 'Full-time').length,
        contract: employees.filter(e => e.employmentType === 'Contract').length,
        withProjects: employees.filter(e => e.projectAssignments?.length > 0).length,
      };

      setStats({
        projects: projectStats,
        employees: employeeStats,
        accounts: { total: accounts.length }
      });

      // Последние проекты (первые 5)
      setRecentProjects(projects.slice(0, 5));
      
      // Недавно добавленные сотрудники (первые 5)
      setRecentEmployees(employees.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = (current, total) => {
    return total > 0 ? Math.round((current / total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
          <p className="mt-3">Загрузка дашборда...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      {/* Заголовок */}
      <div className="row mb-4">
        <div className="col">
          <h1 className="display-4 mb-2">📊 Дашборд</h1>
          <p className="lead text-muted">Обзор системы управления проектами и ресурсами</p>
        </div>
      </div>

      {/* Основная статистика */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>📋 Проекты</h4>
                  <h2 className="mb-0">{stats.projects.total}</h2>
                  <small>Всего проектов</small>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-project-diagram fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>👥 Сотрудники</h4>
                  <h2 className="mb-0">{stats.employees.total}</h2>
                  <small>Всего сотрудников</small>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-users fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-info text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>🏢 Аккаунты</h4>
                  <h2 className="mb-0">{stats.accounts.total}</h2>
                  <small>Клиентские аккаунты</small>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-building fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-warning text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>🎯 Активность</h4>
                  <h2 className="mb-0">{stats.employees.withProjects}</h2>
                  <small>Сотрудников на проектах</small>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-chart-line fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Детальная статистика */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">📊 Статистика проектов</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>✅ Активные проекты</span>
                  <span>{stats.projects.active} из {stats.projects.total}</span>
                </div>
                <div className="progress">
                  <div 
                    className="progress-bar bg-success" 
                    style={{ width: `${getProgressPercentage(stats.projects.active, stats.projects.total)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>🏁 Завершенные проекты</span>
                  <span>{stats.projects.completed} из {stats.projects.total}</span>
                </div>
                <div className="progress">
                  <div 
                    className="progress-bar bg-primary" 
                    style={{ width: `${getProgressPercentage(stats.projects.completed, stats.projects.total)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>⏸️ Приостановленные</span>
                  <span>{stats.projects.onHold} из {stats.projects.total}</span>
                </div>
                <div className="progress">
                  <div 
                    className="progress-bar bg-warning" 
                    style={{ width: `${getProgressPercentage(stats.projects.onHold, stats.projects.total)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">👥 Статистика сотрудников</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>💼 Полная занятость</span>
                  <span>{stats.employees.fullTime} из {stats.employees.total}</span>
                </div>
                <div className="progress">
                  <div 
                    className="progress-bar bg-success" 
                    style={{ width: `${getProgressPercentage(stats.employees.fullTime, stats.employees.total)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>📋 Контрактники</span>
                  <span>{stats.employees.contract} из {stats.employees.total}</span>
                </div>
                <div className="progress">
                  <div 
                    className="progress-bar bg-info" 
                    style={{ width: `${getProgressPercentage(stats.employees.contract, stats.employees.total)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>🎯 Назначены на проекты</span>
                  <span>{stats.employees.withProjects} из {stats.employees.total}</span>
                </div>
                <div className="progress">
                  <div 
                    className="progress-bar bg-warning" 
                    style={{ width: `${getProgressPercentage(stats.employees.withProjects, stats.employees.total)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Последние проекты и сотрудники */}
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">📋 Недавние проекты</h5>
            </div>
            <div className="card-body">
              {recentProjects.length === 0 ? (
                <p className="text-muted text-center">Нет проектов</p>
              ) : (
                <div className="list-group list-group-flush">
                  {recentProjects.map((project, index) => (
                    <div key={project.id} className="list-group-item px-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{project.name}</h6>
                          <p className="mb-1 text-muted small">{project.description?.substring(0, 60)}...</p>
                          <small className="text-muted">
                            📅 {new Date(project.startDate).toLocaleDateString('ru-RU')}
                          </small>
                        </div>
                        <span className={`badge ${
                          project.status?.status === 'Active' ? 'bg-success' :
                          project.status?.status === 'Completed' ? 'bg-primary' :
                          project.status?.status === 'On Hold' ? 'bg-warning' :
                          'bg-secondary'
                        }`}>
                          {project.status?.status || 'Без статуса'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">👥 Недавние сотрудники</h5>
            </div>
            <div className="card-body">
              {recentEmployees.length === 0 ? (
                <p className="text-muted text-center">Нет сотрудников</p>
              ) : (
                <div className="list-group list-group-flush">
                  {recentEmployees.map((employee, index) => (
                    <div key={employee.id} className="list-group-item px-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{employee.firstName} {employee.lastName}</h6>
                          <p className="mb-1 text-muted small">{employee.position}</p>
                          <small className="text-muted">
                            📅 {new Date(employee.hireDate).toLocaleDateString('ru-RU')}
                          </small>
                        </div>
                        <span className={`badge ${
                          employee.employmentType === 'Full-time' ? 'bg-success' :
                          employee.employmentType === 'Contract' ? 'bg-info' :
                          employee.employmentType === 'Part-time' ? 'bg-warning' :
                          'bg-secondary'
                        }`}>
                          {employee.employmentType}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

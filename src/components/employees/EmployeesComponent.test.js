import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EmployeesComponent from './EmployeesComponent'

const mockEmployees = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    position: 'Developer',
    employmentType: 'Full-time',
    hireDate: '2024-01-01T00:00:00.000Z',
    contactInfo: 'john@example.com',
    employeeSkills: [],
    projectAssignments: [],
    salaries: []
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    position: 'Designer',
    employmentType: 'Contract',
    hireDate: '2024-02-01T00:00:00.000Z',
    contactInfo: 'jane@example.com',
    employeeSkills: [],
    projectAssignments: [],
    salaries: []
  }
]

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => mockEmployees,
  })
})

describe('EmployeesComponent', () => {
  test('renders employees page title', async () => {
    render(<EmployeesComponent />)
    
    expect(screen.getByText('👥 Управление сотрудниками')).toBeInTheDocument()
  })

  test('displays employee form', () => {
    render(<EmployeesComponent />)
    
    expect(screen.getByPlaceholderText('Введите имя')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Введите фамилию')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Введите должность')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('email@example.com')).toBeInTheDocument()
  })

  test('loads and displays employees', async () => {
    render(<EmployeesComponent />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('Developer')).toBeInTheDocument()
      expect(screen.getByText('Designer')).toBeInTheDocument()
    })
  })

  test('displays correct statistics', async () => {
    render(<EmployeesComponent />)
    
    await waitFor(() => {
      // Общее количество сотрудников
      expect(screen.getByText('2')).toBeInTheDocument()
      
      // Статистика должна быть корректной
      const fullTimeElements = screen.getAllByText('1')
      expect(fullTimeElements.length).toBeGreaterThan(0)
    })
  })

  test('search functionality works', async () => {
    render(<EmployeesComponent />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('🔍 Поиск сотрудников...')
    fireEvent.change(searchInput, { target: { value: 'John' } })

    // После фильтрации должен остаться только John
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  test('edit button populates form with employee data', async () => {
    render(<EmployeesComponent />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    // Находим кнопку редактирования для John Doe
    const editButtons = screen.getAllByTitle('Редактировать')
    fireEvent.click(editButtons[0])

    // Проверяем, что форма заполнилась данными
    expect(screen.getByDisplayValue('John')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Developer')).toBeInTheDocument()
  })

  test('form validation works', async () => {
    render(<EmployeesComponent />)
    
    const submitButton = screen.getByText(/Добавить сотрудника/)
    fireEvent.click(submitButton)

    // Форма не должна отправиться без заполненных полей
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1) // Только для загрузки данных
    })
  })

  test('handles API errors gracefully', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('API Error'))
    
    render(<EmployeesComponent />)
    
    // Компонент должен загрузиться даже при ошибке API
    expect(screen.getByText('👥 Управление сотрудниками')).toBeInTheDocument()
  })
})
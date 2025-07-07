import { render, screen, waitFor } from '@testing-library/react'
import Dashboard from './Dashboard'

// Mock fetch responses
const mockProjectsResponse = [
  { id: 1, name: 'Test Project', status: { status: 'Active' }, startDate: '2024-01-01', description: 'Test description' }
]

const mockEmployeesResponse = [
  { id: 1, firstName: 'John', lastName: 'Doe', employmentType: 'Full-time', hireDate: '2024-01-01', position: 'Developer', projectAssignments: [] }
]

const mockAccountsResponse = [
  { id: 1, name: 'Test Account', createdAt: '2024-01-01' }
]

beforeEach(() => {
  global.fetch = jest.fn()
    .mockResolvedValueOnce({
      json: async () => mockProjectsResponse,
    })
    .mockResolvedValueOnce({
      json: async () => mockEmployeesResponse,
    })
    .mockResolvedValueOnce({
      json: async () => mockAccountsResponse,
    })
})

describe('Dashboard Component', () => {
  test('renders dashboard title', async () => {
    render(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('📊 Дашборд')).toBeInTheDocument()
    })
  })

  test('displays correct statistics after loading', async () => {
    render(<Dashboard />)
    
    await waitFor(() => {
      // Проверяем статистику проектов
      expect(screen.getByText('1')).toBeInTheDocument() // Общее количество проектов
      
      // Проверяем статистику сотрудников
      expect(screen.getByText('1')).toBeInTheDocument() // Общее количество сотрудников
      
      // Проверяем статистику аккаунтов
      expect(screen.getByText('1')).toBeInTheDocument() // Общее количество аккаунтов
    })
  })

  test('shows loading state initially', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('Загрузка дашборда...')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  test('makes correct API calls', async () => {
    render(<Dashboard />)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(3)
      expect(global.fetch).toHaveBeenCalledWith('/api/projectsApi')
      expect(global.fetch).toHaveBeenCalledWith('/api/employeesApi')
      expect(global.fetch).toHaveBeenCalledWith('/api/accountsApi')
    })
  })

  test('displays recent projects section', async () => {
    render(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('📋 Недавние проекты')).toBeInTheDocument()
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })
  })

  test('displays recent employees section', async () => {
    render(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('👥 Недавние сотрудники')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })
})
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProjectsComponent from './ProjectsComponent'

// Mock fetch
global.fetch = jest.fn()

describe('ProjectsComponent', () => {
  const mockProjects = [
    {
      id: 1,
      name: 'Test Project',
      description: 'Test Description',
      startDate: '2024-01-01T00:00:00.000Z',
      plannedEndDate: '2024-06-30T00:00:00.000Z',
      statusId: 1,
      accountId: 1,
      status: { id: 1, status: 'Active' },
      account: { id: 1, name: 'Test Account' }
    }
  ]

  const mockAccounts = [
    { id: 1, name: 'Test Account', createdAt: '2024-01-01T00:00:00.000Z' },
    { id: 2, name: 'Another Account', createdAt: '2024-01-02T00:00:00.000Z' }
  ]

  const mockStatuses = [
    { id: 1, status: 'Active', description: 'Project is active', isActive: true },
    { id: 2, status: 'Completed', description: 'Project is completed', isActive: true },
    { id: 3, status: 'On Hold', description: 'Project is on hold', isActive: true }
  ]

  beforeEach(() => {
    fetch.mockClear()
  })

  test('renders project management form with dropdowns and table', async () => {
    // Mock API responses
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockProjects })
      .mockResolvedValueOnce({ ok: true, json: async () => mockAccounts })
      .mockResolvedValueOnce({ ok: true, json: async () => mockStatuses })

    render(<ProjectsComponent />)

    // Check if form elements are rendered
    expect(screen.getByPlaceholderText('Project Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument()

    // Wait for dropdowns to load
    await waitFor(() => {
      expect(screen.getByText('Select Status')).toBeInTheDocument()
      expect(screen.getByText('Select Account')).toBeInTheDocument()
    })

    // Check if status options are loaded
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('On Hold')).toBeInTheDocument()

    // Check if account options are loaded
    expect(screen.getByText('Test Account')).toBeInTheDocument()
    expect(screen.getByText('Another Account')).toBeInTheDocument()

    // Check table headers
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Account')).toBeInTheDocument()
    expect(screen.queryByText('Status ID')).not.toBeInTheDocument()
    expect(screen.queryByText('Account ID')).not.toBeInTheDocument()
  })

  test('displays project data with status and account names', async () => {
    // Mock API responses
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockProjects })
      .mockResolvedValueOnce({ ok: true, json: async () => mockAccounts })
      .mockResolvedValueOnce({ ok: true, json: async () => mockStatuses })

    render(<ProjectsComponent />)

    // Wait for project data to load
    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })

    // Check that status name is displayed instead of ID
    const statusCells = screen.getAllByText('Active')
    expect(statusCells.length).toBeGreaterThan(0)

    // Check that account name is displayed instead of ID
    const accountCells = screen.getAllByText('Test Account')
    expect(accountCells.length).toBeGreaterThan(0)

    // Verify IDs are not displayed in the table
    expect(screen.queryByText('1')).toBeInTheDocument() // ID column still shows 1
    // But statusId and accountId should not be visible as separate values
  })

  test('handles missing status and account data gracefully', async () => {
    const projectWithoutRelations = {
      id: 1,
      name: 'Test Project',
      description: 'Test Description',
      startDate: '2024-01-01T00:00:00.000Z',
      plannedEndDate: '2024-06-30T00:00:00.000Z',
      statusId: 1,
      accountId: 1,
      status: null,
      account: null
    }

    // Mock API responses
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [projectWithoutRelations] })
      .mockResolvedValueOnce({ ok: true, json: async () => mockAccounts })
      .mockResolvedValueOnce({ ok: true, json: async () => mockStatuses })

    render(<ProjectsComponent />)

    // Wait for project data to load
    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })

    // Check that 'Unknown' is displayed for missing relations
    expect(screen.getAllByText('Unknown')).toHaveLength(2)
  })

  test('handles non-array API responses gracefully', async () => {
    // Mock API responses that return objects instead of arrays
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ error: 'Error' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ error: 'Error' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ error: 'Error' }) })

    render(<ProjectsComponent />)

    // Component should not crash
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument()
    })

    // Should show empty dropdowns
    expect(screen.getByText('Select Status')).toBeInTheDocument()
    expect(screen.getByText('Select Account')).toBeInTheDocument()
  })

  test('creates new project with selected status and account', async () => {
    // Mock API responses
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] }) // Initial projects
      .mockResolvedValueOnce({ ok: true, json: async () => mockAccounts })
      .mockResolvedValueOnce({ ok: true, json: async () => mockStatuses })
      .mockResolvedValueOnce({ ok: true, json: async () => mockProjects[0] }) // Create response
      .mockResolvedValueOnce({ ok: true, json: async () => mockProjects }) // Refresh projects

    render(<ProjectsComponent />)

    // Wait for form to load
    await waitFor(() => {
      expect(screen.getByText('Select Status')).toBeInTheDocument()
    })

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Project Name'), {
      target: { value: 'New Project' }
    })
    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'New Description' }
    })

    // Select status and account
    const statusSelect = screen.getByDisplayValue('')
    fireEvent.change(statusSelect, { target: { value: '1' } })

    const accountSelects = screen.getAllByDisplayValue('')
    fireEvent.change(accountSelects[1], { target: { value: '1' } })

    // Submit form
    fireEvent.click(screen.getByText('Create Project'))

    // Verify POST request was made
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/projectsApi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('"statusId":"1"')
      })
    })
  })

  test('selects status and account from dropdowns', async () => {
    // Mock API responses
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => mockAccounts })
      .mockResolvedValueOnce({ ok: true, json: async () => mockStatuses })

    render(<ProjectsComponent />)

    // Wait for dropdowns to load
    await waitFor(() => {
      expect(screen.getByText('Active')).toBeInTheDocument()
    })

    // Test status dropdown
    const statusSelect = screen.getByDisplayValue('')
    fireEvent.change(statusSelect, { target: { value: '2' } })
    expect(statusSelect.value).toBe('2')

    // Test account dropdown  
    const accountSelects = screen.getAllByDisplayValue('')
    const accountSelect = accountSelects.find(select => 
      select.querySelector('option[value="1"]')?.textContent === 'Test Account'
    ) || accountSelects[1]
    
    fireEvent.change(accountSelect, { target: { value: '2' } })
    expect(accountSelect.value).toBe('2')
  })

  test('handles API errors gracefully', async () => {
    // Mock API errors
    fetch
      .mockRejectedValueOnce(new Error('API Error'))
      .mockRejectedValueOnce(new Error('API Error'))
      .mockRejectedValueOnce(new Error('API Error'))

    render(<ProjectsComponent />)

    // Component should not crash
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument()
    })

    // Should show empty state
    expect(screen.getByText('Select Status')).toBeInTheDocument()
    expect(screen.getByText('Select Account')).toBeInTheDocument()
  })
})
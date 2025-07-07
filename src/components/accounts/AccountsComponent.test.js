import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AccountsComponent from './AccountsComponent'

// Mock fetch
global.fetch = jest.fn()

describe('AccountsComponent', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  test('renders account management form and table', async () => {
    // Mock successful API response with accounts array
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 1,
          name: 'Test Account',
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      ]
    })

    render(<AccountsComponent />)

    // Check if form elements are rendered
    expect(screen.getByPlaceholderText('Account Name')).toBeInTheDocument()
    expect(screen.getByText('Create Account')).toBeInTheDocument()

    // Check if table headers are rendered
    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Created At')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()

    // Wait for accounts to load
    await waitFor(() => {
      expect(screen.getByText('Test Account')).toBeInTheDocument()
    })
  })

  test('handles non-array API response gracefully', async () => {
    // Mock API response that returns an object instead of array
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ error: 'Something went wrong' })
    })

    render(<AccountsComponent />)

    // Component should not crash and should render empty table
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument()
    })

    // Should not show any account rows
    expect(screen.queryByText('Test Account')).not.toBeInTheDocument()
  })

  test('handles API error gracefully', async () => {
    // Mock API error
    fetch.mockRejectedValueOnce(new Error('API Error'))

    render(<AccountsComponent />)

    // Component should not crash and should render empty table
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument()
    })

    // Should not show any account rows
    expect(screen.queryByText('Test Account')).not.toBeInTheDocument()
  })

  test('creates new account when form is submitted', async () => {
    // Mock initial fetch for accounts
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })

    // Mock successful create response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 2, name: 'New Account', createdAt: '2024-01-02T00:00:00.000Z' })
    })

    // Mock fetch after creation
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 2, name: 'New Account', createdAt: '2024-01-02T00:00:00.000Z' }
      ]
    })

    render(<AccountsComponent />)

    const nameInput = screen.getByPlaceholderText('Account Name')
    const submitButton = screen.getByText('Create Account')

    // Fill form and submit
    fireEvent.change(nameInput, { target: { value: 'New Account' } })
    fireEvent.click(submitButton)

    // Verify POST request was made
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/accountsApi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'New Account' })
      })
    })
  })

  test('edits existing account', async () => {
    const testAccount = {
      id: 1,
      name: 'Test Account',
      createdAt: '2024-01-01T00:00:00.000Z'
    }

    // Mock initial fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [testAccount]
    })

    render(<AccountsComponent />)

    // Wait for account to load
    await waitFor(() => {
      expect(screen.getByText('Test Account')).toBeInTheDocument()
    })

    // Click edit button
    const editButton = screen.getByText('Edit')
    fireEvent.click(editButton)

    // Check if form is populated for editing
    expect(screen.getByDisplayValue('Test Account')).toBeInTheDocument()
    expect(screen.getByText('Update Account')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  test('deletes account when delete button is clicked', async () => {
    const testAccount = {
      id: 1,
      name: 'Test Account',
      createdAt: '2024-01-01T00:00:00.000Z'
    }

    // Mock initial fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [testAccount]
    })

    // Mock successful delete response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => testAccount
    })

    // Mock fetch after deletion
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })

    render(<AccountsComponent />)

    // Wait for account to load
    await waitFor(() => {
      expect(screen.getByText('Test Account')).toBeInTheDocument()
    })

    // Click delete button
    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    // Verify DELETE request was made
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/accountsApi?id=1', {
        method: 'DELETE'
      })
    })
  })
})
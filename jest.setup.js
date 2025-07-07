import '@testing-library/jest-dom'

// Mock fetch globally
global.fetch = jest.fn()

// Mock window.confirm
global.confirm = jest.fn(() => true)

// Mock window.alert
global.alert = jest.fn()

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks()
})
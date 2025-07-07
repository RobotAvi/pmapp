import handler from './employeesApi'
import { createMocks } from 'node-mocks-http'

// Mock Prisma
jest.mock('../../lib/prisma', () => ({
  employee: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  employeeSkill: {
    deleteMany: jest.fn(),
  },
  employeeLevel: {
    deleteMany: jest.fn(),
  },
  employeeMotivator: {
    deleteMany: jest.fn(),
  },
  performanceReview: {
    deleteMany: jest.fn(),
  },
  salary: {
    deleteMany: jest.fn(),
  },
  absence: {
    deleteMany: jest.fn(),
  },
  projectAssignment: {
    deleteMany: jest.fn(),
  },
}))

const prisma = require('../../lib/prisma')

describe('/api/employeesApi', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/employeesApi', () => {
    test('returns employees list', async () => {
      const mockEmployees = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          position: 'Developer',
          employmentType: 'Full-time',
          hireDate: new Date('2024-01-01'),
          contactInfo: 'john@example.com',
          employeeSkills: [],
          employeeLevels: [],
          projectAssignments: [],
          performanceReviews: [],
          salaries: []
        }
      ]

      prisma.employee.findMany.mockResolvedValue(mockEmployees)

      const { req, res } = createMocks({
        method: 'GET',
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(JSON.parse(res._getData())).toEqual(mockEmployees)
      expect(prisma.employee.findMany).toHaveBeenCalledWith({
        include: {
          employeeSkills: {
            include: {
              skill: true
            }
          },
          employeeLevels: true,
          projectAssignments: {
            include: {
              project: true
            }
          },
          performanceReviews: true,
          salaries: {
            orderBy: {
              startDate: 'desc'
            },
            take: 1
          }
        },
      })
    })

    test('handles database error', async () => {
      prisma.employee.findMany.mockRejectedValue(new Error('Database error'))

      const { req, res } = createMocks({
        method: 'GET',
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(500)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Failed to fetch employees'
      })
    })
  })

  describe('POST /api/employeesApi', () => {
    test('creates new employee', async () => {
      const newEmployee = {
        firstName: 'Jane',
        lastName: 'Smith',
        position: 'Designer',
        employmentType: 'Contract',
        hireDate: '2024-01-01',
        contactInfo: 'jane@example.com'
      }

      const createdEmployee = {
        id: 1,
        ...newEmployee,
        hireDate: new Date(newEmployee.hireDate),
        employeeSkills: [],
        employeeLevels: [],
        projectAssignments: [],
        salaries: []
      }

      prisma.employee.create.mockResolvedValue(createdEmployee)

      const { req, res } = createMocks({
        method: 'POST',
        body: newEmployee,
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(JSON.parse(res._getData())).toEqual(createdEmployee)
      expect(prisma.employee.create).toHaveBeenCalledWith({
        data: {
          ...newEmployee,
          hireDate: new Date(newEmployee.hireDate),
        },
        include: {
          employeeSkills: {
            include: {
              skill: true
            }
          },
          employeeLevels: true,
          projectAssignments: true,
          salaries: true
        }
      })
    })
  })

  describe('PUT /api/employeesApi', () => {
    test('updates existing employee', async () => {
      const updateData = {
        firstName: 'John',
        lastName: 'Updated',
        position: 'Senior Developer',
        employmentType: 'Full-time',
        hireDate: '2024-01-01',
        contactInfo: 'john.updated@example.com'
      }

      const updatedEmployee = {
        id: 1,
        ...updateData,
        hireDate: new Date(updateData.hireDate),
        employeeSkills: [],
        employeeLevels: [],
        projectAssignments: [],
        salaries: []
      }

      prisma.employee.update.mockResolvedValue(updatedEmployee)

      const { req, res } = createMocks({
        method: 'PUT',
        query: { id: '1' },
        body: updateData,
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(JSON.parse(res._getData())).toEqual(updatedEmployee)
      expect(prisma.employee.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          ...updateData,
          hireDate: new Date(updateData.hireDate),
        },
        include: {
          employeeSkills: {
            include: {
              skill: true
            }
          },
          employeeLevels: true,
          projectAssignments: true,
          salaries: true
        }
      })
    })

    test('returns 400 if ID is missing', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        body: { firstName: 'John' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'ID is required'
      })
    })
  })

  describe('DELETE /api/employeesApi', () => {
    test('deletes employee and related records', async () => {
      const deletedEmployee = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe'
      }

      // Mock all the deleteMany operations
      prisma.employeeSkill.deleteMany.mockResolvedValue({ count: 0 })
      prisma.employeeLevel.deleteMany.mockResolvedValue({ count: 0 })
      prisma.employeeMotivator.deleteMany.mockResolvedValue({ count: 0 })
      prisma.performanceReview.deleteMany.mockResolvedValue({ count: 0 })
      prisma.salary.deleteMany.mockResolvedValue({ count: 0 })
      prisma.absence.deleteMany.mockResolvedValue({ count: 0 })
      prisma.projectAssignment.deleteMany.mockResolvedValue({ count: 0 })
      prisma.employee.delete.mockResolvedValue(deletedEmployee)

      const { req, res } = createMocks({
        method: 'DELETE',
        query: { id: '1' },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(JSON.parse(res._getData())).toEqual(deletedEmployee)
      
      // Verify all related records are deleted first
      expect(prisma.employeeSkill.deleteMany).toHaveBeenCalledWith({
        where: { employeeId: 1 }
      })
      expect(prisma.employee.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      })
    })

    test('returns 400 if ID is missing', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'ID is required'
      })
    })
  })

  describe('Unsupported methods', () => {
    test('returns 405 for unsupported methods', async () => {
      const { req, res } = createMocks({
        method: 'PATCH',
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(405)
      expect(JSON.parse(res._getData())).toEqual({
        message: 'Method not allowed'
      })
    })
  })
})
import handler from './statusesApi'
import { createMocks } from 'node-mocks-http'

// Mock prisma
jest.mock('../../lib/prisma', () => ({
  projectStatus: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
}))

const prisma = require('../../lib/prisma')

describe('/api/statusesApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/statusesApi', () => {
    test('returns all active project statuses', async () => {
      const mockStatuses = [
        { id: 1, status: 'Active', description: 'Project is active', isActive: true },
        { id: 2, status: 'Completed', description: 'Project is completed', isActive: true },
        { id: 3, status: 'On Hold', description: 'Project is on hold', isActive: true }
      ]

      prisma.projectStatus.findMany.mockResolvedValue(mockStatuses)

      const { req, res } = createMocks({
        method: 'GET',
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(JSON.parse(res._getData())).toEqual(mockStatuses)
      expect(prisma.projectStatus.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
        },
        orderBy: {
          status: 'asc',
        },
      })
    })

    test('handles database error', async () => {
      prisma.projectStatus.findMany.mockRejectedValue(new Error('Database error'))

      const { req, res } = createMocks({
        method: 'GET',
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(500)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Failed to fetch statuses'
      })
    })
  })

  describe('POST /api/statusesApi', () => {
    test('creates new project status', async () => {
      const newStatus = {
        status: 'Planning',
        description: 'Project is in planning phase'
      }

      const createdStatus = {
        id: 4,
        ...newStatus,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      prisma.projectStatus.create.mockResolvedValue(createdStatus)

      const { req, res } = createMocks({
        method: 'POST',
        body: newStatus,
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(JSON.parse(res._getData())).toEqual(createdStatus)
      expect(prisma.projectStatus.create).toHaveBeenCalledWith({
        data: {
          status: 'Planning',
          description: 'Project is in planning phase',
          isActive: true,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      })
    })

    test('handles creation error', async () => {
      prisma.projectStatus.create.mockRejectedValue(new Error('Creation failed'))

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          status: 'Planning',
          description: 'Project is in planning phase'
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(500)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Failed to create status'
      })
    })
  })

  describe('Invalid methods', () => {
    test('returns 405 for unsupported methods', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(405)
      expect(JSON.parse(res._getData())).toEqual({
        message: 'Method not allowed'
      })
    })
  })
})
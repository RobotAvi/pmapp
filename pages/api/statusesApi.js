import prisma from '../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const statuses = await prisma.projectStatus.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          status: 'asc',
        },
      })
      res.json(statuses)
    } catch (error) {
      console.error('Error fetching statuses:', error)
      res.status(500).json({ error: 'Failed to fetch statuses' })
    }
  } else if (req.method === 'POST') {
    try {
      const { status, description } = req.body
      const newStatus = await prisma.projectStatus.create({
        data: {
          status,
          description,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
      res.json(newStatus)
    } catch (error) {
      console.error('Error creating status:', error)
      res.status(500).json({ error: 'Failed to create status' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
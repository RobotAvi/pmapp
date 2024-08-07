import prisma from '../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const projects = await prisma.project.findMany({
      include: {
        status: true,
        account: true,
      },
    })
    res.json(projects)
  } else if (req.method === 'POST') {
    const { name, description, startDate, plannedEndDate, statusId, accountId } = req.body
    const project = await prisma.project.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        plannedEndDate: new Date(plannedEndDate),
        statusId: parseInt(statusId),
        accountId: parseInt(accountId),
      },
    })
    res.json(project)
  } else if (req.method === 'PUT') {
    const { id } = req.query // Получаем id из query параметров
    const { name, description, startDate, plannedEndDate, statusId, accountId } = req.body
    try {
      const updatedProject = await prisma.project.update({
        where: { id: parseInt(id) },
        data: {
          name,
          description,
          startDate: new Date(startDate),
          plannedEndDate: new Date(plannedEndDate),
          statusId: parseInt(statusId),
          accountId: parseInt(accountId),
        },
      })
      res.json(updatedProject)
    } catch (error) {
      console.error('Error updating project:', error)
      res.status(500).json({ error: 'Failed to update project' })
    }

  } else if (req.method === 'DELETE') {
    const { id } = req.query
    try {
      const deletedProject = await prisma.project.delete({
        where: { id: parseInt(id) },
      })
      res.json(deletedProject)
    } catch (error) {
      console.error('Error deleting project:', error)
      res.status(500).json({ error: 'Failed to delete project' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}


import prisma from '../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const employees = await prisma.employee.findMany({
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
      res.json(employees)
    } catch (error) {
      console.error('Error fetching employees:', error)
      res.status(500).json({ error: 'Failed to fetch employees' })
    }
  } else if (req.method === 'POST') {
    try {
      const { firstName, lastName, position, employmentType, hireDate, contactInfo } = req.body
      const employee = await prisma.employee.create({
        data: {
          firstName,
          lastName,
          position,
          employmentType,
          hireDate: new Date(hireDate),
          contactInfo,
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
      res.json(employee)
    } catch (error) {
      console.error('Error creating employee:', error)
      res.status(500).json({ error: 'Failed to create employee' })
    }
  } else if (req.method === 'PUT') {
    const { id } = req.query
    if (!id) {
      return res.status(400).json({ error: 'ID is required' })
    }

    try {
      const { firstName, lastName, position, employmentType, hireDate, contactInfo } = req.body
      const updatedEmployee = await prisma.employee.update({
        where: { id: parseInt(id) },
        data: {
          firstName,
          lastName,
          position,
          employmentType,
          hireDate: new Date(hireDate),
          contactInfo,
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
      res.json(updatedEmployee)
    } catch (error) {
      console.error('Error updating employee:', error)
      res.status(500).json({ error: 'Failed to update employee' })
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query
    if (!id) {
      return res.status(400).json({ error: 'ID is required' })
    }

    try {
      // Удаляем связанные записи перед удалением сотрудника
      await prisma.employeeSkill.deleteMany({
        where: { employeeId: parseInt(id) }
      })
      await prisma.employeeLevel.deleteMany({
        where: { employeeId: parseInt(id) }
      })
      await prisma.employeeMotivator.deleteMany({
        where: { employeeId: parseInt(id) }
      })
      await prisma.performanceReview.deleteMany({
        where: { employeeId: parseInt(id) }
      })
      await prisma.salary.deleteMany({
        where: { employeeId: parseInt(id) }
      })
      await prisma.absence.deleteMany({
        where: { employeeId: parseInt(id) }
      })
      await prisma.projectAssignment.deleteMany({
        where: { employeeId: parseInt(id) }
      })

      const deletedEmployee = await prisma.employee.delete({
        where: { id: parseInt(id) },
      })
      res.json(deletedEmployee)
    } catch (error) {
      console.error('Error deleting employee:', error)
      res.status(500).json({ error: 'Failed to delete employee' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
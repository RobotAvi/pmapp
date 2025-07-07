import prisma from '../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const skills = await prisma.skill.findMany({
        include: {
          employeeSkills: {
            include: {
              employee: true
            }
          }
        },
        orderBy: {
          skillName: 'asc'
        }
      })
      res.json(skills)
    } catch (error) {
      console.error('Error fetching skills:', error)
      res.status(500).json({ error: 'Failed to fetch skills' })
    }
  } else if (req.method === 'POST') {
    try {
      const { skillName, description } = req.body
      if (!skillName || !description) {
        return res.status(400).json({ error: 'Skill name and description are required' })
      }
      
      const skill = await prisma.skill.create({
        data: {
          skillName,
          description,
        },
        include: {
          employeeSkills: {
            include: {
              employee: true
            }
          }
        }
      })
      res.json(skill)
    } catch (error) {
      console.error('Error creating skill:', error)
      res.status(500).json({ error: 'Failed to create skill' })
    }
  } else if (req.method === 'PUT') {
    const { id } = req.query
    if (!id) {
      return res.status(400).json({ error: 'ID is required' })
    }

    try {
      const { skillName, description } = req.body
      const updatedSkill = await prisma.skill.update({
        where: { id: parseInt(id) },
        data: {
          skillName,
          description,
        },
        include: {
          employeeSkills: {
            include: {
              employee: true
            }
          }
        }
      })
      res.json(updatedSkill)
    } catch (error) {
      console.error('Error updating skill:', error)
      res.status(500).json({ error: 'Failed to update skill' })
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query
    if (!id) {
      return res.status(400).json({ error: 'ID is required' })
    }

    try {
      // Удаляем связанные записи
      await prisma.employeeSkill.deleteMany({
        where: { skillId: parseInt(id) }
      })

      const deletedSkill = await prisma.skill.delete({
        where: { id: parseInt(id) },
      })
      res.json(deletedSkill)
    } catch (error) {
      console.error('Error deleting skill:', error)
      res.status(500).json({ error: 'Failed to delete skill' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
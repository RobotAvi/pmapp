import prisma from '../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const accounts = await prisma.account.findMany({
        include: {
          projects: true,
        },
      })
      res.json(accounts)
    } catch (error) {
      console.error('Error fetching accounts:', error)
      res.status(500).json({ error: 'Failed to fetch accounts' })
    }
  } else if (req.method === 'POST') {
    try {
      const { name } = req.body
      const account = await prisma.account.create({
        data: {
          name,
          createdAt: new Date(),
        },
      })
      res.json(account)
    } catch (error) {
      console.error('Error creating account:', error)
      res.status(500).json({ error: 'Failed to create account' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id } = req.query
      const { name } = req.body
      const updatedAccount = await prisma.account.update({
        where: { id: parseInt(id) },
        data: {
          name,
        },
      })
      res.json(updatedAccount)
    } catch (error) {
      console.error('Error updating account:', error)
      res.status(500).json({ error: 'Failed to update account' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      const deletedAccount = await prisma.account.delete({
        where: { id: parseInt(id) },
      })
      res.json(deletedAccount)
    } catch (error) {
      console.error('Error deleting account:', error)
      res.status(500).json({ error: 'Failed to delete account' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

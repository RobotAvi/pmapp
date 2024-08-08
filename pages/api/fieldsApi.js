import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { tableName } = req.query;

    if (!tableName) {
      return res.status(400).json({ error: 'Table name is required' });
    }

    try {
      // Используем запрос к information_schema.columns для получения информации о колонках таблицы
      const fields = await prisma.$queryRawUnsafe(`
        SELECT column_name, data_type, character_maximum_length, is_nullable
        FROM information_schema.columns
        WHERE table_name = '${tableName}'
      `);
      res.json(fields);
    } catch (error) {
      console.error('Error fetching fields:', error);
      res.status(500).json({ error: 'Failed to fetch fields' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
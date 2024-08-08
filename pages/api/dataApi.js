import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  const { tableName } = req.query;

  if (!tableName) {
    return res.status(400).json({ error: 'Table name is required' });
  }

  switch (req.method) {
    case 'GET':
      return handleGet(req, res, tableName);
    case 'POST':
      return handlePost(req, res, tableName);
    case 'PUT':
      return handlePut(req, res, tableName);
    case 'DELETE':
      return handleDelete(req, res, tableName);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function handleGet(req, res, tableName) {
  const { fields } = req.query;

  if (!fields) {
    return res.status(400).json({ error: 'Fields are required' });
  }

  try {
    const fieldList = fields.split(',');

    const select = fieldList.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});

    const data = await prisma[tableName].findMany({
      select,
    });

    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}

async function handlePost(req, res, tableName) {
  try {
    const data = req.body;

    const createdRecord = await prisma[tableName].create({
      data,
    });

    res.status(201).json(createdRecord);
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).json({ error: 'Failed to create record' });
  }
}

async function handlePut(req, res, tableName) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    const data = req.body;

    const updatedRecord = await prisma[tableName].update({
      where: { id: Number(id) },
      data,
    });

    res.json(updatedRecord);
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ error: 'Failed to update record' });
  }
}

async function handleDelete(req, res, tableName) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    await prisma[tableName].delete({
      where: { id: Number(id) },
    });

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Failed to delete record' });
  }
}
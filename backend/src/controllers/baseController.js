import Base from '../models/Base.js';
import { createBaseValidator } from '../validators/schemas.js';

export const getAllBases = async (req, res) => {
  try {
    const bases = await Base.findAll();
    res.json({ data: bases });
  } catch (error) {
    console.error('Get bases error:', error);
    res.status(500).json({ message: 'Failed to fetch bases' });
  }
};

export const getBaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const base = await Base.findById(id);

    if (!base) {
      return res.status(404).json({ message: 'Base not found' });
    }

    res.json({ data: base });
  } catch (error) {
    console.error('Get base error:', error);
    res.status(500).json({ message: 'Failed to fetch base' });
  }
};

export const createBase = async (req, res) => {
  try {
    const validation = createBaseValidator.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: 'Validation error', errors: validation.error.errors });
    }

    const { name, location } = validation.data;
    const newBase = await Base.create(name, location);

    res.status(201).json({ 
      message: 'Base created successfully',
      data: newBase 
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Base name already exists' });
    }
    console.error('Create base error:', error);
    res.status(500).json({ message: 'Failed to create base' });
  }
};

export const updateBase = async (req, res) => {
  try {
    const { id } = req.params;
    const validation = createBaseValidator.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ message: 'Validation error', errors: validation.error.errors });
    }

    const base = await Base.findById(id);
    if (!base) {
      return res.status(404).json({ message: 'Base not found' });
    }

    const { name, location } = validation.data;
    const updatedBase = await Base.update(id, name, location);

    res.json({ 
      message: 'Base updated successfully',
      data: updatedBase 
    });
  } catch (error) {
    console.error('Update base error:', error);
    res.status(500).json({ message: 'Failed to update base' });
  }
};

export const deleteBase = async (req, res) => {
  try {
    const { id } = req.params;
    const base = await Base.findById(id);

    if (!base) {
      return res.status(404).json({ message: 'Base not found' });
    }

    await Base.delete(id);
    res.json({ message: 'Base deleted successfully' });
  } catch (error) {
    console.error('Delete base error:', error);
    res.status(500).json({ message: 'Failed to delete base' });
  }
};

export default { getAllBases, getBaseById, createBase, updateBase, deleteBase };

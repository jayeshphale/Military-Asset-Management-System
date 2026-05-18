import Equipment from '../models/Equipment.js';
import { createEquipmentValidator } from '../validators/schemas.js';

export const getAllEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findAll();
    res.json({ data: equipment });
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ message: 'Failed to fetch equipment' });
  }
};

export const getEquipmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await Equipment.findById(id);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json({ data: equipment });
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ message: 'Failed to fetch equipment' });
  }
};

export const createEquipment = async (req, res) => {
  try {
    const validation = createEquipmentValidator.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: 'Validation error', errors: validation.error.errors });
    }

    const { name, category, unit } = validation.data;
    const newEquipment = await Equipment.create(name, category, unit);

    res.status(201).json({ 
      message: 'Equipment created successfully',
      data: newEquipment 
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Equipment name already exists' });
    }
    console.error('Create equipment error:', error);
    res.status(500).json({ message: 'Failed to create equipment' });
  }
};

export const updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const validation = createEquipmentValidator.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ message: 'Validation error', errors: validation.error.errors });
    }

    const equipment = await Equipment.findById(id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    const { name, category, unit } = validation.data;
    const updatedEquipment = await Equipment.update(id, name, category, unit);

    res.json({ 
      message: 'Equipment updated successfully',
      data: updatedEquipment 
    });
  } catch (error) {
    console.error('Update equipment error:', error);
    res.status(500).json({ message: 'Failed to update equipment' });
  }
};

export const deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await Equipment.findById(id);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    await Equipment.delete(id);
    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error('Delete equipment error:', error);
    res.status(500).json({ message: 'Failed to delete equipment' });
  }
};

export default { getAllEquipment, getEquipmentById, createEquipment, updateEquipment, deleteEquipment };

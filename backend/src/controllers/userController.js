import bcryptjs from 'bcryptjs';
import User from '../models/User.js';
import { createUserValidator, updateUserValidator } from '../validators/schemas.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({ data: users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ data: user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

export const createUser = async (req, res) => {
  try {
    const validation = createUserValidator.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: 'Validation error', errors: validation.error.errors });
    }

    const { name, email, password, role, assigned_base_id } = validation.data;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = await User.create(name, email, hashedPassword, role, assigned_base_id);

    res.status(201).json({ 
      message: 'User created successfully',
      data: newUser 
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const validation = updateUserValidator.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ message: 'Validation error', errors: validation.error.errors });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, role, assigned_base_id } = validation.data;
    const updatedUser = await User.update(id, name || user.name, role || user.role, assigned_base_id);

    res.json({ 
      message: 'User updated successfully',
      data: updatedUser 
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.delete(id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

export default { getAllUsers, getUserById, createUser, updateUser, deleteUser };

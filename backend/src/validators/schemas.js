import { z } from 'zod';

export const loginValidator = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const createUserValidator = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['Admin', 'Base Commander', 'Logistics Officer']),
  assigned_base_id: z.number().positive().optional().nullable(),
});

export const updateUserValidator = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  role: z.enum(['Admin', 'Base Commander', 'Logistics Officer']).optional(),
  assigned_base_id: z.number().positive().optional().nullable(),
});

export const createPurchaseValidator = z.object({
  base_id: z.number().positive('Base ID must be positive'),
  equipment_type_id: z.number().positive('Equipment ID must be positive'),
  quantity: z.number().positive('Quantity must be positive'),
  purchase_date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),
  remarks: z.string().optional(),
});

export const createTransferValidator = z.object({
  from_base_id: z.number().positive('Source base ID must be positive'),
  to_base_id: z.number().positive('Destination base ID must be positive'),
  equipment_type_id: z.number().positive('Equipment ID must be positive'),
  quantity: z.number().positive('Quantity must be positive'),
  transfer_date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),
  remarks: z.string().optional(),
});

export const createAssignmentValidator = z.object({
  base_id: z.number().positive('Base ID must be positive'),
  equipment_type_id: z.number().positive('Equipment ID must be positive'),
  assigned_to: z.string().min(2, 'Name must be at least 2 characters'),
  quantity: z.number().positive('Quantity must be positive'),
  assignment_date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),
});

export const createExpenditureValidator = z.object({
  base_id: z.number().positive('Base ID must be positive'),
  equipment_type_id: z.number().positive('Equipment ID must be positive'),
  quantity: z.number().positive('Quantity must be positive'),
  reason: z.string().min(2, 'Reason must be at least 2 characters'),
  expenditure_date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),
});

export const createBaseValidator = z.object({
  name: z.string().min(2, 'Base name must be at least 2 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
});

export const createEquipmentValidator = z.object({
  name: z.string().min(2, 'Equipment name must be at least 2 characters'),
  category: z.string().min(2, 'Category must be at least 2 characters'),
  unit: z.string().min(1, 'Unit is required'),
});

export default {
  loginValidator,
  createUserValidator,
  updateUserValidator,
  createPurchaseValidator,
  createTransferValidator,
  createAssignmentValidator,
  createExpenditureValidator,
  createBaseValidator,
  createEquipmentValidator,
};

import bcryptjs from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../config/jwt.js';
import { loginValidator } from '../validators/schemas.js';

export const login = async (req, res) => {
  try {
    const validation = loginValidator.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: 'Validation error', errors: validation.error.errors });
    }

    const { email, password } = validation.data;
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.role);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        assigned_base_id: user.assigned_base_id,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

export default { login };

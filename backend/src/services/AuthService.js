import { Op } from 'sequelize';
import { User } from '../models/index.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';

class AuthService {
  /**
   * Register new user
   */
  async register(userData) {
    const { username, email, password, firstName, lastName } = userData;

    // Check if user exists
    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      throw {
        statusCode: 409,
        message: 'Email already registered'
      };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      firstName: firstName || null,
      lastName: lastName || null,
      role: 'user'
    });

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  /**
   * Login user (accepts email or username as identifier)
   */
  async login(identifier, password) {
    // Find user by email or username
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { username: identifier }
        ]
      }
    });

    if (!user) {
      throw {
        statusCode: 401,
        message: 'Invalid credentials'
      };
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw {
        statusCode: 401,
        message: 'Invalid credentials'
      };
    }

    if (!user.isActive) {
      throw {
        statusCode: 403,
        message: 'User account is inactive'
      };
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      throw {
        statusCode: 404,
        message: 'User not found'
      };
    }

    return user;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId, updateData) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw {
        statusCode: 404,
        message: 'User not found'
      };
    }

    const { firstName, lastName, username } = updateData;

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        throw {
          statusCode: 409,
          message: 'Username already taken'
        };
      }
    }

    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      username: username || user.username
    });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    };
  }
}

export default new AuthService();

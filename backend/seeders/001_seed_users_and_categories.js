import { hashPassword } from '../src/utils/password.js';

export async function up(queryInterface, Sequelize) {
  const hashedPassword = await hashPassword('Admin@123456');
  
  // Seed admin user
  await queryInterface.bulkInsert('users', [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      username: 'admin',
      email: 'admin@newportal.com',
      password: hashedPassword,
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      username: 'editor1',
      email: 'editor1@newportal.com',
      password: hashedPassword,
      first_name: 'Editor',
      last_name: 'One',
      role: 'editor',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);

  // Seed categories
  await queryInterface.bulkInsert('categories', [
    {
      id: '650e8400-e29b-41d4-a716-446655440000',
      name: 'Technology',
      slug: 'technology',
      description: 'Latest news and updates about technology',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440001',
      name: 'Business',
      slug: 'business',
      description: 'Business news and market updates',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440002',
      name: 'Health',
      slug: 'health',
      description: 'Health and wellness news',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440003',
      name: 'Sports',
      slug: 'sports',
      description: 'Sports news and updates',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440004',
      name: 'Entertainment',
      slug: 'entertainment',
      description: 'Entertainment and celebrity news',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('categories', null, {});
  await queryInterface.bulkDelete('users', null, {});
}

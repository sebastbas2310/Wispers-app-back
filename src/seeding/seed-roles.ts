import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { RoleService } from '../modules/role/role.service';

async function seedRoles() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const roleService = app.get(RoleService);

  try {
    // Define default roles
    const defaultRoles = [
      {
        name: 'creator',
        color: '#FF0000',
        permissions: [
          'read',
          'write',
          'delete',
          'manage_members',
          'manage_roles',
          'manage_settings',
          'create_posts',
          'delete_posts',
          'manage_comments',
          'moderate',
        ],
      },
      {
        name: 'moderator',
        color: '#FFA500',
        permissions: [
          'read',
          'write',
          'manage_comments',
          'moderate',
          'manage_members',
        ],
      },
      {
        name: 'member',
        color: '#0000FF',
        permissions: ['read', 'write', 'create_posts'],
      },
    ];

    for (const roleData of defaultRoles) {
      const existingRole = await roleService.findOneByName(roleData.name);
      if (!existingRole) {
        const newRole = await roleService.create(roleData);
        console.log(`Created role: ${newRole.name}`);
      } else {
        console.log(`Role ${roleData.name} already exists`);
      }
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error seeding roles:', error);
  } finally {
    await app.close();
  }
}

seedRoles();

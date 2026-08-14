import * as bcrypt from 'bcrypt';
import { PrismaClient } from '../../c705_db/generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg(
    new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://ace:CHASE2ave@localhost:5432/c705_db',
    })
  ),
});

async function createAdmin() {
  const email = 'averyalh7@yahoo.com';
  const password = 'ADMIN'; // Change this to your desired password
  const role = 'ADMIN';

  try {
    // Check if admin already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (existingUser.role === 'ADMIN') {
        console.log('✅ Admin user already exists with this email');
        return;
      } else {
        // Update existing user to admin
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
          where: { email },
          data: {
            role: 'ADMIN',
            password: hashedPassword,
          },
        });
        console.log('✅ Updated existing user to ADMIN role');
        return;
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('🔐 Password hashed successfully');

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password:', password);
    console.log('👤 Role:', admin.role);
    console.log('🆔 ID:', admin.id);
    console.log('\n⚠️  IMPORTANT: Save this password securely!');
    console.log('⚠️  You can now login to the admin panel with:');
    console.log('   Email: averyalh7@yahoo.com');
    console.log('   Password: ADMIN');
  } catch (error: any) {
    console.error('❌ Error creating admin user:', error.message);
    if (error.code === 'P2002') {
      console.error('   User with this email already exists');
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'; 

const verificationToken = uuidv4();

const users = [
  {
    name: 'User1',
    email: 'keith235670@gmail.com',
    password: 'yamam1',
    verification_token: verificationToken,
    verified: true
  },
];

const client = await db.connect();

// async function seedWords() {
//   try {
//     await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
//     await client.query(`
//       CREATE SEQUENCE IF NOT EXISTS word_order_seq;
//     `);
//     await client.sql`
//       CREATE TABLE IF NOT EXISTS words (
//         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//         word TEXT UNIQUE,
//         pronunciation TEXT,
//         keymeanings TEXT,
//         examplesentences TEXT,
//         detailedDescription TEXT,
//         "order" INT DEFAULT nextval('word_order_seq')
//       );
//     `;
//   } catch (error) {
//     console.error('Error seeding words:', error);
//     throw error;
//   }
// }


async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      verification_token UUID,
      verified BOOLEAN DEFAULT FALSE
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`
        INSERT INTO users (name, email, password, verification_token, verified)
        VALUES (${user.name}, ${user.email}, ${hashedPassword}, ${user.verification_token}, ${user.verified})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}


export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedUsers();
    await client.sql`COMMIT`;
    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}

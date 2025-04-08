'use server'
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcryptjs';

export async function createUser(
    name: string,
    email: string,
    password: string,
    role: string
) {

    // Validate input
    if (!name || !email || !password || !role) {
        throw new Error('All fields are required');
    }
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (existingUser) {
        throw new Error('User already exists');
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
        },
    });
}

export async function loginUser(email: string, password: string) {
  if (!email || !password) {
    throw new Error("All fields are required");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("Invalid password");
  }

  return user;
}

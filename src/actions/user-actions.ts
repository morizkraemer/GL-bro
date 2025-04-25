'use server'
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcryptjs';
import { logError } from "@/lib/logger";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ActionResult } from "@/types/generic-types";
import { User } from "@prisma/client";

async function hasAuth() {
    const session = await getServerSession(authOptions);
    if (!session) return false
    return session
}

export async function createUser(
    name: string,
    email: string,
    password: string,
    role: string,
    organizationId: number
): Promise<ActionResult<User>> {
    if (!hasAuth()) return { error: { code: "auth", message: "Not authenticated" } }
    if (!name || !email || !password || !role || !organizationId) {
        logError("Missing required fields for user creation", "createUser")
        return { error: { code: "generic", message: "Something went wrong" } }
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return { error: { code: "auth", message: "Email is already registered" } } //hack
        }

        // Check if organization exists
        const organization = await prisma.organization.findUnique({
            where: { id: organizationId }
        });
        if (!organization) {
            logError(`Organization with ID ${organizationId} not found`, "createUser")
            return { error: { code: "missingResource", message: "Organization not found" } }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                organizationId
            },
        });

        return { data: user };
    } catch (err) {
        logError(err, "createUser")
        return { error: { code: "internal", message: "Something went wrong" } }
    }
}

export async function loginUser(email: string, password: string): Promise<ActionResult<User>> {
    if (!email || !password) {
        logError("Missing email or password", "loginUser")
        return { error: { code: "generic", message: "Something went wrong" } }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            logError(`User not found with email ${email}`, "loginUser")
            return { error: { code: "missingResource", message: "User not found" } }
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            logError("Invalid password for user", "loginUser")
            return { error: { code: "generic", message: "Invalid password" } }
        }

        return { data: user };
    } catch (err) {
        logError(err, "loginUser")
        return { error: { code: "internal", message: "Something went wrong" } }
    }
}

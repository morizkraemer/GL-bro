'use server'
import { prisma } from "@/lib/prisma";
import jwt from 'jsonwebtoken'
import { logError } from "@/lib/logger";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ActionResult } from "@/types/generic-types";
import { Link, LinkWithDetails } from "@/types/event-types";


async function hasAuth() {
    const session = await getServerSession(authOptions);
    if (!session) return false
    return session
}

export async function createOneTimeLink({ guestlistId,
    name = "tempLink",
    capacity,
    plusOne = false,
    canView = false,
    canEdit = false,
    needsConfirmation = false,
    createdByUserId
}: {
    guestlistId: number,
    name: string
    capacity: number,
    plusOne?: boolean,
    canView?: boolean
    canEdit?: boolean
    needsConfirmation?: boolean
    createdByUserId: string
}): Promise<ActionResult<Link>> {
    if (!hasAuth()) return { error: { code: "auth", message: "Not authenticated" } }
    if (!guestlistId || !capacity || !createdByUserId) {
        logError("Missing required fields for link creation", "createOneTimeLink")
        return { error: { code: "generic", message: "Something went wrong" } }
    }

    try {
        // First verify the user exists
        const user = await prisma.user.findUnique({
            where: { id: createdByUserId }
        });

        if (!user) {
            logError(`User not found with ID ${createdByUserId}`, "createOneTimeLink")
            return { error: { code: "generic", message: "Invalid user" } }
        }

        // Then verify the guest list exists
        const guestList = await prisma.guestList.findUnique({
            where: { id: guestlistId }
        });

        if (!guestList) {
            logError(`Guest list not found with ID ${guestlistId}`, "createOneTimeLink")
            return { error: { code: "missingResource", message: "Invalid guest list" } }
        }

        const link = await prisma.link.create({
            data: {
                name,
                guestlistId,
                capacity,
                plusOne,
                canEdit,
                canView,
                needsConfirmation,
                createdByUserId,
                isOneTime: true
            }
        })
        return { data: link };
    } catch (err) {
        logError(err, "createOneTimeLink")
        return { error: { code: "internal", message: "Failed to create link" } }
    }
}

export async function getLinksByGuestlistId(guestlistId: number): Promise<ActionResult<Link[]>> {
    if (!hasAuth()) return { error: { code: "auth", message: "Not authenticated" } }
    if (!guestlistId) {
        logError("Missing guest list ID", "getLinksByGuestlistId")
        return { error: { code: "generic", message: "Something went wrong" } }
    }

    try {
        const links = await prisma.link.findMany({
            where: {
                guestlistId
            }
        })

        return { data: links };
    } catch (err) {
        logError(err, "getLinksByGuestlistId")
        return { error: { code: "internal", message: "Something went wrong" } }
    }
}

export async function getLinkById(linkId: string): Promise<ActionResult<LinkWithDetails>> {
    if (!hasAuth()) return { error: { code: "auth", message: "Not authenticated" } }
    if (!linkId) {
        logError("Missing link ID", "getLinkById")
        return { error: { code: "generic", message: "Something went wrong" } }
    }

    try {
        const link = await prisma.link.findUnique({
            where: { id: linkId },
            include: {
                GuestList: {
                    include: {
                        event: {
                            include: {
                                venue: true
                            }
                        },
                        guests: true
                    }
                }
            }
        })

        if (!link) {
            logError(`Link not found with ID ${linkId}`, "getLinkById")
            return { error: { code: "missingResource", message: "Link not found" } }
        }

        return { data: link }
    } catch (err) {
        logError(err, "getLinkById")
        return { error: { code: "internal", message: "Something went wrong" } }
    }
}

const secret = process.env.JWT_LINK_SECRET

// Define expected payload type
interface JwtPayload {
    linkId: string
}

export async function createToken(data: JwtPayload): Promise<ActionResult<string>> {
    if (!hasAuth()) return { error: { code: "auth", message: "Not authenticated" } }
    if (!secret) {
        logError("JWT secret not found", "createToken")
        return { error: { code: "internal", message: "Something went wrong" } }
    }

    try {
        const token = jwt.sign(data, secret, {});
        return { data: token };
    } catch (err) {
        logError(err, "createToken")
        return { error: { code: "internal", message: "Something went wrong" } }
    }
}

export async function decodeToken(token: string): Promise<ActionResult<JwtPayload>> {
    if (!hasAuth()) return { error: { code: "auth", message: "Not authenticated" } }
    if (!token) {
        logError("Missing token", "decodeToken")
        return { error: { code: "generic", message: "Something went wrong" } }
    }
    if (!secret) {
        logError("JWT secret not found", "decodeToken")
        return { error: { code: "internal", message: "Something went wrong" } }
    }

    try {
        const decoded = jwt.verify(token, secret) as JwtPayload;
        return { data: decoded };
    } catch (err) {
        logError(err, "decodeToken")
        return { error: { code: "auth", message: "Broken link" } }
    }
}

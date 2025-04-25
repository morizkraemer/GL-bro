'use server'

import { prisma } from "@/lib/prisma";
import { GuestListFormValues, GuestListWithGuests, GuestListWithDetails } from "@/types/event-types";
import { logError } from "@/lib/logger";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ActionResult } from "@/types/generic-types";

async function hasAuth() {
    const session = await getServerSession(authOptions);
    if (!session) return false
    return session
}

export async function createGuestLists(userId: string, eventId: number, guestLists: GuestListFormValues[]): Promise<ActionResult<GuestListWithGuests[]>> {
    if (!hasAuth()) return { error: { code: "auth", message: "Not authenticated" } }
    if (!eventId || !guestLists.length) {
        logError("Missing event ID or guest lists", "createGuestLists")
        return { error: { code: "generic", message: "Something went wrong" } }
    }

    try {
        const createdGuestLists = await prisma.$transaction(async (tx) => {
            await tx.guestList.createMany({
                data: guestLists.map((guestList) => ({
                    eventId,
                    name: guestList.name,
                    maxCapacity: guestList.maxCapacity,
                    createdByUserId: userId,
                })),
            });

            return tx.guestList.findMany({
                where: {
                    eventId,
                    createdByUserId: userId,
                },
                include: {
                    guests: true,
                },
            });
        });

        return { data: createdGuestLists };
    } catch (err) {
        logError(err, "createGuestLists")
        return { error: { code: "internal", message: "Something went wrong" } }
    }
}

export async function updateGuestList(id: number, data: GuestListFormValues): Promise<ActionResult<GuestListWithGuests>> {
    if (!hasAuth()) return { error: { code: "auth", message: "Not authenticated" } }
    if (!id) {
        logError("Missing guest list ID", "updateGuestList")
        return { error: { code: "generic", message: "Something went wrong" } }
    }

    try {
        const updatedGuestList = await prisma.guestList.update({
            where: { id },
            data: {
                name: data.name,
                maxCapacity: data.maxCapacity,
            },
            include: {
                guests: true,
            },
        });

        return { data: updatedGuestList };
    } catch (err) {
        logError(err, "updateGuestList")
        return { error: { code: "internal", message: "Something went wrong" } }
    }
}

export async function updateEventGuestLists(userId: string, eventId: number, guestLists: GuestListFormValues[]): Promise<ActionResult<GuestListWithGuests[]>> {
    if (!hasAuth()) return { error: { code: "auth", message: "Not authenticated" } }
    if (!eventId || !guestLists) {
        logError("Missing event ID or guest lists", "updateEventGuestLists")
        return { error: { code: "generic", message: "Something went wrong" } }
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            // Get existing guest lists for this event
            const existingGuestLists = await tx.guestList.findMany({
                where: { eventId },
            });

            // Separate guest lists into existing and new
            const existingGuestListIds = existingGuestLists.map(gl => gl.id);
            const guestListsToUpdate = guestLists.filter(gl => gl.id && existingGuestListIds.includes(gl.id));
            const guestListsToCreate = guestLists.filter(gl => !gl.id);
            const guestListsToDelete = existingGuestLists.filter(gl =>
                !guestLists.some(newGl => newGl.id === gl.id)
            );

            // Delete removed guest lists
            if (guestListsToDelete.length) {
                await tx.guestList.deleteMany({
                    where: {
                        id: {
                            in: guestListsToDelete.map(gl => gl.id)
                        }
                    }
                });
            }

            // Update existing guest lists
            const updatePromises = guestListsToUpdate.map(guestList =>
                tx.guestList.update({
                    where: { id: guestList.id! },
                    data: {
                        name: guestList.name,
                        maxCapacity: guestList.maxCapacity,
                    },
                    include: {
                        guests: true,
                    }
                })
            );

            // Create new guest lists
            const createPromises = guestListsToCreate.map(guestList =>
                tx.guestList.create({
                    data: {
                        eventId,
                        name: guestList.name,
                        maxCapacity: guestList.maxCapacity,
                        createdByUserId: userId,
                    },
                    include: {
                        guests: true,
                    }
                })
            );

            const [updated, created] = await Promise.all([
                Promise.all(updatePromises),
                Promise.all(createPromises)
            ]);

            return [...updated, ...created];
        });

        return { data: result };
    } catch (err) {
        logError(err, "updateEventGuestLists")
        return { error: { code: "internal", message: "Something went wrong" } }
    }
}

export async function deleteGuestList(id: number): Promise<ActionResult<null>> {
    if (!hasAuth()) return { error: { code: "auth", message: "Not authenticated" } }
    if (!id) {
        logError("Missing guest list ID", "deleteGuestList")
        return { error: { code: "generic", message: "Something went wrong" } }
    }

    try {
        await prisma.guestList.delete({
            where: { id },
        });

        return { data: null };
    } catch (err) {
        logError(err, "deleteGuestList")
        return { error: { code: "internal", message: "Something went wrong" } }
    }
}

export async function getEventGuestLists(eventId: number): Promise<ActionResult<GuestListWithGuests[]>> {
    if (!hasAuth()) return { error: { code: "auth", message: "Not authenticated" } }
    if (!eventId) {
        logError("Missing event ID", "getEventGuestLists")
        return { error: { code: "generic", message: "Something went wrong" } }
    }

    try {
        const guestLists = await prisma.guestList.findMany({
            where: { eventId },
            include: {
                guests: true,
            },
        });

        if (!guestLists.length) {
            logError(`No guest lists found for event ${eventId}`, "getEventGuestLists")
            return { error: { code: "missingResource", message: "No guest lists found" } }
        }

        return { data: guestLists };
    } catch (err) {
        logError(err, "getEventGuestLists")
        return { error: { code: "internal", message: "Something went wrong" } }
    }
}

export async function getVenueGuestLists(venueId: number): Promise<ActionResult<GuestListWithDetails[]>> {
    if (!hasAuth()) return { error: { code: "auth", message: "Not authenticated" } }
    if (!venueId) {
        logError("Missing venue ID", "getVenueGuestLists")
        return { error: { code: "generic", message: "Something went wrong" } }
    }

    try {
        const guestLists = await prisma.guestList.findMany({
            where: { event: { venueId } },
            include: {
                event: {
                    include: {
                        venue: true,
                        createdByUser: true
                    },
                },
                guests: true,
                createdByUser: true
            },
        });


        return { data: guestLists };
    } catch (err) {
        logError(err, "getVenueGuestLists")
        return { error: { code: "internal", message: "Something went wrong" } }
    }
}

export async function toggleGuestListClosed(id: number, closed: boolean): Promise<ActionResult<GuestListWithGuests>> {
    if (!hasAuth()) return { error: { code: "auth", message: "Not authenticated" } }
    if (!id) {
        logError("Missing guest list ID", "toggleGuestListClosed")
        return { error: { code: "generic", message: "Something went wrong" } }
    }

    try {
        const result = await prisma.guestList.update({
            where: { id },
            data: { closed },
            include: {
                guests: true,
            },
        });

        return { data: result };
    } catch (err) {
        logError(err, "toggleGuestListClosed")
        return { error: { code: "internal", message: "Something went wrong" } }
    }
}

export async function getGuestListById(id: number): Promise<ActionResult<GuestListWithDetails>> {
    if (!hasAuth()) return { error: { code: "auth", message: "Not authenticated" } }
    if (!id) {
        logError("Missing guest list ID", "getGuestListById")
        return { error: { code: "generic", message: "Something went wrong" } }
    }

    try {
        const guestList = await prisma.guestList.findUnique({
            where: { id },
            include: {
                event: {
                    include: {
                        venue: true,
                        createdByUser: true
                    },
                },
                guests: true,
                createdByUser: true
            },
        });

        if (!guestList) {
            logError(`Guest list not found with ID ${id}`, "getGuestListById")
            return { error: { code: "missingResource", message: "Guest list not found" } }
        }

        return { data: guestList };
    } catch (err) {
        logError(err, "getGuestListById")
        return { error: { code: "internal", message: "Something went wrong" } }
    }
}

export async function getGuestListsByUserId(userId: string): Promise<ActionResult<GuestListWithDetails[]>> {
    if (!hasAuth()) return { error: { code: "auth", message: "Not authenticated" } }
    if (!userId) {
        logError("Missing user ID", "getGuestListsByUserId")
        return { error: { code: "generic", message: "Something went wrong" } }
    }

    try {
        const guestLists = await prisma.guestList.findMany({
            where: {
                createdByUserId: userId
            },
            include: {
                guests: true,
                event: {
                    include: {
                        venue: true,
                        createdByUser: true
                    }
                },
                createdByUser: true
            }
        })


        return { data: guestLists };
    } catch (err) {
        logError(err, "getGuestListsByUserId")
        return { error: { code: "internal", message: "Something went wrong" } }
    }
}

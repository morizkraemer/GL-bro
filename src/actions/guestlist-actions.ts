'use server'

import { prisma } from "@/lib/prisma";
import { GuestListFormValues } from "@/form-schemas/event-forms";
import { on } from "events";

export async function createGuestLists(userId: string, eventId: number, guestLists: GuestListFormValues[]) {
    if (!eventId || !guestLists.length) {
        return [];
    }

    const createdGuestLists = await prisma.guestList.createMany({
        data: guestLists.map((guestList) => ({
            eventId,
            name: guestList.name,
            maxCapacity: guestList.maxCapacity,
            createdByUserId: userId,
        })),
    });

    return createdGuestLists;
}

export async function updateGuestList(id: number, data: GuestListFormValues) {
    if (!id) {
        throw new Error("Guest list ID is required");
    }

    const updatedGuestList = await prisma.guestList.update({
        where: { id },
        data: {
            name: data.name,
            maxCapacity: data.maxCapacity,
        },
    });

    return updatedGuestList;
}

export async function updateEventGuestLists(userId: string, eventId: number, guestLists: GuestListFormValues[]) {
    // Get existing guest lists for this event
    const existingGuestLists = await prisma.guestList.findMany({
        where: { eventId },
    });

    // Separate guest lists into existing and new
    const existingGuestListIds = existingGuestLists.map(gl => gl.id);
    const guestListsToUpdate = guestLists.filter(gl => gl.id && existingGuestListIds.includes(gl.id));
    const guestListsToCreate = guestLists.filter(gl => !gl.id);
    const guestListsToDelete = existingGuestLists.filter(gl => 
        !guestLists.some(newGl => newGl.id === gl.id)
    );

    // Perform all operations in a transaction
    const result = await prisma.$transaction(async (tx) => {
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
                }
            })
        );

        const [updated, created] = await Promise.all([
            Promise.all(updatePromises),
            Promise.all(createPromises)
        ]);

        return [...updated, ...created];
    });

    return result;
}

export async function deleteGuestList(id: number) {
    if (!id) {
        throw new Error("Guest list ID is required");
    }

    const deletedGuestList = await prisma.guestList.delete({
        where: { id },
    });

    return deletedGuestList;
}

export async function getEventGuestLists(eventId: number) {
    if (!eventId) {
        throw new Error("Event ID is required");
    }

    const guestLists = await prisma.guestList.findMany({
        where: { eventId },
        include: {
            guests: true,
        },
    });

    return guestLists;
}

export async function getVenueGuestLists(venueId: number) {
    if (!venueId) {
        throw new Error("Venue ID is required");
    }

    const guestLists = await prisma.guestList.findMany({
        where: { event: { venueId } },
        include: {
            event: {
                include: {
                    venue: true,
                },
            },
            guests: true,
            createdByUser: true
            
        },
    });

    return guestLists;
}

export async function toggleGuestListClosed(id: number, closed: boolean) {
    if (!id) {
        throw new Error("Guest list ID is required");
    }

    return prisma.guestList.update({
        where: { id },
        data: { closed },
    });
}

export async function getGuestListById(id: number) {
    if (!id) {
        throw new Error("Guest list ID is required");
    }

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
        throw new Error("Guest list not found");
    }

    return guestList;
}

export async function getGuestListsByUserId(userId: string) {
    if (!userId) throw new Error("UserId is required")
    
    const guestLists = await prisma.guestList.findMany({
        where: {
            createdByUserId: userId
        },
        include: {
            guests: true,
            event: {
                include: {
                    venue: true
                }
            },
            createdByUser: true
        }
    })

    if (!guestLists) throw new Error("No lists found");

    return guestLists
}

'use server'

import { EventFormValues } from "@/form-schemas/event-forms";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Session } from "next-auth";
import { logError } from "@/lib/logger";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { EventWithDetails, EventWithVenue } from "@/types/event-types";
import { ActionResult } from "@/types/generic-types";

async function hasAuth() {
    const session = await getServerSession(authOptions);
    if (!session) return false
    return session
}

export async function getEvents(): Promise<ActionResult<EventWithVenue[]>> {
    if (!hasAuth()) return { error: { code: "auth", message: "Not authenticated" } }
    try {
        const result = await prisma.event.findMany({
            include: {
                venue: true,
            },
            orderBy: {
                eventDate: 'desc',
            },
        });

        return { data: result };

    } catch (err) {
        logError(err, "getEvents")
        return { error: { code: "internal", message: "Something went wrong" } }
    }
}

export async function getEventsByVenueId(venueId: number): Promise<ActionResult<EventWithDetails[]>> {
    if (!hasAuth()) return { error: { code: "auth", message: "Not authenticated" } }
    if (!venueId) {
        logError("Missing venue ID", "getEventsByVenueId")
        return {error: {code: "generic", message: "Something went wrong"}}
    }

    try {
        const events = await prisma.event.findMany({
            where: {
                venueId: venueId,
            },
            include: {
                venue: true,
                guestLists: {
                    include: {
                        guests: true
                    }
                },
                createdByUser: true,
            },
        });

        return { data: events };
    } catch (err) {
        logError(err, "getEventsByVenueId")
        return { error: { code: "internal", message: "Something went wrong" } }
    }
}

export async function getEventsByUserId(userId: string): Promise<ActionResult<EventWithVenue[]>> {
    if (!hasAuth()) return { error: { code: "auth", message: "Not authenticated" } }
    if (!userId) {
        logError("Missing user ID", "getEventsByUserId")
        return { error: { code: "generic", message: "Something went wrong" } }
    }
    try {
        const events = await prisma.event.findMany({
            where: {
                createdByUserId: userId
            },
            include: {
                venue: true
            }
        })

        return { data: events }
    } catch (err) {
        logError(err, "getEventsByUserId")
        return { error: { code: "internal", message: "Something went wrong" } }
    }
}

export async function getEventById(id: number): Promise<ActionResult<EventWithDetails>> {
    if (!hasAuth()) return { error: { code: "auth", message: "Not authenticated" } }
    if (!id) {
        logError("Missing event ID", "getEventById")
        return { error: { code: "generic", message: "Something went wrong" } }
    }

    try {
        const event = await prisma.event.findUnique({
            where: {
                id: id,
            },
            include: {
                venue: true,
                guestLists: {
                    include: {
                        guests: true
                    }
                },
                createdByUser: true,
            },
        });

        if (!event) {
            logError(`Event not found with ID ${id}`, "getEventById")
            return { error: { code: "missingResource", message: "Event not found" } }
        }

        return { data: event };
    } catch (err) {
        logError(err, "getEventById")
        return { error: { code: "internal", message: "Something went wrong" } }
    }
}

export async function createEvent(user: Session["user"], formData: EventFormValues): Promise<ActionResult<EventWithDetails>> {
    if (!hasAuth()) return { error: { code: "auth", message: "Not authenticated" } }
    const { eventName, eventDateTime, venueId: venue, guestLists } = formData;
    if (!eventName || !venue || !eventDateTime) {
        logError(`Missing required fields: eventName=${eventName}, venueId=${venue}, eventDateTime=${eventDateTime}`, "createEvent")
        return { error: { code: "generic", message: "Missing required fields" } }
    }

    try {
        const event = await prisma.$transaction(async (tx) => {
            const result = await tx.event.create({
                data: {
                    name: eventName,
                    venueId: venue,
                    eventDate: new Date(eventDateTime),
                    createdByUserId: user.id,
                },
                include: {
                    venue: true,
                    guestLists: {
                        include: {
                            guests: true
                        }
                    },
                    createdByUser: true
                }
            });

            if (guestLists?.length) {
                // Create guest lists within the same transaction
                for (const list of guestLists) {
                    await tx.guestList.create({
                        data: {
                            name: list.name,
                            eventId: result.id,
                            maxCapacity: list.maxCapacity,
                            createdByUserId: user.id,
                        }
                    });
                }
            }
            return result;
        })
        revalidatePath('/admin/desktop/events');
        return { data: event };
    } catch (err) {
        logError(err, "createEvent")
        return { error: { code: "internal", message: "Something went wrong" } }
    }
}

export async function updateEvent(user: Session["user"], id: number, formData: EventFormValues): Promise<ActionResult<EventWithDetails>> {
    if (!hasAuth()) return { error: { code: "auth", message: "Not authenticated" } }
    const { eventName, eventDateTime, venueId: venue, guestLists } = formData;
    if (!eventName || !venue || !eventDateTime) {
        logError(`Missing required fields: eventName=${eventName}, venueId=${venue}, eventDateTime=${eventDateTime}`, "updateEvent")
        return { error: { code: "generic", message: "Missing required fields" } }
    }

    try {
        const event = await prisma.$transaction(async (tx) => {
            const result = await tx.event.update({
                where: {
                    id: id,
                },
                data: {
                    name: eventName,
                    venueId: venue,
                    eventDate: new Date(eventDateTime),
                },
                include: {
                    venue: true,
                    guestLists: {
                        include: {
                            guests: true
                        }
                    },
                    createdByUser: true
                }
            });

            // Update guest lists within the same transaction
            if (guestLists?.length) {
                // First delete existing guest lists
                await tx.guestList.deleteMany({
                    where: {
                        eventId: id
                    }
                });

                // Then create new ones
                for (const list of guestLists) {
                    await tx.guestList.create({
                        data: {
                            name: list.name,
                            eventId: id,
                            maxCapacity: list.maxCapacity,
                            createdByUserId: user.id,
                        }
                    });
                }
            }
            return result;
        })

        revalidatePath(`/admin/desktop/events/${id}`);
        revalidatePath('/admin/desktop/events');

        return { data: event };
    } catch (err) {
        logError(err, "updateEvent")
        return { error: { code: "internal", message: "Something went wrong" } }
    }
}

export async function deleteEvent(id: number): Promise<ActionResult<null>> {
    if (!hasAuth()) return { error: { code: "auth", message: "Not authenticated" } }
    if (!id) {
        logError("Missing event ID", "deleteEvent")
        return { error: { code: "generic", message: "Something went wrong" } }
    }

    try {
        await prisma.event.delete({
            where: {
                id: id,
            }
        });
        revalidatePath('/admin/desktop/events');
        return { data: null };
    } catch (err) {
        logError(err, "deleteEvent")
        return { error: { code: "internal", message: "Failed to delete event" } }
    }
}


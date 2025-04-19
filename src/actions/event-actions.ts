'use server'

import { EventFormValues } from "@/form-schemas/event-forms";
import { prisma } from "@/lib/prisma";
import { updateEventGuestLists, createGuestLists } from "./guestlist-actions";
import { revalidatePath } from "next/cache";
import { Session } from "next-auth";

export async function getEvents() {
    const events = await prisma.event.findMany({
        include: {
            venue: true,
        },
        orderBy: {
            eventDate: 'desc',
        },
    });
    return events;
}

export async function getEventsByVenueId(venueId: number) {
    if (!venueId) {
        throw new Error("Venue ID is required");
    }

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

    if (!events) {
        throw new Error("Events not found");
    }

    return events;
}

export async function getEventsByUserId(userId: string) {
    if (!userId) throw new Error("UserId is required")
    const events = await prisma.event.findMany({
        where: {
            createdByUserId: userId
        },
        include: {
            venue: true
        }
    })

    if (!events) throw new Error("No events found")

    return events
}
 
export async function getEventById(id: number) {
    if (!id) {
        throw new Error("Event ID is required");
    }

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
        throw new Error("Event not found");
    }

    return event;
}

export async function createEvent(user: Session["user"], formData: EventFormValues) {
    const { eventName, eventDateTime, venueId: venue, guestLists } = formData;
    if (!eventName || !venue || !eventDateTime) {
        throw new Error("Missing required fields");
    }

    // Create event first
    const event = await prisma.event.create({
        data: {
            name: eventName,
            venueId: venue,
            eventDate: new Date(eventDateTime),
            createdByUserId: user.id,
        },
        include: {
            venue: true,
            guestLists: true,
        }
    });

    // Then create guest lists
    if (guestLists?.length) {
        await createGuestLists(user.id, event.id, guestLists);
    }

    revalidatePath('/admin/desktop/events');
    return event;
}

export async function updateEvent(user: Session["user"], id: number, formData: EventFormValues) {
    const { eventName, eventDateTime, venueId: venue, guestLists } = formData;
    if (!eventName || !venue || !eventDateTime)
{
        throw new Error("Missing required fields");
    }

    try {
        // Update event details
        const event = await prisma.event.update({
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
                guestLists: true,
            }
        });

        // Update guest lists separately
        if (guestLists?.length) {
            await updateEventGuestLists(user.id,id, guestLists);
        }

        revalidatePath(`/admin/desktop/events/${id}`);
        revalidatePath('/admin/desktop/events');
        
        return event;
    } catch (error) {
        console.error('Error updating event:', error);
        throw error;
    }
}

export async function deleteEvent(id: number) {
    if (!id) {
        throw new Error("Missing required fields");
    }

    const event = await prisma.event.delete({
        where: {
            id: id,
        }
    });

    revalidatePath('/admin/desktop/events');
    return event;
}


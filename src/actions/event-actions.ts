'use server'

import { FormValues } from "@/components/popups/CreateEvent";
import { prisma } from "@/lib/prisma";


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
                    guests: true,
                },
            },
        },
    });

    if (!event) {
        throw new Error("Event not found");
    }

    return event;
}

export async function createEvent(formData: FormValues) {
    const { eventName, eventDateTime, venue } = formData;
    if (!eventName || !venue || !eventDateTime) {
        throw new Error("Missing required fields");
    }

    const event = await prisma.event.create({
        data: {
            name: eventName,
            venueId: venue,
            eventDate: new Date(eventDateTime),
            guestLists: {
                create: {
                    name: "Default Guest List",
                    maxCapacity: 100
                }
            }
        }
    });

    return event;
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

    return event;
}

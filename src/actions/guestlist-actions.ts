import { prisma } from "@/lib/prisma";

export async function getGuestLists(eventId: number) {
    if (!eventId) {
        throw new Error("Event ID is required");
    }

    const guestLists = await prisma.guestList.findMany({
        where: {
            eventId: eventId,
        },
        include: {
            guests: true,
        },
    });

    return guestLists;
}

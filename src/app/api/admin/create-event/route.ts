import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const body = await request.json()
    const { title, venueId, date } = body

    const event = await prisma.event.create({
        data: {
            name: title,
            venueId,
            eventDate: new Date(date),
            guestLists: {
                create: {
                    name: "Default Guest List",
                    maxCapacity: 100
                }
            }
        }
    });

    return Response.json(event);
}

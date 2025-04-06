import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    const events = await prisma.event.findMany()
    return Response.json(events)
}

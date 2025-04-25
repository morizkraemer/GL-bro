'use server'
import { logError } from '@/lib/logger';
import { prisma } from '@/lib/prisma'
import { ActionResult } from '@/types/generic-types';
import { Venue } from '@prisma/client';

export async function getVenues(): Promise<ActionResult<Venue[]>> {
    try {
        const venues = await prisma.venue.findMany({});
        if (!venues) return { error: { code: "missingResource", message: "No venues found" } }
        return { data: venues }
    } catch (error) {
        logError(error, "getVenues")
        return { error: { code: "internal", message: "Something went wrong" } }
    }
}

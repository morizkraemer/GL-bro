'use server'

import { prisma } from '@/lib/prisma'
import { logError } from '@/lib/logger'
import { Guest } from '@/types/event-types'
import { ActionResult } from '@/types/generic-types'

export async function createGuest(name: string, plusOne: boolean, confirmed: boolean, guestListId: number): Promise<ActionResult<Guest>> {
    if (!name || plusOne === undefined || confirmed === undefined || !guestListId) {
        logError("Missing required fields for guest creation", "createGuest")
        return { error: { code: "generic", message: "Something went wrong" } }
    }

    try {
        const createdGuest = await prisma.guest.create({
            data: {
                name,
                plusOne,
                confirmed,
                guestListId
            }
        })
        return { data: createdGuest }
    } catch (err) {
        logError(err, "createGuest")
        return { error: { code: "internal", message: "Something went wrong" } }
    }
}

export async function createMultipleGuests(names: string[], plusOne: boolean, confirmed: boolean, guestListId: number): Promise<ActionResult<{ count: number }>> {
    if (!names || plusOne === undefined || confirmed === undefined || !guestListId) {
        logError("Missing required fields for multiple guest creation", "createMultipleGuests")
        return { error: { code: "generic", message: "Something went wrong" } }
    }

    try {
        const createdGuests = await prisma.guest.createMany({
            data: names.map((name) => {
                return {
                    name,
                    plusOne,
                    confirmed,
                    guestListId
                }
            })
        })
        return { data: createdGuests }
    } catch (err) {
        logError(err, "createMultipleGuests")
        return { error: { code: "internal", message: "Failed to create guests" } }
    }
}


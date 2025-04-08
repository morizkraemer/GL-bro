import { z } from "zod"

export const guestListSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, { message: "Guest list name is required" }),
    maxCapacity: z.number().min(1, { message: "Max capacity must be greater than 0" }),
})

export const eventSchema = z.object({
    eventName: z.string().min(1, { message: "Event name is required" }),
    eventDateTime: z.date({ required_error: "Event date and time are required" }),
    venueId: z.number(),
    guestLists: z.array(guestListSchema).min(1, { message: "At least one guest list is required" }),
})


export type GuestListFormValues = z.infer<typeof guestListSchema>
export type EventFormValues = z.infer<typeof eventSchema>

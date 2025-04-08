'use client'

import { createEvent } from "@/actions/event-actions";
import { useRouter } from "next/navigation";
import EventForm from "@/components/forms/EventForm";
import { EventFormValues } from "@/form-schemas/event-forms";
import { useSession } from "next-auth/react";

export default function CreateEventPage() {
    const router = useRouter();
    const {data: session} = useSession();
    
    async function onSubmit(values: EventFormValues) {
        try {
            const event = await createEvent(session!.user, values);
            router.push(`/admin/desktop/events/${event.id}`);
        } catch (error) {
            console.error('Error creating event:', error)
        }
    }

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Create New Event</h1>
            </div>
            <EventForm 
                onSubmit={onSubmit}
                onCancel={() => router.back()}
                submitLabel="Create Event"
            />
        </div>
    )
} 

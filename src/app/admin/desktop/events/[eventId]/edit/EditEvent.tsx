'use client'

import { updateEvent } from "@/actions/event-actions";
import { EventWithDetails } from "@/types/event-types";
import { useRouter } from "next/navigation";
import EventForm from "@/components/forms/EventForm";
import { EventFormValues } from "@/form-schemas/event-forms";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface Props {
    event: EventWithDetails;
}

export default function EditEvent({ event }: Props) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {data: session} = useSession();

    async function onSubmit(values: EventFormValues) {
        try {
            setIsSubmitting(true);
            await updateEvent(session!.user, event.id, values);
            router.push(`/admin/desktop/events/${event.id}`);
            router.refresh();
        } catch (error) {
            console.error('Error updating event:', error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Edit Event</h1>
            </div>
            <EventForm 
                event={event}
                onSubmit={onSubmit}
                onCancel={() => router.back()}
                submitLabel={isSubmitting ? "Saving..." : "Save Changes"}
                disabled={isSubmitting}
            />
        </div>
    )
}

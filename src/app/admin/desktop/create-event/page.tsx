'use client'

import CreateEventForm from "@/components/popups/CreateEvent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateEventPage() {
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Create Event</CardTitle>
                    <CardDescription>
                        Create a new event for your selected venue
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                    <p className="mb-4 text-sm text-muted-foreground">
                        Click the button below to create a new event
                    </p>
                    <CreateEventForm />
                </CardContent>
            </Card>
        </div>
    )
}

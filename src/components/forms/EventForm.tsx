'use client'

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PopoverTrigger, Popover, PopoverContent } from "@/components/ui/popover";
import TimePicker from "@/components/utils/TimePicker";
import { cn } from "@/lib/utils";
import { useVenueStore } from "@/stores/useVenuestore";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useEffect } from "react"
import { useForm } from "react-hook-form";
import { EventFormValues, eventSchema } from "@/form-schemas/event-forms";
import { EventWithDetails } from "@/types/event-types";
import GuestListForm from "./GuestListForm";

interface Props {
    event?: EventWithDetails;
    onSubmit: (values: EventFormValues) => Promise<void>;
    onCancel: () => void;
    submitLabel?: string;
    disabled?: boolean;
}

export default function EventForm({ event, onSubmit, onCancel, submitLabel = 'Save Changes', disabled = false }: Props) {
    const { selectedVenue } = useVenueStore()
    
    const form = useForm<EventFormValues>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            eventName: event?.name || '',
            eventDateTime: event ? new Date(event.eventDate) : new Date(),
            venueId: event?.venueId || selectedVenue?.id,
            guestLists: event?.guestLists?.map((guestList) => ({
                id: guestList.id,
                name: guestList.name,
                maxCapacity: guestList.maxCapacity || 0,
            })) || [],
        },
    })

    useEffect(() => {
        if (selectedVenue) {
            form.setValue('venueId', selectedVenue.id);
        }
    }, [selectedVenue, form]);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6 py-4"
            >
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-8">
                        <FormField
                            control={form.control}
                            name="eventName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Event name"
                                            {...field}
                                            disabled={disabled}
                                            className="bg-secondary/40 border-border"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="col-span-4">
                        <FormField
                            control={form.control}
                            name="venueId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Venue</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="No venue selected"
                                            value={selectedVenue?.name || ""}
                                            disabled
                                            className="bg-secondary/40 border-border"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-16 gap-4">
                    <div className="col-span-16">
                        <FormField
                            control={form.control}
                            name="eventDateTime"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="col-span-8">
                                            <FormLabel className="mb-1 block">Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                'w-full pl-3 text-left font-normal bg-secondary/40 border-border h-10',
                                                                !field.value && 'text-muted-foreground'
                                                            )}
                                                            disabled={disabled}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, 'PPP')
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={(date) => {
                                                            if (date) {
                                                                const currentValue = field.value || new Date();
                                                                date.setHours(currentValue.getHours());
                                                                date.setMinutes(currentValue.getMinutes());
                                                                field.onChange(date);
                                                            } else {
                                                                field.onChange(undefined);
                                                            }
                                                        }}
                                                        disabled={(date) => {
                                                            const today = new Date();
                                                            today.setHours(0, 0, 0, 0);
                                                            const checkDate = new Date(date);
                                                            checkDate.setHours(0, 0, 0, 0);
                                                            return checkDate < today || disabled;
                                                        }}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <div className="col-span-4">
                                            <TimePicker
                                                date={field.value}
                                                setDate={(newDate) => {
                                                    if (newDate) {
                                                        const currentValue = field.value || new Date();
                                                        newDate.setFullYear(currentValue.getFullYear());
                                                        newDate.setMonth(currentValue.getMonth());
                                                        newDate.setDate(currentValue.getDate());
                                                        field.onChange(newDate);
                                                    } else {
                                                        field.onChange(undefined);
                                                    }
                                                }}
                                                disabled={disabled}
                                            />
                                        </div>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-16 gap-4">
                    <div className="col-span-16">
                        <GuestListForm form={form} disabled={disabled} />
                    </div>
                </div>

                <div className="flex justify-center gap-2 mt-6">
                    <Button 
                        type="button" 
                        variant="outline" 
                        className="border-border" 
                        onClick={onCancel}
                        disabled={disabled}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        className="bg-primary hover:bg-primary/90"
                        disabled={disabled}
                    >
                        {submitLabel}
                    </Button>
                </div>
            </form>
        </Form>
    )
} 

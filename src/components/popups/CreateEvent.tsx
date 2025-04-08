'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { z } from 'zod'
import { CalendarIcon, Plus } from 'lucide-react'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
    DialogHeader,
} from '@/components/ui/dialog'
import { useVenueStore } from '@/stores/useVenuestore'
import TimePicker from '../utils/TimePicker'
import { EventFormValues, eventSchema } from '@/form-schemas/event-forms'
import { useSession } from 'next-auth/react'
import { createEvent } from '@/actions/event-actions'

// Form schema with proper validation

export default function CreateEventForm() {
    const { selectedVenue } = useVenueStore()
    const [open, setOpen] = useState(false)
    const {data:session, status} = useSession();

    const form = useForm<EventFormValues>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            eventName: '',
            eventDateTime: undefined,
            venueId: undefined,
            guestLists: [
                {
                    name: "Default Guest List",
                    maxCapacity: 0
                }
            ]
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "guestLists",
    })

    const handleRemove = (index: number) => {
        const currentValues = form.getValues()
        remove(index)
        form.reset({
            ...currentValues,
            guestLists: currentValues.guestLists.filter((_, i) => i !== index)
        })
    }

    useEffect(() => {
        if (selectedVenue) {
            form.setValue('venueId', selectedVenue.id);
        }
    }, [selectedVenue, form]);

    async function onSubmit(values: EventFormValues) {
        try {
                // TODO need to add to user object in next auth
                await createEvent(session!.user,values);

            setOpen(false)

            form.reset()
        } catch (error) {
            console.error('Error submitting form:', error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger type='button' className='border border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground/90 rounded-md px-4 py-2'>
                Create Event
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-background border-border">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-semibold">Create New Event</DialogTitle>
                    <DialogDescription className="text-center">
                        Fill in the details to create a new event at {selectedVenue?.name || "your venue"}
                    </DialogDescription>
                </DialogHeader>

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
                                                                    return checkDate < today;
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
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Guest Lists</h3>
                                    
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-12 gap-4 text-sm text-muted-foreground border-b pb-2">
                                            <div className="col-span-6">Guest List Name</div>
                                            <div className="col-span-4 text-right">Max Capacity</div>
                                            <div className="col-span-2"></div>
                                        </div>
                                        
                                        {fields.map((field, index) => (
                                            <div key={field.id} className="grid grid-cols-12 gap-4 items-center p-3 border rounded-lg bg-secondary/20">
                                                <div className="col-span-6">
                                                    <FormField
                                                        control={form.control}
                                                        name={`guestLists.${index}.name`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input 
                                                                        placeholder="Guest List Name"
                                                                        className="h-8"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="col-span-4 flex justify-end">
                                                    <FormField
                                                        control={form.control}
                                                        name={`guestLists.${index}.maxCapacity`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input 
                                                                        type="number" 
                                                                        className='w-16 h-8' 
                                                                        placeholder="0"
                                                                        min="0"
                                                                        {...field}
                                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="col-span-2 flex justify-end">
                                                    <Button 
                                                        type="button"
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="text-destructive hover:text-destructive/90"
                                                        onClick={() => handleRemove(index)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Button 
                                        type="button"
                                        variant="outline" 
                                        className="w-full border-border"
                                        onClick={() => append({ name: '', maxCapacity: 0 })}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Guest List
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-2 mt-6">
                            <Button type="button" variant="outline" className="border-border" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-primary hover:bg-primary/90">Save Event</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}


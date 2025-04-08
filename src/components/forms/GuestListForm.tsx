'use client'

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { EventFormValues } from "@/form-schemas/event-forms";

interface Props {
    form: UseFormReturn<EventFormValues>;
    disabled?: boolean;
}

export default function GuestListForm({ form, disabled = false }: Props) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "guestLists",
    });

    const handleRemove = (index: number) => {
        const currentValues = form.getValues();
        remove(index);
        form.reset({
            ...currentValues,
            guestLists: currentValues.guestLists.filter((_, i) => i !== index)
        });
    };

    const handleAppend = () => {
        // Don't include an id for new guest lists
        append({
            name: '',
            maxCapacity: 0
        });
    };

    return (
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
                                                disabled={disabled}
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
                                                disabled={disabled}
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
                                disabled={disabled}
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
                onClick={handleAppend}
                disabled={disabled}
            >
                <Plus className="w-4 h-4 mr-2" />
                Add Guest List
            </Button>
        </div>
    );
} 
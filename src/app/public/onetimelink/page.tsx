'use client'

import { createGuest, createMultipleGuests } from '@/actions/guest-actions'
import { decodeToken, getLinkById } from '@/actions/link-actions'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Link, LinkWithDetails } from '@/types/event-types'
import { PageError } from '@/types/generic-types'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { logError } from '@/lib/logger'

type FormValues = {
    fields: string[]
}

export default function OneTimeLinkPage() {
    const searchParams = useSearchParams()
    const [link, setLink] = useState<LinkWithDetails | null>(null)
    const [pageError, setPageError] = useState<PageError | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [finished, setFinished] = useState<boolean>(false)

    const form = useForm<FormValues>({
        defaultValues: { fields: [] },
        mode: "onChange"
    })

    useEffect(() => {
        async function fetchLink() {
            const tokenFromUrl = searchParams.get('token')
            if (!tokenFromUrl) {
                setPageError({ code: "generic", message: "Invalid link" })
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                const { error: tokenError, data: decoded } = await decodeToken(tokenFromUrl)
                if (tokenError) {
                    setPageError(tokenError)
                    setLoading(false)
                    return
                }

                const { error: linkError, data: linkResponse } = await getLinkById(decoded.linkId)
                if (linkError) {
                    setPageError(linkError)
                    setLoading(false)
                    return
                }

                if (!linkResponse) {
                    setPageError({ code: "generic", message: "Invalid link" })
                    setLoading(false)
                    return
                }

                setLink(linkResponse)
                form.reset({
                    fields: Array(linkResponse.capacity).fill("")
                })
            } catch (err) {
                logError(err, "client error fetching link")
                setPageError({ code: "generic", message: "Something went wrong" })
            } finally {
                setLoading(false)
            }
        }
        fetchLink()
    }, [searchParams])

    async function onSubmit(data: FormValues) {
        // Validate that all fields have values
        const hasEmptyFields = data.fields.some(field => !field.trim())
        if (hasEmptyFields) {
            form.setError("fields", {
                type: "manual",
                message: "Please enter all names"
            })
            return
        }

        try {
            if (data.fields.length === 1) {
                const { error } = await createGuest(data.fields[0], link!.plusOne, !link!.needsConfirmation, link!.guestlistId)
                if (error) {
                    toast.error(error.message)
                    return
                }
                setFinished(true)
            } else if (data.fields.length > 1) {
                const { error } = await createMultipleGuests(data.fields, link!.plusOne, !link!.needsConfirmation, link!.guestlistId)
                if (error) {
                    toast.error(error.message)
                    return
                }
                setFinished(true)
            } else {
                toast.error("Could not create guest entries")
            }
        } catch (err) {
            logError(err, "client error submitting guest form")
            toast.error("Something went wrong")
        }
    }

    if (loading) return <div>Loading...</div>
    if (pageError) return <div>{pageError.message}</div>
    if (finished) return <div>Successfully added to the guest list!</div>

    return (
        <div className="flex flex-col min-h-[100dvh] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] px-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
            <div className="w-full flex flex-col h-fit border-b-2 border-white p-2">
                <h2 className="text-2xl text-gray-400 text-left">Guestlist for: </h2>
                <div className="text-right">
                    <h3 className="text-gray-600">{link?.GuestList.event.eventDate.toDateString()}</h3>
                    <h1 className="text-4xl">{link?.GuestList.event.name}</h1>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 p-5">
                    <div className="flex flex-col flex-1 md:flex-none md:justify-center max-w-md mx-auto w-full">
                        <div className="text-xl text-center px-5 mb-8 space-y-2">
                            {link!.capacity > 1 ? (
                                <div className="space-y-2">
                                    <p className="whitespace-nowrap">you have {link?.capacity} spots</p>
                                    <p className="whitespace-nowrap">add their first & last names</p>
                                    {link?.plusOne && <p className="whitespace-nowrap">all spots include a +1</p>}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <p className="whitespace-nowrap">add your first & last name</p>
                                    {link?.plusOne && <p className="whitespace-nowrap">you can bring a plus one</p>}
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            {form.watch("fields").map((_, index) => (
                                <FormField
                                    key={index}
                                    name={`fields.${index}` as const}
                                    control={form.control}
                                    rules={{
                                        required: "Name is required",
                                        minLength: {
                                            value: 2,
                                            message: "Name must be at least 2 characters"
                                        }
                                    }}
                                    render={({ field, fieldState: { error } }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    className="w-full h-14 rounded-none border-t-4 border-l-4 border-r-4 border-gray-300 border-b-4 hover:border-black focus:border-black bg-white px-4 py-3 text-xl font-extrabold tracking-wide text-center uppercase transition-all duration-300 ease-in-out focus:outline-none focus:ring-0 focus:scale-[1.02] focus:shadow-[0_0_0_4px_rgba(0,0,0,0.1)] dark:bg-black dark:border-gray-700 dark:border-b-white dark:hover:border-white dark:focus:border-white dark:focus:shadow-[0_0_0_4px_rgba(255,255,255,0.1)] placeholder:font-normal placeholder:tracking-normal placeholder:normal-case placeholder:opacity-60"
                                                    placeholder={link!.capacity > 1 ? `Guest ${index + 1}` : "your name"}
                                                    {...field}
                                                />
                                            </FormControl>
                                            {error && (
                                                <p className="text-red-500 text-sm mt-1">{error.message}</p>
                                            )}
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>

                        <div className="mt-8 md:mt-8 max-w-xs mx-auto w-full">
                            <Button className="w-full h-14 text-xl rounded-none font-extrabold tracking-wide uppercase">
                                SUBMIT
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}

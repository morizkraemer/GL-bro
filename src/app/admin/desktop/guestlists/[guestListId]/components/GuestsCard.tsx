import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { GuestListWithDetails } from "@/types/event-types"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { CheckCircle, CheckSquare, CircleX, MinusSquare } from "lucide-react"

const GuestsCard = ({guestList, guestCount}: {guestList: GuestListWithDetails, guestCount: number}) => {

    return (
            <Card>
                <CardHeader>
                    <CardTitle>Guests ({guestCount})</CardTitle>
                </CardHeader>
                <CardContent>
                    {guestList.guests.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground">
                            No guests have been added to this list yet.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Name</TableHead>
                                        <TableHead>Plus one</TableHead>
                                    <TableHead>Confirmed</TableHead>
                                    <TableHead>Added On</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {guestList.guests.map((guest) => (
                                    <TableRow key={guest.id} className="hover:bg-gray-900">
                                        <TableCell className="font-medium">{guest.name}</TableCell>
                                        <TableCell>{guest.plusOne ? <CheckCircle /> : <CircleX />}</TableCell>
                                        <TableCell>{guest.confirmed ? <CheckSquare /> :
                                            <div className="flex items-center gap-x-2">
                                                <MinusSquare />
                                                <Button variant="destructive">Confirm</Button>
                                            </div>}</TableCell>
                                        <TableCell>{format(new Date(guest.createdAt), 'PPP', { locale: de })}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
                <CardFooter>
                    <Button>Add Guest</Button>
                </CardFooter>
            </Card>
    )
}
export default GuestsCard

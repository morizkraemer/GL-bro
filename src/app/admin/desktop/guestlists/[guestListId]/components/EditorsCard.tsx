import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table } from "@/components/ui/table"

export default function EditorsCard() {

    return (
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>Editors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {
                            true ? (
                            <div>no editors yet</div>
                            ) : 
                                <Table></Table>
                        }
                    </CardContent>
                    <CardFooter>
                        <Button variant="default">Add new</Button>
                    </CardFooter>
                </Card>
    )
}

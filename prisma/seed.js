import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Running seed script...')

        // Create organization
        const organization = await prisma.organization.create({
            data: {
                name: "Rich asshole GmbH"
            },
        })

        console.log('Created organization:', organization.id)

        // Create venues
        const venue1 = await prisma.venue.create({
            data: {
                name: 'Bahnhof Pauli',
                capacity: 450,
                organizationId: organization.id,
                address: 'Spielbudenplatz 21/22, 20359 Hamburg',
            },
        })

        const venue2 = await prisma.venue.create({
            data: {
                name: 'Tranzit',
                capacity: 450,
                organizationId: organization.id,
                address: 'Spielbudenplatz 21/22 20359 Hamburg',
            },
        })

        console.log('Created venues')

        // Create users
        const testPassword = await bcrypt.hash('123456', 10)

        const user1 = await prisma.user.create({
            data: {
                name: 'Carlos Frank',
                email: 'carlos@example.com',
                password: testPassword,
                role: 'admin',
                organizationId: organization.id,
            },
        })

        const user2 = await prisma.user.create({
            data: {
                name: 'Alexander Haase',
                email: 'alex@example.com',
                password: testPassword,
                role: 'admin',
                organizationId: organization.id,
            },
        })

        const user3 = await prisma.user.create({
            data: {
                name: 'Test User',
                email: 'test@example.com',
                password: testPassword,
                role: 'admin',
                organizationId: organization.id,
            },
        })

        console.log('Created users:', user1.name, user2.name, user3.name)

        // Event dates
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)

        const nextWeek = new Date()
        nextWeek.setDate(nextWeek.getDate() + 7)

        const twoWeeks = new Date()
        twoWeeks.setDate(twoWeeks.getDate() + 14)

        const threeWeeks = new Date()
        threeWeeks.setDate(threeWeeks.getDate() + 21)

        // Create events
        const event1 = await prisma.event.create({
            data: {
                name: 'Konzert1',
                venueId: venue1.id,
                eventDate: tomorrow,
                createdByUserId: user1.id,
                active: true,
                guestLists: {
                    create: {
                        name: 'Default Guest List',
                        maxCapacity: 50,
                        createdByUserId: user1.id,
                        guests: {
                            create: [
                                {
                                    name: 'John Doe',
                                    email: 'john@example.com',
                                    confirmed: true,
                                    plusOne: true
                                },
                                {
                                    name: 'Jane Smith',
                                    email: 'jane@example.com',
                                    confirmed: true,
                                    plusOne: false
                                },
                            ],
                        },
                    },
                },
            },
        })

        const event2 = await prisma.event.create({
            data: {
                name: 'Entrance',
                venueId: venue2.id,
                eventDate: nextWeek,
                createdByUserId: user1.id,
                active: true,
                guestLists: {
                    create: {
                        name: 'Default Guest List',
                        maxCapacity: 50,
                        createdByUserId: user1.id,
                        guests: {
                            create: [
                                {
                                    name: 'Bob Wilson',
                                    email: 'bob@example.com',
                                    confirmed: true,
                                    plusOne: true
                                },
                                {
                                    name: 'Alice Brown',
                                    email: 'alice@example.com',
                                    confirmed: true,
                                    plusOne: true

                                },
                            ],
                        },
                    },
                },
            },
        })

        const event3 = await prisma.event.create({
            data: {
                name: 'Konzert2',
                venueId: venue1.id,
                eventDate: twoWeeks,
                createdByUserId: user2.id,
                active: true,
                guestLists: {
                    create: {
                        name: 'Default Guest List',
                        maxCapacity: 50,
                        createdByUserId: user2.id,
                        guests: {
                            create: [
                                {
                                    name: 'Tom Johnson',
                                    email: 'tom@example.com',
                                    confirmed: true,
                                    plusOne: true

                                },
                                {
                                    name: 'Sarah Miller',
                                    email: 'sarah@example.com',
                                    confirmed: true,
                                    plusOne: false

                                },
                            ],
                        },
                    },
                },
            },
        })

        const event4 = await prisma.event.create({
            data: {
                name: 'NiteBox',
                venueId: venue2.id,
                eventDate: threeWeeks,
                createdByUserId: user2.id,
                active: true,
                guestLists: {
                    create: {
                        name: 'Default Guest List',
                        maxCapacity: 50,
                        createdByUserId: user2.id,
                        guests: {
                            create: [
                                {
                                    name: 'Mike Davis',
                                    email: 'mike@example.com',
                                    confirmed: true
                                },
                                {
                                    name: 'Lisa Taylor',
                                    email: 'lisa@example.com',
                                    confirmed: true
                                },
                            ],
                        },
                    },
                },
            },
        })

        console.log('Created events:', event1.id, event2.id, event3.id, event4.id)
    } catch (error) {
        console.error('Error during seeding:', error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()

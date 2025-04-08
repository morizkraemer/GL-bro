import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs' // optional if you're hashing the password

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Running seed script...')

    // Create venues
    const venue1 = await prisma.venue.create({
      data: {
        name: 'Bahnhof Pauli',
        capacity: 450,
      },
    })

    const venue2 = await prisma.venue.create({
      data: {
        name: 'Tranzit',
        capacity: 450,
      },
    })

    console.log('Created venues')

    // Create a default user (event creator)
    const hashedPassword = await bcrypt.hash('test123', 10)

    const user = await prisma.user.create({
      data: {
        name: 'Alice Organizer',
        email: 'alice@example.com',
        password: hashedPassword,
        role: 'admin',
      },
    })

    console.log('Created user:', user.id)

    // Event dates
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)

    // Create events
    const event1 = await prisma.event.create({
      data: {
        name: 'Konzert at Bahnhof',
        venueId: venue1.id,
        eventDate: tomorrow,
        createdByUserId: user.id,
        guestLists: {
          create: {
            name: 'Default Guest List',
            maxCapacity: 50,
          },
        },
      },
    })

    const event2 = await prisma.event.create({
      data: {
        name: 'Konzert at Tranzit',
        venueId: venue2.id,
        eventDate: nextWeek,
        createdByUserId: user.id,
        guestLists: {
          create: {
            name: 'Default Guest List',
            maxCapacity: 50,
          },
        },
      },
    })

    console.log('Created events:', event1.id, event2.id)
  } catch (error) {
    console.error('Error during seeding:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
